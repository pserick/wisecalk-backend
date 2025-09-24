import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthService } from './services/auth.service';
import { UserSyncService } from './services/user-sync.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    AuthService,
    UserSyncService,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    AuthService,
    UserSyncService,
  ],
})
export class AuthModule {}