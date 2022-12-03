import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/shared/typeorm/entities/user.entity';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SpotifyService } from '@/shared/services/spotify/spotify.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		HttpModule
	],
	controllers: [ProfileController],
	providers: [ProfileService, SpotifyService]
})
export class ProfileModule {}
