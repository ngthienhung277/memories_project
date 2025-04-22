import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = process.env.JWT_SECRET || 'test';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

        // Không gửi password trong response
        const userWithoutPassword = {
            _id: oldUser._id,
            name: oldUser.name,
            email: oldUser.email,
            imageUrl: oldUser.imageUrl,
            likes: oldUser.likes,
            likedPosts: oldUser.likedPosts,
            createdAt: oldUser.createdAt
        };

        res.status(200).json({ result: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing signup information" });
    }

    try {
        const oldUser = await UserModal.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        // Tạo Gravatar URL cho avatar mặc định
        const gravatarUrl = `https://www.gravatar.com/avatar/${email}?d=identicon`;

        const result = await UserModal.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            imageUrl: gravatarUrl
        });

        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

        // Không gửi password trong response
        const userWithoutPassword = {
            _id: result._id,
            name: result.name,
            email: result.email,
            imageUrl: result.imageUrl,
            likes: result.likes,
            likedPosts: result.likedPosts,
            createdAt: result.createdAt
        };

        res.status(201).json({ result: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

export const googleAuth = async (req, res) => {
    const { result } = req.body;

    try {
        console.log('Received Google auth request:', result);

        if (!result?.email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Tìm user theo email hoặc googleId
        const existingUser = await UserModal.findOne({
            $or: [
                { email: result.email },
                { googleId: result.sub }
            ]
        });

        if (existingUser) {
            // Luôn cập nhật thông tin từ Google
            existingUser.imageUrl = result.imageUrl;
            existingUser.name = result.name;
            existingUser.firstName = result.firstName || result.name.split(' ')[0];
            existingUser.lastName = result.lastName || result.name.split(' ').slice(1).join(' ');
            existingUser.googleId = result.sub;
            await existingUser.save();

            console.log('Updated user:', existingUser);

            // Tạo token mới
            const token = jwt.sign(
                { email: existingUser.email, id: existingUser._id },
                secret,
                { expiresIn: "1h" }
            );

            // Đảm bảo trả về đúng format
            const userResponse = {
                _id: existingUser._id,
                name: existingUser.name,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                imageUrl: existingUser.imageUrl,
                googleId: existingUser.googleId,
                likes: existingUser.likes || 0,
                likedPosts: existingUser.likedPosts || []
            };

            console.log('Sending response:', { result: userResponse, token });
            return res.status(200).json({ result: userResponse, token });
        }

        // Xử lý tên nếu không có firstName/lastName
        const firstName = result.firstName || result.name.split(' ')[0];
        const lastName = result.lastName || result.name.split(' ').slice(1).join(' ');

        // Tạo user mới với thông tin từ Google
        const newUser = await UserModal.create({
            email: result.email,
            name: result.name,
            firstName: firstName,
            lastName: lastName,
            imageUrl: result.imageUrl,
            googleId: result.sub,
            likes: 0,
            likedPosts: []
        });

        console.log('Created new user:', newUser);

        // Tạo token cho user mới
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            secret,
            { expiresIn: "1h" }
        );

        // Đảm bảo trả về đúng format
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            imageUrl: newUser.imageUrl,
            googleId: newUser.googleId,
            likes: newUser.likes || 0,
            likedPosts: newUser.likedPosts || []
        };

        console.log('Sending response:', { result: userResponse, token });
        res.status(200).json({ result: userResponse, token });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Something went wrong with Google authentication" });
    }
};

// Lấy thông tin user
export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModal.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Không trả về password trong response
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt
        };

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Cập nhật thông tin user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, imageUrl } = req.body;

    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        if (req.userId !== id) {
            return res.status(403).json({ message: "Not authorized to update this user" });
        }

        const updatedUser = await UserModal.findByIdAndUpdate(
            id,
            { name, email, imageUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign(
            { email: updatedUser.email, id: updatedUser._id },
            secret,
            { expiresIn: "1h" }
        );

        res.status(200).json({ result: updatedUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Xóa tài khoản
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        if (req.userId !== id) {
            return res.status(403).json({ message: "Not authorized to delete this user" });
        }

        const deletedUser = await UserModal.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        if (req.userId !== id) {
            return res.status(403).json({ message: "Not authorized to change this user's password" });
        }

        const user = await UserModal.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Quên mật khẩu (reset password)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModal.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tạo token reset password (hết hạn sau 1 giờ)
        const resetToken = jwt.sign(
            { email: user.email, id: user._id },
            secret,
            { expiresIn: "1h" }
        );

        // Trong thực tế, bạn sẽ gửi email chứa link reset password
        // Link sẽ có dạng: frontend-url/reset-password?token=resetToken

        // Lưu token vào database để verify sau này
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
        await user.save();

        res.status(200).json({
            message: "Password reset link has been sent to your email",
            resetToken // Trong thực tế không nên trả về token
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Reset password với token
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify token
        const decoded = jwt.verify(token, secret);
        const user = await UserModal.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        // Set mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Lấy số lượng likes của user
export const getUserLikes = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModal.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            likes: user.likes,
            likedPosts: user.likedPosts
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Tăng số lượng likes cho user
export const increaseLikes = async (req, res) => {
    const { id } = req.params;
    const { postId } = req.body;

    try {
        const user = await UserModal.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra xem user đã like post này chưa
        if (user.likedPosts.includes(postId)) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        // Tăng số lượng likes và thêm post vào danh sách đã like
        user.likes += 1;
        user.likedPosts.push(postId);
        await user.save();

        res.status(200).json({
            likes: user.likes,
            likedPosts: user.likedPosts
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Giảm số lượng likes của user
export const decreaseLikes = async (req, res) => {
    const { id } = req.params;
    const { postId } = req.body;

    try {
        const user = await UserModal.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra xem user đã like post này chưa
        if (!user.likedPosts.includes(postId)) {
            return res.status(400).json({ message: "You haven't liked this post yet" });
        }

        // Giảm số lượng likes và xóa post khỏi danh sách đã like
        user.likes = Math.max(0, user.likes - 1); // Đảm bảo likes không âm
        user.likedPosts = user.likedPosts.filter(id => id.toString() !== postId);
        await user.save();

        res.status(200).json({
            likes: user.likes,
            likedPosts: user.likedPosts
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

// Lấy danh sách posts đã like
export const getLikedPosts = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModal.findById(id).populate('likedPosts');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            likedPosts: user.likedPosts
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};