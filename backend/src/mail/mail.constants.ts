import { EmailTemplateMap } from './mail.types';

export const EmailTemplatesDefault: EmailTemplateMap = {
  CONFIRM_EMAIL: {
    templateName: 'confirmEmail',
    defaultSubject: 'Verify Email Address',
    vars: ['name', 'url'],
  },
  EMAIL_UPDATED: {
    templateName: 'emailChanged',
    defaultSubject: 'Account Email Changed',
    vars: ['name'],
  },
  PASSWORD_UPDATED: {
    templateName: 'passwordChanged',
    defaultSubject: 'Account Password Changed',
    vars: ['name'],
  },
  RESET_PASSWORD: {
    templateName: 'pswrdReset',
    defaultSubject: 'Password Reset',
    vars: ['name', 'url'],
  },
  EXAMPLE_TEMPLATE: {
    templateName: 'example',
    defaultSubject: 'Example Template',
    vars: ['name'],
  },
  WELCOME_TEMPLATE: {
    templateName: 'welcome',
    defaultSubject: 'Bienvenido a Play Attention',
    vars:['name']
  },
  REGISTER_EMAIL: {
    templateName: 'registeredEmail',
    defaultSubject: 'Registered Email',
    vars: ['email', 'password', 'url'],
  }
};

export const TECHNICAL_ERRORS = ['ECONNREFUSED', 'ENOTFOUND', 'EAUTH'] as const;
