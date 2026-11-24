// src/middleware/auth.js

export function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        if (req.session) {
            req.session.flashMessage = {
                type: 'error',
                text: 'Please log in to access this page.'
            };
        }
        return res.redirect('/login');
    }
    return next();
}

export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            if (req.session) {
                req.session.flashMessage = {
                    type: 'error',
                    text: 'Please log in to continue.'
                };
            }
            return res.redirect('/login');
        }

        const userRole = req.session.user.role;
        if (!allowedRoles.includes(userRole)) {
            req.session.flashMessage = {
                type: 'error',
                text: 'Access denied: admin privileges are required to view that page.'
            };
            return res.redirect('/dashboard');
        }

        return next();
    };
}