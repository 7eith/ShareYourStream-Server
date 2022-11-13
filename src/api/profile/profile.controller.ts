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
}
