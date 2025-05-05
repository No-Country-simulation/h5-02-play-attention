export class UserRegisteredEvent {
  constructor(
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role:string
  ) {}
}

export class UserForgotPasswordEvent {
  constructor(  
    public readonly email: string,
    public readonly token: string,
    public readonly role: string
  ) {}
}