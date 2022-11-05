import { Exclude } from 'class-transformer';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ObjectID,
	ObjectIdColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
	@ObjectIdColumn()
	public id!: ObjectID;

	@Column()
	public email!: string;

	@Exclude()
	@Column()
	public password?: string;

	@Column()
	public username?: string;

	@CreateDateColumn()
	public createdAt!: Date;

	constructor(_email: string) {
		super();
		this.email = _email;
	}
}
