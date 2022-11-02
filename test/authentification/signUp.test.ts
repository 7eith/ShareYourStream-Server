import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthentificationController - SignUp', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('use empty DTO', () => {
		return request(app.getHttpServer())
			.post('/authentification/signUp')
			.expect(400);
	});

	it('use DTO with useless param', () => {
		return request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ uselessParam: 42 })
			.expect(400);
	});

	it('use invalid email', async () => {
		const response = await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: "badEmail", password: "goodPassword" });
		
		expect(response.body.message).toContain("invalidEmail")
	});

	it('use invalid password', async () => {
		const response = await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: "goodEmail@gmail.com", password: 42 });
		
		expect(response.body.message).toContain("invalidType");
	});

	it('use too short password', async () => {
		const response = await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: "goodEmail@gmail.com", password: "short" });
		
		expect(response.body.message).toContain("invalidLength");
	});

	// it('/noRouteExisting (GET)', () => {
	// 	return request(app.getHttpServer())
	// 		.get('/noRouteExisting')
	// 		.expect(404)
	// 		.expect({ statusCode: 404, message: "Cannot GET /noRouteExisting", error: "Not Found"});
	// });
});
