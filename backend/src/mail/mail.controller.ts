import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async sendTestEmail(@Body() body: { email: string }) {
    try {
      await this.mailService.sendTemplateEmail('CONFIRM_EMAIL', body.email, {
        name: 'Email Test',
        url: 'url.com',
      });
      return { message: 'Test email sent!' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
