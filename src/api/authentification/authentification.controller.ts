import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UsePipes,
} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('authentification')
export class AutentificationController {
	constructor(private readonly service: AuthentificationService) {}

	@Post('/signUp')
	@UsePipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	)
	private signUpUsingCredentials(
		@Body() body: SignUpDto,
	): Promise<AuthentificationResponse> {
		return this.service.signUpUsingCredentials(body);
	}

	@Post('/signIn')
	@UsePipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	)
	private signInUsingCredentials(
		@Body() body: SignInDto,
	): Promise<AuthentificationResponse> {
		return this.service.signInUsingCredentials(body);
	}

	/**
	 * @Spotify Providers
	 */

	@Post('/spotify')
	private authUsingSpotify(
		@Body('code') code: string
	) : Promise<any> {
		return this.service.authUsingSpotify(code);
	}
}
