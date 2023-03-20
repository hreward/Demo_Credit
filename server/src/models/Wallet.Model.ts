import knex from 'knex';
import { Transaction } from "./Transaction.Model";
import { User } from './User.Model';

export class Wallet {
  private _reference: string;
  private _userId: string;
  private _balance: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(reference:string, userId: string, balance: number, createdAt?: Date, updatedAt?: Date) {
    this._reference = reference;
    this._userId = userId;
    this._balance = balance;

    if(createdAt === null) this._createdAt = new Date(); else this._createdAt = createdAt;
    if(updatedAt === null) this._updatedAt = new Date(); else this._updatedAt = updatedAt;
  }

  // Getters and setters
  get reference(): string {
    return this._reference;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  get balance(): number {
    return this._balance;
  }

  set balance(balance: number) {
    this._balance = balance;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Get wallet by userId
  static async findByUserId(userId: string): Promise<Wallet> {
    const wallet = await knex('wallets').where({ userId }).first();
    if (!wallet) {
      throw new Error(`Wallet for user ${userId} not found`);
    }
    return new Wallet(wallet.reference, wallet.userId, wallet.balance, wallet.createdAt, wallet.updatedAt);
  }

  async save(): Promise<void> {
    const existingWallet = await knex('wallets').where({ userId: this.userId }).first();
    if (existingWallet && existingWallet.reference !== this.reference) {
        throw new Error(`Another wallet different form this exists for this user`);
    }
    if (existingWallet.reference === this.reference) {
      await knex('wallets').where({ id: this.reference }).update({
        userId: this.userId,
        balance: this.balance,
        updatedAt: new Date(),
      });
    } else {
      const result = await knex('wallets').insert({
        reference: this.reference,
        userId: this.userId,
        balance: this.balance,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    //   this._reference = result[0];
    }
  }

  public async getTransactions(): Promise<Transaction[]> {
    const rows = await knex('transactions').where({ wallet_reference: this.reference });

    return rows.map((row) => new Transaction(row.reference, row.wallet_reference, row.type, row.amount, row.created_at));
  }

  public async getBalance(): Promise<number> {
    const row = await knex('wallets').where({ reference: this.reference }).select('balance').first();

    return row.balance;
  }

  public async updateBalance(amount: number, ): Promise<void> {
    await knex('wallets').where({ reference: this.reference }).update({ balance: this.balance + amount });

    this.balance += amount;
  }

  public async transfer(amount: number, recipient: User): Promise<Transaction> {
    
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }

    const senderWallet = this;
    const recipientWallet = await Wallet.findByUserId(recipient.id);

    
		
    const trx = await knex(null).transaction();
    try {
        await trx('wallets').where({ reference: senderWallet.reference }).update({ balance: this.balance - amount });
        await trx('wallets').where({ reference: recipientWallet.reference }).update({ balance: this.balance + amount });
        
        await trx.commit();
        return await Transaction.create(this._userId, recipient.id, amount);
        // Transaction.create(senderWallet.reference, 'debit', amount);
        // Transaction.create(recipientWallet.reference, 'credit', amount);
        
    } catch (err) {
        await trx.rollback();
        throw err;
    }
  }

  public async addFunds(amount: number, description: string): Promise<Transaction> {
    try {
        await knex('wallets').where({ reference: this.reference }).update({ balance: this.balance + amount });
        return await Transaction.create(this.userId, this.userId, amount, description);
        
    } catch (err) {
        throw err;
    }
  }

  public async withdrawFunds(amount: number, description: string): Promise<Transaction> {
    
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    try {
        await knex('wallets').where({ reference: this.reference }).update({ balance: this.balance - amount });
        return await Transaction.create(this.userId, this.userId, amount, description);
    } catch (err) {
        throw err;
    }
  }
}
