import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

const secret = 'test';
const client = new OAuth2Client("61537432048-s8v8fpao13t46f13mfimd9ct6rg55rmr.apps.googleusercontent.com");

const auth = async (req, res, next) => {
    try {
        console.log('Auth Headers:', req.headers.authorization);

        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Authorization header is missing." });
        }

        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }

        console.log('Token received:', token.substring(0, 20) + '...');

        const isCustomAuth = token.length < 500;
        let decodedData;

        if (isCustomAuth) {
            try {
                decodedData = jwt.verify(token, secret);
                req.userId = decodedData?.id;
                console.log('Custom Auth - userId:', req.userId);
            } catch (error) {
                console.log('Token verification failed:', error.message);
                return res.status(401).json({ message: "Invalid token." });
            }
        } else {
            try {
                // Google token
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: "61537432048-s8v8fpao13t46f13mfimd9ct6rg55rmr.apps.googleusercontent.com"
                });
                const payload = ticket.getPayLoad();
                req.userId = payload.sub;
                console.log('Google Auth - userId:', req.userId);
            } catch (error) {
                console.log('Google token verification failed:', error.message);
                return res.status(401).json({ message: "Invalid Google token." });
            }
        }

        if (!req.userId) {
            return res.status(401).json({ message: "Authentication failed - No user ID." });
        }

        next();
    }
    catch (error) {
        console.log("Auth middleware error:", error);
        res.status(401).json({ message: "Authentication failed." })
    }
}

export default auth;
