'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')
const Tag = use('App/Models/Tag')

class QuestionController {
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
            console.error(e);
            return response.send('save failed', 500);
        }

        return response.send('save success', 200);
    }
}

module.exports = QuestionController
