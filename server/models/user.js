import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    imageUrl: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    likes: { type: Number, default: 0 },
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);