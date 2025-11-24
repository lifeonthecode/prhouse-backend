const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    post: {
        url: String,
        public_id: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, { timestamps: true });

const Post = model("Post", postSchema);
module.exports = Post;