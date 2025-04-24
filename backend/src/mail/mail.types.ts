type ConfirmEmailVars = { name: string; url: string };
type EmailUpdatedVars = { name: string };
type PasswordUpdatedVars = { name: string };
type ResetPasswordVars = { name: string; url: string };
type ExampleVars = { name: string; url: string };
type RegisterEmailVars = { email: string; password: string; url: string };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum EmailTemplatesEnum {
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  EMAIL_UPDATED = 'EMAIL_UPDATED',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
  RESET_PASSWORD = 'RESET_PASSWORD',
  EXAMPLE_TEMPLATE = 'EXAMPLE_TEMPLATE',
  REGISTER_EMAIL = 'REGISTER_EMAIL',
}

type TemplateData<T> = {
  templateName: string;
  defaultSubject: string;
  vars: (keyof T)[] & Required<(keyof T)[]>;
};

export type EmailTemplateMap = {
  [K in keyof TemplateContextVariables]: TemplateData<
    TemplateContextVariables[K]
  >;
};

export type TemplateContextVariables = {
  CONFIRM_EMAIL: ConfirmEmailVars;
  EMAIL_UPDATED: EmailUpdatedVars;
  PASSWORD_UPDATED: PasswordUpdatedVars;
  RESET_PASSWORD: ResetPasswordVars;
  EXAMPLE_TEMPLATE: ExampleVars;
  REGISTER_EMAIL: RegisterEmailVars;
};

export type EmailTemplates = keyof typeof EmailTemplatesEnum;
