import { Module } from '@nestjs/common';
import { AutentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/shared/typeorm/entities/user.entity';
import { AuthentificationHelper } from './authentification.helper';

import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SpotifyService } from '@/shared/services/spotify/spotify.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DiscordService } from '@/shared/services/discord/discord.service';

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
		HttpModule
	],
	controllers: [AutentificationController],
	providers: [AuthentificationService, AuthentificationHelper, SpotifyService, DiscordService, JwtStrategy],
})
export class AuthentificationModule {}
