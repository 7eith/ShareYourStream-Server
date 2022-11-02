import { Module } from '@nestjs/common';
import { AutentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';

@Module({
	imports: [],
	controllers: [AutentificationController],
	providers: [AuthentificationService]
})

export class AuthentificationModule {}
