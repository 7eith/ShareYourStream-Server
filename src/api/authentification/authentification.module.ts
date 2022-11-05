import { Module } from '@nestjs/common';
import { AutentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/shared/typeorm/entities/user.entity';
import { AuthentificationHelper } from './authentification.helper';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get('JWT_KEY'),
				signOptions: { expiresIn: '24h' },
			}),
		}),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [AutentificationController],
	providers: [AuthentificationService, AuthentificationHelper],
})
export class AuthentificationModule {}
