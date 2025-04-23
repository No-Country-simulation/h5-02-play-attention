import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EngagementService } from './engagements.service';
import { EngagementsRepository } from './engagements.repository';
import { GenerateEngagementDto } from './dto/generate-engagement.dto';
import { LeadsService } from '../leads/leads.service';

describe('Engagements Service', () => {
  let service: EngagementService;
  let repository: EngagementsRepository;
  let leadsService: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EngagementService,
        {
          provide: EngagementsRepository,
          useValue: {
            createEngagement: jest.fn(),
            findEngagement: jest.fn(),
          },
        },
        {
          provide: LeadsService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EngagementService>(EngagementService);
    repository = module.get<EngagementsRepository>(EngagementsRepository);
    leadsService = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw internal server error at MongoError', async () => {
    jest.spyOn(repository, 'findEngagement').mockRejectedValueOnce(new Error());

    await expect(service.getEngagement('id')).rejects.toThrow(
      new InternalServerErrorException(),
    );
  });

  it('should throw NotFoundException at non existing Engagement', async () => {
    jest.spyOn(repository, 'findEngagement').mockResolvedValueOnce(null);
    await expect(service.getEngagement('id')).rejects.toThrow(
      new NotFoundException('Engagement not found'),
    );
  });

  describe('generateLeadHistoryItem', () => {
    const date = new Date();
    const dto: GenerateEngagementDto = {
      contact_date: date,
      contact_type: 'email',
      lead_id: '1',
      subject: 'Subject',
      detail: 'asdasd',
    };
    it('should successfully create a lead history item', async () => {
      const engagement = {
        contact_date: date,
        contact_type: 'email_@',
        subject: 'Subject',
        lead: {
          __id: '',
          fullname: '',
          company: '',
          phone: '',
          email: '',
          service: '',
          message: '',
          status: '',
          contact_id: {},
          origen: '',
        },
        detail: 'asdasdp',
        created_by: 'system',
      };

      jest.spyOn(repository, 'createEngagement').mockResolvedValue(engagement);

      const result = await service.generateEngagement(dto);
      expect(result).toEqual(engagement);
      expect(repository.createEngagement).toHaveBeenCalledWith(dto);
    });

    it('should throw InternalServerError on error', async () => {
      jest.spyOn(repository, 'createEngagement').mockRejectedValue(new Error());

      await expect(service.generateEngagement(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw NotFoundException on non existing Lead', async () => {
      jest
        .spyOn(leadsService, 'findById')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(service.generateEngagement(dto)).rejects.toThrow(
        new NotFoundException('Lead not found'),
      );
    });
  });
});
