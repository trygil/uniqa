'use strict'

const Post = use('App/Models/Post')

class QuestionController {
    async postQuestion({request, response, auth}) {
        const params = request.all();
        const user = await auth.getUser();


        let post = null;

        if (params.id)
            post = await Post.find(params.id);

        // create new post
        post = new Post();

        post.fill({
            title: params.question,
            post: params.description,
            user_id: user.id,
            parent_id: null,
        });


        try {
            await post.save();
        } catch(e) {
            return response.send('save failed', 500);
        }

        return response.send('save success', 200);
    }
}

module.exports = QuestionController
