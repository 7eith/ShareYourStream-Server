import {
	Injectable,
	HttpException,
	HttpStatus,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@/shared/typeorm/entities/user.entity';

enum JwtPayloadType {
	ACCESS_TOKEN,
	REFRESH_TOKEN
}

@Injectable()
export class AuthentificationHelper {
	@InjectRepository(User)
	private readonly repository: Repository<User>;
	private readonly jwt: JwtService;

	constructor(_jwt: JwtService) {
		this.jwt = _jwt;
	}

	private generateJwtPayload(user: User, type: JwtPayloadType): string {
		return this.jwt.sign({
			id: user.id,
			role: "Administrator" // TODO: create Roles 
		}, { 
			expiresIn: type === JwtPayloadType.ACCESS_TOKEN ? "1d" : "30d",
			issuer: "ShareYourStream",
			subject: user.email
		});
	}

	public generateAccessToken(user: User): string {
		return this.generateJwtPayload(user, JwtPayloadType.ACCESS_TOKEN);
	}

	public generateRefreshToken(user: User): string {
		return this.generateJwtPayload(user, JwtPayloadType.REFRESH_TOKEN);
	}

	public generateCredentialsTokens(user: User) : AuthentificationResponse {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		return {
			token: accessToken,
			refresh_token: refreshToken
		}
	}

	public async decode(token: string): Promise<unknown> {
		return this.jwt.decode(token, null);
	}

	public async validateUser(decoded: any): Promise<User> {
		return this.repository.findOne({ where: { id: decoded.id } });
	}

	public isPasswordValid(password: string, userPassword: string): boolean {
		return bcrypt.compareSync(password, userPassword);
	}

	public encodePassword(password: string): string {
		const salt: string = bcrypt.genSaltSync(10);

		return bcrypt.hashSync(password, salt);
	}

	private async validate(token: string): Promise<boolean | never> {
		const decoded: unknown = this.jwt.verify(token);

		if (!decoded) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		const user: User = await this.validateUser(decoded);

		if (!user) {
			throw new UnauthorizedException();
		}

		return true;
	}
}
