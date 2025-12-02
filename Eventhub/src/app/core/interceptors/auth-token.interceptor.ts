import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Appends authentication and content headers to every outgoing HTTP request.
 * Keeps existing headers untouched so explicit per-request overrides still work.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = sessionStorage.getItem('access_token');
    const isFormData = req.body instanceof FormData;

    let headers = req.headers;

    if (!headers.has('Accept')) {
        headers = headers.set('Accept', 'application/json');
    }

    if (!isFormData && !headers.has('Content-Type')) {
        headers = headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return next(req.clone({ headers }));
};
