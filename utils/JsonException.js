class JsonException {
    constructor(res, status, message, data) {
        return res.status(status).json({
            success: false,
            status: status,
            message: message,
            errors: data,
        });
    }
}

export default JsonException;
