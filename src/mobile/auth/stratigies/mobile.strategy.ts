import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

@Injectable()

export class MobileStrategy extends PassportStrategy(Strategy, 'mobile') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        configService.get('access').ADMIN_PUBLIC_KEY,
        'base64',
      ).toString('ascii'),
      algorithms: ['RS256'],
    } as StrategyOptions);
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      email: payload.email,
      countryCode: payload.countryCode,
      phoneNumber: payload.phoneNumber,
      type: payload.type,
    };
  }
}
