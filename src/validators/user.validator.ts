import { body } from 'express-validator';
export const linkAccountValidationRule = [
  body('access_token')
  .notEmpty().withMessage('Access token is required').bail(),
  body('id_token')
  .notEmpty().withMessage('Id token is required').bail(),
  body('refresh_token')
  .notEmpty().withMessage('Refresh token is required').bail(),
  body('provider')
  .notEmpty().withMessage('Provider is required').bail(),
  body('email')
  .notEmpty().withMessage('Email is required').bail(),
  body('password')
  .notEmpty().withMessage('Password is required').bail(),
  body('imap_host')
  .notEmpty().withMessage('IMAP host is required').bail(),
  body('imap_port')
  .notEmpty().withMessage('IMAP port is required').bail(),  
  body('smtp_host')
  .notEmpty().withMessage('SMTP host is required').bail(),  
  body('smtp_port')
  .notEmpty().withMessage('SMTP host is required').bail(),      
];