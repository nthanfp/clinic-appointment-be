import {validationResult} from 'express-validator';
import JsonException from '../utils/JsonException.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new JsonException(res, 400, 'Validation failed', errors.errors));
    }

    next();
};

export default validate;
