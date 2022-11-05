import { Trim } from 'class-sanitizer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
	@Trim()
	@IsEmail({}, { message: 'invalidEmail' })
	public readonly email!: string;

	@IsString({ message: 'invalidType' })
	@MinLength(8, { message: 'invalidLength' })
	public readonly password!: string;
}
