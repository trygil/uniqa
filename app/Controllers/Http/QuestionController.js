'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')
const Tag = use('App/Models/Tag')
const _ = use('lodash')

class QuestionController {
    async hot({ request }) {
        return await Database.table('posts as p')
            .select(['up.*', 'p.*'])
            .leftJoin('users as up', 'up.id', 'p.user_id')
            .where("p.parent_id", null)
            .orderBy(Database.raw('to_char(p.created_at, \'YYYY-MM\')'), 'desc')
            .orderBy('p.upvote', 'desc')
            .limit(request.input('size', 10))
    }

    async list({ request }) {
        const params = request.all();
        const query = Database.table('posts as p')
            .where("p.parent_id", null)
            .orderBy('p.created_at', 'desc')
            .orderBy('p.upvote', 'desc')

        return await query.paginate(params.page || 1, params.perpage || 10);
    }

    async retrieve({ params, auth }) {
        const user = await auth.getUser();

        const question = await Database.table('posts as p')
            .leftJoin('users as u', 'u.id', 'p.user_id')
            .leftJoin('post_upvotes as pu', (qry) => {
                qry.on('pu.post_id', 'p.id');
                qry.on('pu.user_id', user.id);
            })
            .where('p.id', params.id)
            .select(['p.*', 'u.username', Database.raw("pu.val AS upvoted")])
            .first();

        question.comments = await Database.table('comments as c')
            .leftJoin('users as u', 'u.id', 'c.user_id')
            .where("c.post_id", params.id)
            .select(['c.*', 'u.username']);

        // arrange data post & comment
        const posts = {};

        await Database.table('posts as p')
            .leftJoin('comments as c', 'c.post_id', 'p.id')
            .leftJoin('users as up', 'up.id', 'p.user_id')
            .leftJoin('users as uc', 'uc.id', 'c.user_id')
            .leftJoin('post_upvotes as pu', (qry) => {
                qry.on('pu.post_id', 'p.id');
                qry.on('pu.user_id', user.id);
            })
            .where("p.parent_id", params.id)
            .orderBy('c.created_at', 'desc')
            .select([
                "p.*",
                Database.raw("pu.val AS upvoted"),
                "up.username as username",
                "uc.username as c_username",
                "c.user_id as c_user_id",
                "c.user_id as c_user_id",
                "c.comment as c_comment",
                "c.created_at as c_created",
            ])
            .map(item => {
                const { c_user_id, c_username, c_comment, c_created, ...postItem } = item;

                if (typeof posts[item.id] === "undefined") {
                    posts[item.id] = postItem;
                    posts[item.id].comments = [];
                }

                if (c_user_id !== null) {
                    posts[item.id].comments.push({
                        user_id: c_user_id,
                        username: c_username,
                        comment: c_comment,
                        created: c_created,
                    });
                }
            });

        question.posts = _.orderBy(posts, ["upvote"], ["desc"]);

        return question;
    }

    async postQuestion({request, response, auth}) {
        const params = request.all();
        const user = await auth.getUser();

        const trx = await Database.beginTransaction()

        let post = null;

        if (params.id)
            post = await Post.find(params.id);

        // create new post
        post = new Post();

        try {
            let post_data = {};

            // handle tags
            if (params.tags instanceof Array && params.tags.length > 0) {
                let binding_signs = new Array(params.tags.length).fill("?");
                let query = 'DELETE FROM tags WHERE tag IN (' + binding_signs.join(', ') + ')';

                // delete existing tags
                await Database.raw(query, params.tags)

                let tags = params.tags.map((tag) => { return {"tag": tag} });

                // insert tags
                await Tag.createMany(tags, trx)

                post_data.tags = tags;
            }

            post.fill({
                title: params.question,
                post: params.description,
                user_id: user.id,
                parent_id: null,
                data: JSON.stringify(post_data),
            });

            await post.save(trx);

            trx.commit();
        } catch(e) {
            trx.rollback();
            return response.status(500).send('save failed');
        }

        return response.send('save success');
    }

    async postAnswer({request, response, auth}) {
        const params = request.all();
        const user = await auth.getUser();

        const trx = await Database.beginTransaction()

        const parent_post = await Post.find(params.post_id);

        if (!parent_post)
            return response.status(500).send('save failed');

        // create new post
        let post = new Post();

        try {
            post.fill({
                title: params.title,
                post: params.post,
                user_id: user.id,
                parent_id: parent_post.id,
            });

            await post.save(trx);

            trx.commit();
        } catch(e) {
            trx.rollback();
            return response.status(500).send('save failed');
        }

        return response.send('save success');
    }

    async postUpvote({params, request, response, auth}) {
        const url_params = request.all();
        const user = await auth.getUser();
        const val = url_params.val;

        const trx = await Database.beginTransaction()

        const post = await Post.find(params.id);

        if (!post)
            return response.status(500).send('upvote failed');

        try {
            let sql = 
                "INSERT INTO post_upvotes " +
                "(post_id, user_id, val, created_at, updated_at) " +
                "VALUES (?, ?, ?, current_timestamp, current_timestamp) " + 
                "ON CONFLICT (post_id, user_id) DO UPDATE SET " + 
                "updated_at = current_timestamp, " + 
                "val = excluded.val";

            // save upvote
            await trx.raw(sql, [post.id, user.id, val]);

            // get total upvotes
            sql = "SELECT COALESCE(SUM(val), 0) AS upvotes FROM post_upvotes WHERE post_id = ?";

            let total_upvotes = 0;
            let response = await trx.raw(sql, [post.id]);

            if (response)
                total_upvotes = response.rows[0].upvotes;

            // update total upvotes
            post.upvote = total_upvotes;
            await post.save(trx);

            trx.commit();
        } catch(e) {
            trx.rollback();
            console.error(e)

            return response.status(500).send(post.upvote);
        }

        return response.send(post.upvote);
    }

    async postChoose({params, request, response, auth}) {
        const url_params = request.all();
        const user = await auth.getUser();

        // start transaction
        const trx = await Database.beginTransaction()
        // get question post
        const post = await Post.query()
                            .where("id", params.id)
                            .where("user_id", user.id)
                            .first();

        console.log(post)

        try {
            if (!post)
                throw new Error("post not found");

            // update each of answer status to default value
            await trx.table('posts').where("parent_id", post.id).update({
                status: 0,
            });

            // reset answer status
            post.status = 0;

            if (url_params.id) {
                // get choosen answer post
                const choosen_post = await Post.find(url_params.id);

                if (!choosen_post)
                    throw new Error("choosen id not found");

                choosen_post.status = 1;
                await choosen_post.save(trx);

                post.status = 1;
            }

            await post.save(trx);

            trx.commit();
        } catch(e) {
            trx.rollback();
            console.error(e)

            return response.status(500).send(0);
        }

        return response.send(post.status);
    }

    async deleteQuestion({params, request, response, auth}) {
        const user = await auth.getUser();

        // start transaction
        const trx = await Database.beginTransaction()

        // get question post
        const post = await Post.query()
                                .where("id", params.id)
                                .where("user_id", user.id)
                                .first();

        try {
            if (!post)
                throw new Error("post not found");

            // delete questions and all related post
            await trx.table('posts')
                    .where("id", post.id)
                    .orWhere("parent_id", post.id).delete();

            trx.commit();
        } catch(e) {
            trx.rollback();
            console.error(e)

            return response.status(500).send("failed to delete status");
        }

        return response.send("post deleted");
    }
}

module.exports = QuestionController
