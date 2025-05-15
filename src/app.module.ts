import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongooseAutoPopulate from 'mongoose-autopopulate';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig } from './common/config/env.config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/middleware/jwt-auth-guard.middleware';
import { RolesGuard } from './common/middleware/role-base-guard.middleware';
import { PaymentModule } from './payment/payment.module';
import { DoctorModule } from './doctor/doctor.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { DrugsModule } from './drugs/drugs.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    DrugsModule,
    DoctorModule,
    PharmacyModule,
    OrderModule,
    PaymentModule,
    EmailModule,

    ConfigModule.forRoot({ isGlobal: true }),

    PassportModule.register({ global: true }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(EnvConfig.JWT_ACCESS_SECRET),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(EnvConfig.MONGO_URI),
        connectionFactory: (connection) => {
          connection.plugin(mongooseAutoPopulate);
          return connection;
        },
      }),

      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
