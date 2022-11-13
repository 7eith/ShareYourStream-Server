import { Module } from '@nestjs/common';
import { AuthentificationModule } from './authentification/authentification.module';
import { ProfileModule } from './profile/profile.module';

@Module({
	imports: [AuthentificationModule, ProfileModule],
})
export class ApiModule {}
