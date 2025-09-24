import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UserSyncService } from '../services/user-sync.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userSyncService: UserSyncService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_AUDIENCE'),
      issuer: `https://${configService.get('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<any> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token structure');
    }

    // Sync user with local database
    const user = await this.userSyncService.syncUser(payload.sub, payload);

    return {
      userId: user.id,
      auth0Id: payload.sub,
      email: payload.email,
      roles: payload['https://api.wisecalk.com/roles'] || [],
      permissions: payload.permissions || [],
      scope: payload.scope,
    };
  }
}