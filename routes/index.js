import express from 'express';

import * as homeController from '../controllers/home.controller.js';
import * as userController from '../controllers/user.controller.js';
import * as appointmentController from '../controllers/appointment.controller.js';
import {authMiddleware, isAdmin} from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {validateCreateUser, validateAuthUser} from '../middleware/validator/user.validator.js';
import {
    validateApplyAppointment,
    validateCreateAppointment,
    validateDeleteAppointment,
    validateUpdateAppointment,
    validateCancelAppointment,
} from '../middleware/validator/appointment.validator.js';

const router = express.Router();

router.get('/', homeController.index);

// user route
router.get('/user/:id?', [authMiddleware], userController.getOne);
router.post('/user/register', [validateCreateUser, validate], userController.create);
router.post('/user/login', [validateAuthUser, validate], userController.auth);

// appointment route
router.get('/appointment', [authMiddleware], appointmentController.get);
router.get('/appointment/:id', [authMiddleware], appointmentController.getOne);
router.post(
    '/appointment',
    [authMiddleware, isAdmin, validateCreateAppointment, validate],
    appointmentController.create
);
router.put(
    '/appointment',
    [authMiddleware, isAdmin, validateUpdateAppointment, validate],
    appointmentController.update
);
router.delete(
    '/appointment/:id',
    [authMiddleware, isAdmin, validateDeleteAppointment, validate],
    appointmentController.remove
);
router.post(
    '/appointment/apply',
    [authMiddleware, validateApplyAppointment, validate],
    appointmentController.apply
);
router.post(
    '/appointment/cancel',
    [authMiddleware, validateCancelAppointment, validate],
    appointmentController.cancel
);

export default router;
