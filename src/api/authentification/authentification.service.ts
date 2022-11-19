import { DiscordService } from '@/shared/services/discord/discord.service';
import { SpotifyService } from '@/shared/services/spotify/spotify.service';
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

	@Inject(SpotifyService)
	private readonly spotifyService: SpotifyService;
	
	@Inject(DiscordService)
	private readonly discordService: DiscordService;

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
		
		let OAuthResponse : OAuthTokenResponse;
		let userProfile : SpotifyUserProfile;

		try {
			OAuthResponse = await this.spotifyService.generateAccessToken(_code);
			userProfile = await this.spotifyService.getUserProfile(OAuthResponse.access_token);
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
			
		} 

		user.spotifyAccessToken = OAuthResponse.access_token;
		user.spotifyRefreshToken = OAuthResponse.refresh_token;
		user.spotifyScopes = OAuthResponse.scope;
		
		await this.repository.save(user);
		user = await this.repository.findOne({ where: { spotifyId: userProfile.id }});
		return this.helper.generateCredentialsTokens(user);
	}

	public async authUsingDiscord(
		_code: string
	) : Promise<AuthentificationResponse> {
		if (!_code || _code === undefined || _code.length === 0)
			throw new HttpException(
				{ message: 'invalidCode' },
				HttpStatus.BAD_REQUEST
			)
		
		let OAuthResponse : OAuthTokenResponse;
		let userProfile : DiscordUserProfile;

		try {
			OAuthResponse = await this.discordService.generateAccessToken(_code);
			userProfile = await this.discordService.getUserProfile(OAuthResponse.access_token);
		}
		catch (_error) {
			console.log(_error)
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

		let user: User = await this.repository.findOne({ where: { discordId: userProfile.id }});

		if (!user) {
			
			user = new User(userProfile.email);
			user.discordId = userProfile.id;

		}
	
		user.discordAccessToken = OAuthResponse.access_token;
		user.discordRefreshToken = OAuthResponse.refresh_token;
		user.discordScopes = OAuthResponse.scope;
		
		await this.repository.save(user);
		user = await this.repository.findOne({ where: { discordId: userProfile.id }});
		return this.helper.generateCredentialsTokens(user);
	}
}
