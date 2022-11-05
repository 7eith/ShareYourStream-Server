import { User } from '@/shared/typeorm/entities/user.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthentificationHelper } from './authentification.helper';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthentificationService {
	@InjectRepository(User)
	private readonly repository: Repository<User>;

	@Inject(AuthentificationHelper)
	private readonly helper: AuthentificationHelper;

	public async signUpUsingCredentials(
		_body: SignUpDto,
	): Promise<AuthentificationResponse> {
		const { email, password } = _body;

		let user: User = await this.repository.findOne({ where: { email } });

		if (user)
			throw new HttpException(
				{ message: ['email.alreadyUsed'] },
				HttpStatus.FORBIDDEN,
			);

		user = new User(email);
		user.password = this.helper.encodePassword(password);

		await this.repository.save(user);

		user = await this.repository.findOne({ where: { email } });

		return this.helper.generateCredentialsTokens(user);
	}

	public async signInUsingCredentials(
		_body: SignInDto,
	): Promise<AuthentificationResponse> {
		const { email, password } = _body;

		let user: User = await this.repository.findOne({ where: { email } });

		if (!user)
			throw new HttpException(
				{ message: 'invalidCredentials' },
				HttpStatus.FORBIDDEN,
			);
	  
		const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);
	
		if (!isPasswordValid) 
			throw new HttpException('invalidCredentials', HttpStatus.FORBIDDEN);
	
		return this.helper.generateCredentialsTokens(user);
	}
}
