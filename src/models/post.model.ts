import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) =>
                v.endsWith(".jpg") ||
                v.endsWith(".png") ||
                v.endsWith(".jpeg") ||
                v.endsWith(".webp"),
            message: "Thumbnail must be a valid image file",
        },
    },
    tags: {
        type: [String],
        required: true,
        enum: ["Business", "Gaming", "Technology", "Health", "News"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
