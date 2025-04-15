import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

//GET ALL
export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// GET ONE
export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// CREATE
export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage(post);

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

// UPDATE
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with that id: ${_id}`);

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });


    res.json(updatedPost);
}

// DELETE
export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully." });
}

// LIKE
export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`)
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(
        id,
        { $inc: { likeCount: 1 } },
        { new: true }
    );

    if (!updatedPost) return res.status(404).send("Post not found");

    res.json(updatedPost);

};

