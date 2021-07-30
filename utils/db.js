import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
dotenv.config();

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(async () => {
        console.log('Database is connected');

        const isAdminExists = await User.exists({
            email: 'admin@mail.com',
            username: 'admin',
            role: 'admin',
        });

        if (isAdminExists) {
            console.log('User admin already created');
            return;
        }

        const admin = await User.create({
            first_name: 'Admin',
            last_name: 'Hospital',
            email: 'admin@mail.com',
            age: 21,
            username: 'admin',
            password: 'admin123',
            role: 'admin',
        });

        if (admin) {
            console.log('User admin created successfully');
        } else {
            console.log('User admin failed to create');
        }
    })
    .catch((err) => {
        console.error(err);
    });

const db = mongoose.connection;

export default db;
