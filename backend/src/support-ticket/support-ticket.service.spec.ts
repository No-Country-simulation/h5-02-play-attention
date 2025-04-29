import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  GenerateSupportTicketDto,
  UserGenerateSupportTicketDto,
} from './dto/generate-ticket.dto';
import { SupportTickets } from './schema/support-ticket.schema';
import { SupportTicketRepository } from './support-ticket.repository';
import { SupportTicketService } from './support-ticket.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Support Ticket Service', () => {
  let service: SupportTicketService;
  let repository: SupportTicketRepository;
  let userService: UsersService;

  const user_id = 'ss';
  const userCreationDto: UserGenerateSupportTicketDto = {
    category: 'billing',
    description: 'Desc',
    title: 'Title',
  };

  const returnDto: SupportTickets = {
    ...userCreationDto,
    created_by: user_id,
    status: 'open',
    priority: 'medium',
    ticket_origin: 'user_plataform',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportTicketService,
        {
          provide: SupportTicketRepository,
          useValue: {
            createSupportTicket: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupportTicketService>(SupportTicketService);
    repository = module.get<SupportTicketRepository>(SupportTicketRepository);
    userService = module.get<UsersService>(UsersService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User create', () => {
    it('shpuld return the support ticket created if all correct', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValueOnce({
        _id: 'ss',
        name: 'Juan',
        email: 'juan@example.com',
        save: jest.fn(),
        toObject: jest
          .fn()
          .mockReturnValue({ name: 'Juan', email: 'juan@example.com' }),
      } as any);

      jest
        .spyOn(repository, 'createSupportTicket')
        .mockResolvedValueOnce(returnDto);

      const result = await service.userCreateSupportTicket(
        user_id,
        userCreationDto,
      );
      expect(result).toEqual(returnDto);
    });

    it('should throw if user not exists', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockRejectedValueOnce(
          new NotFoundException('Error from user service'),
        );

      try {
        await service.userCreateSupportTicket(user_id, userCreationDto);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Error from user service');
      }
    });

    it('should have thrown InternalServerError if db fails', async () => {
      jest
        .spyOn(repository, 'createSupportTicket')
        .mockRejectedValueOnce(new Error());

      await expect(
        service.userCreateSupportTicket(user_id, userCreationDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Amin Create', () => {
    const adminId = 'admin';
    const adminDto: GenerateSupportTicketDto = {
      ...userCreationDto,
      created_by: adminId,
      user_id: 'userId',
      ticket_origin: 'user_plataform',
    };
    it('should throw if user not exists', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockRejectedValueOnce(
          new NotFoundException('Error from user service'),
        );

      try {
        await service.createSupportTicket(adminId, adminDto);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Error from user service');
      }
    });

    it('should return the support ticket', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValueOnce({
        _id: adminId,
        name: 'Juan',
        email: 'juan@example.com',
        save: jest.fn(),
        toObject: jest
          .fn()
          .mockReturnValue({ name: 'Juan', email: 'juan@example.com' }),
      } as any);

      jest
        .spyOn(service, 'createSupportTicket')
        .mockResolvedValue({ ...returnDto, created_by: adminId });

      const result = await service.createSupportTicket(adminId, adminDto);
      expect(result).toEqual({ ...returnDto, created_by: adminId });
    });
  });
});
