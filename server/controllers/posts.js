import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

// GET ALL
export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        console.log("📦 Fetched posts:", posts);

        res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT),
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(404).json({ message: error.message });
    }
};

// GET POSTS BY SEARCH
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({
            $or: [{ title }, { message: title }, { tags: { $in: tags ? tags.split(',') : [] } }],
        });
        res.status(200).json({ data: posts });
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(404).json({ message: error.message });
    }
};

// GET ONE
export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE
export const createPost = async (req, res) => {
    const post = req.body;
    console.log("Request body:", post);
    if (!post || Object.keys(post).length === 0) {
        return res.status(400).json({ message: "Post data is empty" });
    }
    try {
        const newPost = new PostMessage({
            ...post,
            creator: req.userId,
            createdAt: new Date().toISOString(),
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(400).json({ message: error.message });
    }
};

// UPDATE
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ message: `Invalid post ID: ${_id}` });
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(
            _id,
            { ...post, _id },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(400).json({ message: error.message });
    }
};

// DELETE
export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `Invalid post ID: ${id}` });
        }
        const post = await PostMessage.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(400).json({ message: error.message });
    }
};

// LIKE
export const likePost = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `Invalid post ID: ${id}` });
        }
        const post = await PostMessage.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!post.likes) {
            post.likes = [];
        }
        const index = post.likes.findIndex((id) => id === String(req.userId));

        if (index === -1) {
            post.likes.push(req.userId); // Like
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));// Unlike
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(400).json({ message: error.message });
    }
};