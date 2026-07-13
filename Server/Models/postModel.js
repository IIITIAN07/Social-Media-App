import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        desc: String,
        likes: [],
        image: String,
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            default: 'image'
        },
        comments: [
            {
                userId: String,
                name: String,
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true,
    }
)

const postModel = mongoose.model("Posts", postSchema);

export default postModel
