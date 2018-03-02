// must throw object, can't throw Error or string, see here https://github.com/dvajs/dva/issues/1271

export class AppError {
    constructor(message, status = 500) {
        this.message = message;
        this.status = status;
    }
}
export class UserNotFound extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
export class Unauthorized extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
export class BadRequest extends AppError {
    constructor(message) {
        super(message, 400);
    }
}