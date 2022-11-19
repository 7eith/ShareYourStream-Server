import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
    @Inject(ConfigService)
    private readonly config: ConfigService;

    @Inject(HttpService)
	private readonly httpService: HttpService;

	public async generateAccessToken(_code: string) : Promise<OAuthTokenResponse> {

        let headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        let body = {
            client_id: this.config.get<string>('DISCORD_CLIENT_ID'),
            client_secret: this.config.get<string>('DISCORD_SECRET_ID'),
            code: _code,
            redirect_uri: "http://localhost:3000/auth/discord",
            grant_type: "authorization_code"
        }

        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.httpService.axiosRef.post(
                    "https://discord.com/api/oauth2/token",
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

    public async getUserProfile(_accessToken: string) : Promise<DiscordUserProfile> {

        let headers = {
            "Authorization": `Bearer ${_accessToken}`
        }

        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.httpService.axiosRef.get<DiscordUserProfile>(
                    "https://discord.com/api/users/@me",
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
