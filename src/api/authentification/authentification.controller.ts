import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UsePipes,
} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { SignUpDto } from './dto/signUp.dto';

@Controller('authentification')
export class AutentificationController {
	constructor(private readonly service: AuthentificationService) {}

	@Post('/signUp')
	@UsePipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	)
	private signUp(@Body() body: SignUpDto): Promise<AuthentificationResponse> {
		return this.service.signUp(body);
	}
}
