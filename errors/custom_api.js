class CustomAPIError extends Error {
    constructor(nessage) {
        super(message)
    }
};

module.exports = CustomAPIError