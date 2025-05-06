import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { MailService } from '../mail/mail.service';
import { EngagementService } from '../engagements/engagements.service';
import { getModelToken } from '@nestjs/mongoose';
import { Leads } from './schema/leads.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { CreateLeadDto } from './dto/leads.dto';

describe('LeadsService', () => {
  let service: LeadsService;
  let leadModel: Model<any>;
  let eventEmitter: EventEmitter2;

  const leadDto: CreateLeadDto = {
    email: 'a@b.c',
    fullname: 'Jest Test',
    origen: 'website',
    phone: '1231232',
    relation: 'Padre',
    service: 'xD',
    status: 'Active',
    newsletter: false,
  };
  beforeEach(async () => {
    const leadsModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
        {
          provide: MailService,
          useValue: {
            sendTemplateEmail: jest.fn(),
          },
        },
        {
          provide: getModelToken(Leads.name),
          useValue: leadsModelMock,
        },
        {
          provide: EngagementService,
          useValue: {
            generateEngagementFormLanding: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    leadModel = module.get(getModelToken(Leads.name));
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not emmit event if lead creation fails', async () => {
    const createSpy = jest
      .spyOn(leadModel, 'create')
      .mockRejectedValueOnce(new Error('Nel'));
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    await expect(service.createLead(leadDto)).rejects.toThrow('Nel');

    expect(createSpy).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
