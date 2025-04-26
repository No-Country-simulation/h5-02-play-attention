import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { ResourcesModule } from './resources/resources.module';
import configuration from './config/configuration';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EngagementsModule } from './engagements/engagements.module';
import { CategoriesModule } from './categories/categories.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DevToolsModule } from './dev-tools/dev-tools.module';
import { ListenersModule } from './system-listeners/listeners.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    DevToolsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    LeadsModule,
    AuthModule,
    UsersModule,
    MailModule,
    ResourcesModule,
    CloudinaryModule,
    CategoriesModule,
    EngagementsModule,
    ListenersModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
