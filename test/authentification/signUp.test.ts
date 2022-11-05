import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('AuthentificationController - SignUp', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('should create an user using credentials', async () => {
		await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: 'seithh@shareyourstream.com', password: 'TestingPassword7!' })
			.expect(201);
	});

	it("shouldn't create an user using empty body", () => {
		return request(app.getHttpServer())
			.post('/authentification/signUp')
			.expect(400);
	});

	it("shouldn't create an user using useless params", () => {
		return request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ uselessParam: 42 })
			.expect(400);
	});

	it("shouldn't create an user using invalid email", async () => {
		const response = await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: 'badEmail', password: 'goodPassword' });

		expect(response.body.message).toContain('invalidEmail');
	});

	it("shouldn't create an user using invalid password type", async () => {
		const response = await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: 'goodEmail@gmail.com', password: 42 });

		expect(response.body.message).toContain('invalidType');
	});

	it("shouldn't create an user using invalid password length", async () => {
		const response = await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: 'goodEmail@gmail.com', password: 'short' });

		expect(response.body.message).toContain('invalidLength');
	});

	it("shouldn't create an user using duplicated email", async () => {
		await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: 'seithDuplicate@shareyourstream.com', password: 'TestingPassword7!' });

		await request(app.getHttpServer())
			.post('/authentification/signUp')
			.send({ email: 'seithDuplicate@shareyourstream.com', password: 'TestingPassword7!' })
			.expect(403)
	});
});
