import { Exclude } from 'class-transformer';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ObjectID,
	ObjectIdColumn
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

	/**
	 * @Spotify 
	 */

	@Column()
	public spotifyId?: string;

	@Column()
	public spotifyAccessToken?: string;

	@Exclude()
	@Column()
	public spotifyRefreshToken?: string;

	@Column()
	public spotifyScopes?: string;

	/**
	 * @Discord 
	 */

	@Column()
	public discordId?: string;

	@Column()
	public discordAccessToken?: string;

	@Exclude()
	@Column()
	public discordRefreshToken?: string;

	@Column()
	public discordScopes?: string;

	@CreateDateColumn()
	public createdAt!: Date;

	constructor(_email: string) {
		super();
		this.email = _email;
	}
}
