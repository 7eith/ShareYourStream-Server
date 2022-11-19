import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpotifyService {
    @Inject(ConfigService)
    private readonly config: ConfigService;

    @Inject(HttpService)
	private readonly httpService: HttpService;

	public async generateAccessToken(_code: string) : Promise<OAuthTokenResponse> {

        let encodedHeader = (Buffer.from(this.config.get<string>('SPOTIFY_CLIENT_ID') + ':' + this.config.get<string>('SPOTIFY_SECRET_ID')).toString('base64'));

        let headers = {
            "Authorization": `Basic ${encodedHeader}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        let body = {
            code: _code,
            redirect_uri: "http://localhost:3000/auth/spotify",
            grant_type: "authorization_code"
        }

        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.httpService.axiosRef.post(
                    "https://accounts.spotify.com/api/token",
                    body,
                    { headers }
                )
        
                return resolve(data);
            } 
            catch (error) {
                if (error.response) {
                    return reject({
                        code: error.response.status,
                        message: error.response.statusText
                    })
                }
                return reject({
                    code: 500,
                    message: "Unexpected Error"
                })
            }
        })
	}

    public async getUserProfile(_accessToken: string) : Promise<SpotifyUserProfile> {

        let headers = {
            "Authorization": `Bearer ${_accessToken}`
        }

        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.httpService.axiosRef.get<SpotifyUserProfile>(
                    "https://api.spotify.com/v1/me",
                    { headers }
                )
        
                return resolve(data);
            } 
            catch (error) {
                if (error.response) {
                    return reject({
                        code: error.response.status,
                        message: error.response.statusText
                    })
                }
                return reject({
                    code: 500,
                    message: "Unexpected Error"
                })
            }
        })
    }
}
