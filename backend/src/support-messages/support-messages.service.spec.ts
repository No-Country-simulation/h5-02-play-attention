import { Test, TestingModule } from '@nestjs/testing';
import { SupportMessagesService } from './support-messages.service';

describe('SupportMessagesService', () => {
  let service: SupportMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportMessagesService],
    }).compile();

    service = module.get<SupportMessagesService>(SupportMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
