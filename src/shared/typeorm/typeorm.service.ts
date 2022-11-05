import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	@Inject(ConfigService)
	private readonly config: ConfigService;

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'mongodb',
			url: this.config.get<string>('MONGODB_URL'),
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			ssl: true,
			useUnifiedTopology: true,
			useNewUrlParser: true,
			synchronize: true, // never use TRUE in production!
		};
	}
}
