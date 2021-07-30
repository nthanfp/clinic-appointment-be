import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import JsonException from '../utils/JsonException.js';

export async function create(req, res, next) {
    try {
        const {first_name, last_name, email, age, username, password, role = 'patient'} = req.body;

        const user = await User.findOne({email});
        if (user) {
            return next(new JsonException(res, 401, 'Email has been registered!'));
        }

        const usernameExists = await User.findOne({username});
        if (usernameExists) {
            return next(new JsonException(res, 401, 'Username has been used!'));
        }

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            username,
            password,
            role: 'patient',
        });

        if (newUser) {
            return res.status(200).json({
                success: true,
                status: 200,
                message: 'User added successfully',
            });
        }
    } catch (error) {
        return next(new JsonException(res, 500, error.message));
    }
}

export async function auth(req, res, next) {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user) {
            return next(new JsonException(res, 401, 'Username not found'));
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return next(new JsonException(res, 401, 'Invalid username/password'));
        }

        const role = username === 'admin' ? 'admin' : 'patient';
        const token = jwt.sign(
            {id: user._id, username: user.username, first_name: user.first_name, role: role},
            req.app.get('secret'),
            {
                expiresIn: '1h',
            }
        );

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Authentication success',
            data: {token: token},
        });
    } catch (error) {
        return next(new JsonException(res, 500, error.message));
    }
}

export async function getOne(req, res, next) {
    try {
        const id = req.decoded.role !== 'admin' ? req.decoded.id : req.params.id;
        if (!id) return next(new JsonException(res, 400, 'Id required'));

        console.log(id);
        const data = await User.findById(id);
        const {role, password, ...user} = data.toObject();

        return res.json({
            success: true,
            status: 200,
            message: 'User detail information',
            data: user,
        });
    } catch (error) {
        return next(new JsonException(res, 500, error.message));
    }
}
