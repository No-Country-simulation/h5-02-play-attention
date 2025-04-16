import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [LeadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
