import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import { User } from '@/shared/typeorm/entities/user.entity';
import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UsePipes,
    Get,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
	constructor(private readonly service: ProfileService) {}

	@Get('me')
    @UseGuards(JwtAuthGuard)
	private fetchProfile(@Req() { user } : Request): Promise<User> {
		return this.service.fetchProfile(<User> user);
	}

	@Post('spotify/link')
	@UseGuards(JwtAuthGuard)
	private linkSpotify(@Req() { user } : Request, @Body('code') code: string) : Promise<any> {
		return this.service.linkSpotify(<User> user, code);
	}

	@Post('spotify/refreshToken')
	@UseGuards(JwtAuthGuard)
	private refreshSpotifyToken(@Req() { user } : Request) : Promise<any> {
		return this.service.refreshSpotifyToken(<User> user);
	}
}
