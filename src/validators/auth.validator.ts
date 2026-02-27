import { body } from 'express-validator';

export const loginValidationRules = [
  body('email').isEmail().withMessage('Email must be a valid email address').normalizeEmail({ gmail_remove_dots: false }).notEmpty().withMessage('Email is required'),
  body('password').isString().withMessage('Password must be a string').notEmpty().withMessage('Password is required'),
];

export const refreshValidationRules = [
  body('refreshToken').isString().withMessage('refreshToken is required'),
];

export const logoutValidationRules = [
  body('refreshToken').isString().withMessage('refreshToken is required'),
];
export const registerValidationRules = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
    
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({ gmail_remove_dots: false }),
    
  body('phone')
    .optional({values:'falsy'})    
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid E.164 phone number'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),

  body('retype_password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
];