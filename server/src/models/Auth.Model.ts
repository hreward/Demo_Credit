import knex from 'knex';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from './User.Model';

export class Auth {

	static async authenticateUser(email: string, password: string): Promise<string> {
		const user = await knex('users').where({ email }).first();
		if (!user) {
			throw new Error(`User with email ${email} not found`);
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new Error(`Incorrect password`);
		}
		return user.id;
	}

	static async authorizeUser(userId: string): Promise<string> {
		const user = await knex('users').where({ id: userId }).first();
		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		let token = randomUUID().replace("-","").slice(0, 10)
		await knex('auth_tokens').insert({
			userId: user.id,
			token,
			createdAt: new Date(),
			status: 'active'
		})
		
		return token;
		// TODO grant user role access
	}

	static async unAuthorizeUser(userId: string): Promise<boolean> {
		await knex('auth_tokens').where({ userId: userId }).first();
		return true;
	}

	static async getUserbyToken(token: string): Promise<User> {
		const auth_token = await knex('auth_tokens').where({ token }).first();
		if (!token) {
			throw new Error(`Token ${token} not found`);
		}
		const user = User.findById(auth_token.userId);
		return user;
	}
}
