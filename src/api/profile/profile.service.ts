import { User } from '@/shared/typeorm/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {

	@InjectRepository(User)
	private readonly repository: Repository<User>;

	public async fetchProfile(user: User): Promise<User> {
        return user;
	}

}
