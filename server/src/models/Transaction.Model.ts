import { randomUUID } from 'crypto';
import knex from 'knex';

export class Transaction {
	private _reference: string;
	private _fromUserId: string;
	private _toUserId: string;
	private _amount: number;
	private _createdAt: Date;

	constructor(reference: string, fromUserId: string, toUserId: string, amount: number, createdAt?: Date) {
		this._reference = reference;
		this._fromUserId = fromUserId;
		this._toUserId = toUserId;
		this._amount = amount;

		if(createdAt === null) this._createdAt = new Date(); else this._createdAt = createdAt;
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
			});
			return new Transaction(reference, fromUserId, toUserId, amount, new Date());
		
	}
	
	static async findAllByUserId(userId: string): Promise<Transaction[]> {
		const transactions = await knex('transactions').where('fromUserId', userId).orWhere('toUserId', userId).orderBy('createdAt', 'desc');
		return transactions.map((transaction: any) => {
			return new Transaction(transaction.reference, transaction.fromUserId, transaction.toUserId, transaction.amount, transaction.createdAt);
		});
		
	}
	
	static async findTransactionByUserId(tranxId:string, userId: string): Promise<Transaction> {
		const transaction = await knex('transactions').where('fromUserId', userId).orWhere('toUserId', userId).andWhere('reference', tranxId).first();
		return new Transaction(transaction.reference, transaction.fromUserId, transaction.toUserId, transaction.amount, transaction.createdAt);
		
	}
}
