import { Module } from '@nestjs/common';
import { AutentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/shared/typeorm/entities/user.entity';
@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [AutentificationController],
	providers: [AuthentificationService],
})
export class AuthentificationModule {}
