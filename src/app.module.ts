import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { DEFAULT_CIPHERS } from 'tls';
import { from } from 'rxjs';
import { HotelsModule } from './modules/hotels/hotels.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule, 
    AuthModule, 
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 3,
      },
    ]),
    MailerModule.forRoot({
      transport: process.env.SMTP,
      defaults: {
        from: `"dnc_hotel" <${process.env.EMAIL_USER}>`,
      }
    }),
    HotelsModule
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
