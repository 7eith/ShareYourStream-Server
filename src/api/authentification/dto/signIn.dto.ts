import { Trim } from 'class-sanitizer';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
	@Trim()
	@IsEmail({}, { message: 'invalidEmail' })
	public readonly email!: string;

	@IsString({ message: 'invalidType' })
	public readonly password!: string;
}
