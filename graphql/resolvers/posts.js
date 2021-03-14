const Post = require('../../models/Post');
const { AuthenticationError, UserInputError } = require('apollo-server');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query:{
        async getPosts(){
            try {
                const posts = await Post.find().sort({ createdAt: -1});//ไปเอา model post มา แล้วมา export ออกไป post.find() หาทุกอย่าง
                return posts;//อันข้างบน sort ได้ เรียงตามเวลาล่าสุด
            } catch (error) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

    },
    Mutation:{
        async createPost(_, { body }, context) {
            const user = checkAuth(context);//เช็คก่อนว่า user ถูกต้องไหม

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({ // เก็บ post ลงตามโมเดลที่สร้างไว้
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();//save post

            context.pubsub.publish('NEW_POST', {//ตรงนี้บ่ฮู้ น่าจะทำให้ post เรียกใช้ผ่าน NEW_POST
                newPost: post
            });
            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {//เช็คว่าใช่เจ้าของโพสต์ไหม?
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);
        
            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find((like) => like.username === username)) {
                // Post already likes, unlike it อันไลค์แม่ง
                post.likes = post.likes.filter((like) => like.username !== username);
                } else {
                // Not liked, like post
                post.likes.push({
                    username,
                    createdAt: new Date().toISOString()
                });
                }
        
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        
        },
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}