import { knex } from './db.model';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from './User.Model';

export class Auth {
	static async authenticateUser(email: string, password: string): Promise<string> {
		const user = await knex('users').where({ email }).first().catch(
			(error)=>{throw new Error("internal error");}
		);
		if (!user) {
			throw new Error(`User with email ${email} not found`);
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new Error(`Incorrect password`);
		}
		return user.uuid;
	}

	static async authorizeUser(userId: string): Promise<string> {
		const user = await knex('users').where({ uuid: userId }).first().catch(
			(error)=>{throw new Error(`internal error`);}
		);
		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		let token = randomUUID().replace("-","").slice(0, 10)
		await knex('auth_tokens').insert({
			userId: user.uuid,
			token,
			createdAt: new Date(),
			status: "active"
		}).catch(
			(error)=>{throw new Error("internal error");}
		);
		
		return token;
		// TODO grant user role access
	}

	static async unAuthorizeUser(userId: string): Promise<any> {
		await knex('auth_tokens').where({ userId: userId }).delete().catch(
			(error)=>{throw new Error("internal error");}
		);;
		return true;
	}

	static async getUserbyToken(token: string): Promise<User> {
		const auth_token = await knex('auth_tokens').where({ token:token }).first().catch(
			(error)=>{throw new Error("internal error");}
		);
		if (!auth_token) {
			throw new Error(`Session token '${token}' not found`);
		}
		
		const user = User.findById(auth_token.userId);
		return user;
	}
}
