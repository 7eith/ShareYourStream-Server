import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from "@nestjs/axios";

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath:
				process.env.NODE_ENV === undefined ? '.env' : '.env.test',
		}),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		// HttpModule,
		ApiModule,
	],
	controllers: [AppController],
})
export class AppModule {}
