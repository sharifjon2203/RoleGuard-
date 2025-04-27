import { catchError } from "../utils/error-response.js";

export const UserGuard = (req, res, next) => {
    try {
        const user = req?.user;
        if (user.role != 'user') {
            catchError(res, 403, 'Forbidden user');
        }
        next();
    } catch (error) {
        catchError(res, 500, error.message);
    }
}

