type ConfirmEmailVars = { name: string; url: string };
type EmailUpdatedVars = { name: string };
type PasswordUpdatedVars = { name: string };
type ResetPasswordVars = { name: string; url: string };

export type EmailTemplatesT =
  | 'CONFIRM_EMAIL'
  | 'EMAIL_UPDATED'
  | 'PASSWORD_UPDATED'
  | 'RESET_PASSWORD';

type TemplateData<T> = {
  relativePath: string;
  defaultSubject: string;
  vars: (keyof T)[];
};

export type EmailTemplateMap = {
  CONFIRM_EMAIL: TemplateData<ConfirmEmailVars>;
  EMAIL_UPDATED: TemplateData<EmailUpdatedVars>;
  PASSWORD_UPDATED: TemplateData<PasswordUpdatedVars>;
  RESET_PASSWORD: TemplateData<ResetPasswordVars>;
};

export type TemplateContextVariables = {
  CONFIRM_EMAIL: ConfirmEmailVars;
  EMAIL_UPDATED: EmailUpdatedVars;
  PASSWORD_UPDATED: PasswordUpdatedVars;
  RESET_PASSWORD: ResetPasswordVars;
};
