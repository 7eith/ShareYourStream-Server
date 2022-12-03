import { SpotifyService } from '@/shared/services/spotify/spotify.service';
import { User } from '@/shared/typeorm/entities/user.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {

	@InjectRepository(User)
	private readonly repository: Repository<User>;

	@Inject(SpotifyService)
	private readonly spotifyService: SpotifyService;
	

	public async fetchProfile(user: User): Promise<User> {
        return user;
	}

	public async linkSpotify(_user: User, _code: string): Promise<any> {
		if (!_code || _code === undefined || _code.length === 0)
			throw new HttpException(
				{ message: 'invalidBody' },
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

		if (user) {
			throw new HttpException(
				{ message: "alreadyLinked" },
				HttpStatus.FORBIDDEN
			)
		}

		_user.spotifyId = userProfile.id;
		_user.spotifyAccessToken = OAuthResponse.access_token;
		_user.spotifyRefreshToken = OAuthResponse.refresh_token;
		_user.spotifyScopes = OAuthResponse.scope;

		await this.repository.save(_user);
		user = await this.repository.findOne({ where: { spotifyId: userProfile.id }});

        return user;
	}
}
