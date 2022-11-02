import { Module } from '@nestjs/common';
import { AuthentificationModule } from './authentification/authentification.module';

@Module({
	imports: [
		AuthentificationModule
	]
})

export class ApiModule {}
