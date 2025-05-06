import { Types } from "mongoose";

export class LeadCreatedEvent {
  constructor(
    public readonly leadId: Types.ObjectId,
    public readonly email: string,
    public readonly fullname: string,
  ) {}
}
