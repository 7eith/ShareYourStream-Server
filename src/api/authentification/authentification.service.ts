import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthentificationService {

    public async signUp(_body: SignUpDto): Promise<any> {
        const { email, password } = _body;

        console.log(email)
        console.log(password)
        return "";
    }
}
