import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import JsonException from '../utils/JsonException.js';

export function authMiddleware(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) return next(new JsonException(res, 400, 'Token is not provided'));

    token = token.replace(/^Bearer\s+/, '');
    if (!token) return next(new JsonException(res, 400, 'Token is not provided'));

    jwt.verify(token, req.app.get('secret'), (err, decoded) => {
        if (err) return next(new JsonException(res, 400, err.message));
        req.decoded = decoded;
        next();
    });
}

export async function isAdmin(req, res, next) {
    try {
        const info = req.decoded;
        if (info.role !== 'admin') {
            return next(new JsonException(res, 403, "You're not admin"));
        }

        const admin = await User.findById(info.id);
        if (admin.role === 'admin') next();
    } catch (err) {
        return next(new JsonException(res, 500, err.message));
    }
}
