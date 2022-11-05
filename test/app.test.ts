import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { AppModule } from '@/app.module';
import { Connection, createConnection } from "mongoose";

describe('App', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect({ appName: 'ShareYourStream-BackEnd', version: '0.0.1' });
	});

	it('/noRouteExisting (GET)', () => {
		return request(app.getHttpServer())
			.get('/noRouteExisting')
			.expect(404)
			.expect({
				statusCode: 404,
				message: 'Cannot GET /noRouteExisting',
				error: 'Not Found',
			});
	});
});

afterAll(async () => {
	dotenv.config();

	let mongoClient : Connection = createConnection(process.env.MONGODB_URL);
	await mongoClient.dropDatabase();
	await mongoClient.close();
})