export class LeadCreatedEvent {
  constructor(
    public readonly leadId: string,
    public readonly email: string,
    public readonly fullname: string,
  ) {}
}
