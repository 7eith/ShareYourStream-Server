import { SpotifyAuthentificationService } from '@/shared/services/spotify/auth.service';
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

	@Inject(SpotifyAuthentificationService)
	private readonly spotifyAuth: SpotifyAuthentificationService;
  
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

	public async authUsingSpotify(
		_code: string
	) : Promise<AuthentificationResponse> {
		if (!_code || _code === undefined || _code.length === 0)
			throw new HttpException(
				{ message: 'invalidCode' },
				HttpStatus.BAD_REQUEST
			)
		
		let spotifyAuthResponse : SpotifyAuthentificationResponse;
		let userProfile : SpotifyUserProfile;

		try {
			spotifyAuthResponse = await this.spotifyAuth.generateAccessToken(_code);
			userProfile = await this.spotifyAuth.getUserProfile(spotifyAuthResponse.access_token);
		}
		catch (_error) {
			throw new HttpException(
				{ message: "invalidCode" },
				HttpStatus.BAD_REQUEST
			)
		}
		
		if (!userProfile.email) {
			throw new HttpException(
				{ message: 'invalidScope' },
				HttpStatus.FORBIDDEN
			)
		}

		let user: User = await this.repository.findOne({ where: { spotifyId: userProfile.id }});

		if (!user) {
			
			user = new User(userProfile.email);
			user.spotifyId = userProfile.id;
			user.spotifyAccessToken = spotifyAuthResponse.access_token;
			user.spotifyRefreshToken = spotifyAuthResponse.refresh_token;
			user.spotifyScopes = spotifyAuthResponse.scope;

		} else {

			user.spotifyAccessToken = spotifyAuthResponse.access_token;
			user.spotifyRefreshToken = spotifyAuthResponse.refresh_token;
			user.spotifyScopes = spotifyAuthResponse.scope;

		}
		
		await this.repository.save(user);
		user = await this.repository.findOne({ where: { spotifyId: userProfile.id }});
		return this.helper.generateCredentialsTokens(user);
	}
}
