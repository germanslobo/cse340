// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail, getAllUsers } from '../models/users.js';
import { getProjectsByVolunteer } from '../models/projects.js';

export function showRegister(req, res) {
    res.render('register', {
        title: 'Register',
        currentYear: new Date().getFullYear(),
        formData: {}
    });
}

export async function register(req, res) {
    try {
        const name = (req.body.name || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!name || !email || !password) {
            req.session.flashMessage = {
                type: 'error',
                text: 'Name, email, and password are required.'
            };
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.session.flashMessage = {
                type: 'error',
                text: 'Password must be at least 6 characters long.'
            };
            return res.redirect('/register');
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.session.flashMessage = {
                type: 'error',
                text: 'An account with that email already exists.'
            };
            return res.redirect('/register');
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        const newUserId = await createUser({
            name,
            email,
            passwordHash,
            role: 'user'
        });

        req.session.user = {
            user_id: newUserId,
            name,
            email,
            role: 'user'
        };
        req.session.flashMessage = {
            type: 'success',
            text: `Welcome, ${name}! Your account has been created.`
        };

        return res.redirect('/dashboard');
    } catch (err) {
        console.error('Register error:', err);
        req.session.flashMessage = {
            type: 'error',
            text: 'Unable to complete registration. Please try again.'
        };
        return res.redirect('/register');
    }
}

export function showLogin(req, res) {
    res.render('login', {
        title: 'Login',
        currentYear: new Date().getFullYear(),
        formData: {}
    });
}

export async function login(req, res) {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!email || !password) {
            req.session.flashMessage = {
                type: 'error',
                text: 'Email and password are required.'
            };
            return res.redirect('/login');
        }

        const user = await findUserByEmail(email);
        const passwordMatches = user ? bcrypt.compareSync(password, user.password_hash) : false;

        if (!user || !passwordMatches) {
            req.session.flashMessage = {
                type: 'error',
                text: 'Invalid email or password.'
            };
            return res.redirect('/login');
        }

        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        req.session.flashMessage = {
            type: 'success',
            text: `Welcome back, ${user.name}!`
        };

        return res.redirect('/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        req.session.flashMessage = {
            type: 'error',
            text: 'An error occurred during login. Please try again.'
        };
        return res.redirect('/login');
    }
}

export function logout(req, res) {
    if (!req.session) {
        return res.redirect('/login');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
}

export async function showDashboard(req, res) {
    try {
        const volunteeredProjects = req.session?.user
            ? await getProjectsByVolunteer(req.session.user.user_id)
            : [];

        res.render('dashboard', {
            title: 'Dashboard',
            currentYear: new Date().getFullYear(),
            volunteeredProjects
        });
    } catch (err) {
        console.error('Show dashboard error:', err);
        req.session.flashMessage = {
            type: 'error',
            text: 'Unable to load your dashboard.'
        };
        return res.redirect('/');
    }
}

export async function showUsers(req, res) {
    try {
        const users = await getAllUsers();
        res.render('users', {
            title: 'Registered Users',
            currentYear: new Date().getFullYear(),
            users
        });
    } catch (err) {
        console.error('Show users error:', err);
        req.session.flashMessage = {
            type: 'error',
            text: 'Unable to load users list.'
        };
        return res.redirect('/dashboard');
    }
}