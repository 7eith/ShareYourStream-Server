import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';

@Module({
	imports: [
		ApiModule
	],
	controllers: [AppController],
})
export class AppModule {}
