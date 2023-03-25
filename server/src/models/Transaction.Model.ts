import { randomUUID } from 'crypto';
import { knex } from './db.model';

export class Transaction {
	private _reference: string;
	private _fromUserId: string;
	private _toUserId: string;
	private _amount: number;
	private _createdAt: Date;

	constructor(reference: string, fromUserId: string, toUserId: string, amount: number, createdAt = new Date()) {
		this._reference = reference;
		this._fromUserId = fromUserId;
		this._toUserId = toUserId;
		this._amount = amount;

		this._createdAt = createdAt;
	}

	// Getters and setters
	get reference(): string {
		return this._reference;
	}

	get fromUserId(): string {
		return this._fromUserId;
	}

	set fromUserId(fromUserId: string) {
		this._fromUserId = fromUserId;
	}

	get toUserId(): string {
		return this._toUserId;
	}

	set toUserId(toUserId: string) {
		this._toUserId = toUserId;
	}

	get amount(): number {
		return this._amount;
	}

	set amount(amount: number) {
		this._amount = amount;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	
	static async create(fromUserId: string, toUserId: string, amount: number, description?: string): Promise<Transaction> {
		
		const reference:string = randomUUID().replace("-", "");
		const result = await knex('transactions').insert({
			reference,
			fromUserId,
			toUserId,
			amount,
			description,
			createdAt: new Date(),
		}).catch(
			(error)=>{throw new Error("internal error");}
		);
		return new Transaction(reference, fromUserId, toUserId, amount, new Date());
	}
	
	static async findAllByUserId(userId: string): Promise<Transaction[]> {
		const transactions = await knex('transactions').where({fromUserId: userId}).orWhere({toUserId: userId}).orderBy('createdAt', 'desc').catch(
			(error)=>{throw new Error("internal error"+error);}
		);
		return transactions.map((transaction: any) => {
			return new Transaction(transaction.reference, transaction.fromUserId, transaction.toUserId, transaction.amount, transaction.createdAt);
		});
		
	}
	
	static async findTransactionByUserId(tranxId:string, userId: string): Promise<Transaction> {
		const transaction = await knex('transactions').where('reference', tranxId).where('fromUserId', userId).orWhere('toUserId', userId).andWhere('reference', tranxId).first().catch(
			(error)=>{throw new Error("internal error");}
		);
		if(!transaction){
			throw new Error("Transaction not found");
		}
		return new Transaction(transaction.reference, transaction.fromUserId, transaction.toUserId, transaction.amount, transaction.createdAt);
		
	}
}
