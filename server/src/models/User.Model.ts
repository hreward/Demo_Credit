import knex from 'knex';
import bcrypt from 'bcrypt';

export class User {
	private _id: string;
	private _firstName: string;
	private _lastName: string;
	private _email: string;
	private _password: string;
	private _createdAt: Date;
	private _updatedAt: Date;

	constructor(id: string, firstName: string, lastName: string, email: string, password: string, createdAt?: Date, updatedAt?: Date) {
		this._id = id;
		this._firstName = firstName;
		this._lastName = lastName;
		this._email = email;
		this.setPassword(password);
		if(createdAt === null) this._createdAt = new Date(); else this._createdAt = createdAt;
    	if(updatedAt === null) this._updatedAt = new Date(); else this._updatedAt = updatedAt;
	}

	// Getters and setters
	get id(): string {
		return this._id;
	}

	get firstName(): string {
		return this._firstName;
	}

	set firstName(firstName: string) {
		this._firstName = firstName;
	}

	get lastName(): string {
		return this._lastName;
	}

	set lastName(lastName: string) {
		this._lastName = lastName;
	}

	get email(): string {
		return this._email;
	}

	set email(email: string) {
		this._email = email;
	}

	async verifyPassword(password:string): Promise<boolean> {
		const passwordMatch = await bcrypt.compare(password, this._password);
		if (passwordMatch) {
			return true;
		} else {
			return false;
		}
	}

	async setPassword(password: string) {
		this._password = await bcrypt.hash(password, 10);
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	// Database queries
	static async findById(id: string): Promise<User> {
		const user = await knex('users').where({ id }).first();
		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}
		return new User(user.id, user.firstName, user.lastName, user.email, user.password, user.createdAt, user.updatedAt);
	}

	static async findByEmail(email: string): Promise<User> {
		const user = await knex('users').where({ email }).first();
		if (!user) {
			throw new Error(`User with email ${email} not found`);
		}
		return new User(user.id, user.firstName, user.lastName, user.email, user.password, user.createdAt, user.updatedAt);
	}

	async save(): Promise<void> {
		const existingUser = await knex('users').where({ email: this.email }).first();
		if (existingUser && existingUser.id !== this.id) {
			throw new Error(`User with email ${this.email} already exists`);
		}
		if (existingUser.id === this.id) {
			await knex('users').where({ id: this.id }).update({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				password: this._password,
				updatedAt: new Date(),
			});
		} else {
			const result = await knex('users').insert({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				password: this._password,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}
	}

	async delete(): Promise<void> {
		await knex('users').where({ id: this.id }).delete();
		await knex('wallets').where({userId: this.id}).delete();
	}
}
