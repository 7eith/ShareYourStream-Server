import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@/shared/typeorm/entities/user.entity';
import { AuthentificationHelper } from '../authentification.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
  @Inject(AuthentificationHelper)
  private readonly helper: AuthentificationHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_KEY'),
    });
  }

  private validate(payload: string): Promise<User | never> {
    return this.helper.validateUser(payload);
  }
}