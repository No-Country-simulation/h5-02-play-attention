export class EmailPlainToManyNotif {
  constructor(
    readonly subject: string,
    readonly message: string,
    readonly emails: string[],
  ) {}
}
