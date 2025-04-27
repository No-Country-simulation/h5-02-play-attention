import { Test, TestingModule } from '@nestjs/testing';
import { SupportMessagesController } from './support-messages.controller';

describe('SupportMessagesController', () => {
  let controller: SupportMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportMessagesController],
    }).compile();

    controller = module.get<SupportMessagesController>(SupportMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
