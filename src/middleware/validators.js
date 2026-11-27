import { body } from 'express-validator';

export const organizationValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Organization name must be between 3 and 100 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters.'),
    body('contact_email')
        .trim()
        .notEmpty().withMessage('Contact email is required.')
        .isEmail().withMessage('A valid contact email address is required.')
        .isLength({ max: 150 }).withMessage('Contact email cannot exceed 150 characters.'),
    body('logo')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: 255 }).withMessage('Logo path or URL cannot exceed 255 characters.')
];

export const categoryValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

export const projectValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .isLength({ min: 3, max: 150 })
        .withMessage('Project title must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10, max: 1500 })
        .withMessage('Description must be between 10 and 1500 characters.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .isLength({ min: 2, max: 150 })
        .withMessage('Location must be between 2 and 150 characters.'),
    body('date')
        .trim()
        .notEmpty().withMessage('A valid project date is required.')
        .isISO8601().withMessage('A valid project date is required.'),
    body('organization_id')
        .trim()
        .notEmpty().withMessage('Please select a valid sponsoring organization.')
        .isInt({ min: 1 }).withMessage('Please select a valid sponsoring organization.')
        .toInt()
];