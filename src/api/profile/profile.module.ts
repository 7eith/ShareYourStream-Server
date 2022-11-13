import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/shared/typeorm/entities/user.entity';

import { SpotifyAuthentificationService } from '@/shared/services/spotify/auth.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User])
	],
	controllers: [ProfileController],
	providers: [ProfileService]
})
export class ProfileModule {}
