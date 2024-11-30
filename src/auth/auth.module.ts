import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/entities/user.entity';

import { LocalStrategy } from './utils/local.strategy';
import { JwtStrategy } from './utils/jwt.stategy';
import { GoogleOAuthStrategy } from './utils/google.strategy';
// import { SessionSerializer } from './utils/session.serializer';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleOAuthStrategy,
    // SessionSerializer,
  ],

  exports: [AuthService],
})
export class AuthModule {}
