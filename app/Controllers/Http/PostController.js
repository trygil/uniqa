'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')

class PostController {
    async getPostReports({request, response}) {
        const params = request.all();
        let query = Database.table('posts as p');

        query.join("users as u", "u.id", "=", "p.user_id")
            .join("reports as r", "r.post_id", "=", "p.id")
            .groupBy(["p.id", "u.id"])
            .select([
                "p.*", 
                "u.username", 
                Database.raw("COUNT(r.*) AS report_count"),
            ]);

        let sortby = [params.sortby];
        if (params.sortby == 'post_type')
            sortby = [Database.raw('(p.parent_id IS NOT NULL)::int')];

        if (params.sortby == 'report_count')
            sortby = [Database.raw('COUNT(r.*)')];

        if (params.sortby)
            for (let i in sortby)
                query.orderBy(sortby[i], JSON.parse(params.asc) ? 'asc' : 'desc');

        let posts = [];

        try {
            posts = await query.paginate(params.page, params.perpage);
        } catch(e) {
            console.error(e);
        }

        return posts
    }

    async deletePost({request, response, params}) {
        // start transaction
        const trx = await Database.beginTransaction()

        // get question post
        const post = await Post.find(params.id);

        try {
            if (!post)
                throw new Error("post not found");

            post.delete(trx);

            trx.commit();
        } catch(e) {
            trx.rollback();
            console.error(e)

            return response.status(500).send("failed to delete status");
        }

        return response.send("post deleted");
    }
}

module.exports = PostController
