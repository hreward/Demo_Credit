import knex from 'knex';

// Define the Loan class
export class Loan {
    private _reference: string;
    private _userId: string;
    private _amount: number;
    private _status: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(reference: string, userId: string, amount: number, status: string, createdAt?: Date, updatedAt?: Date) {
        this._reference = reference;
        this._userId = userId;
        this._amount = amount;
        this._status = status;

        if(createdAt === null) this._createdAt = new Date(); else this._createdAt = createdAt;
        if(updatedAt === null) this._updatedAt = new Date(); else this._updatedAt = updatedAt;
    }

    // Getters and setters for private properties
    get reference(): string {
        return this._reference;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(userId: string) {
        this._userId = userId;
    }

    get amount(): number {
        return this._amount;
    }

    set amount(amount: number) {
        this._amount = amount;
    }

    get status(): string {
        return this._status;
    }

    set status(status: string) {
        this._status = status;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // Database queries
    static async findById(id: string): Promise<Loan> {
        const loan = await knex('loans').where({ id }).first();
        if (!loan) {
            throw new Error(`Loan with ID ${id} not found`);
        }
        return new Loan(loan.id, loan.userId, loan.amount, loan.status, loan.createdAt, loan.updatedAt);
    }

    static async findByUserId(userId: string): Promise<Loan[]> {
        const loans = await knex('loans').where({ userId });
        return loans.map((loan: any) => new Loan(loan.id, loan.userId, loan.amount, loan.status, loan.createdAt, loan.updatedAt));
    }

    async save(): Promise<void> {
        const existingLoan = await knex('loans').where({ reference: this.reference }).first();
        if (existingLoan && existingLoan.reference == this.reference) {
            await knex('loans').where({ id: this.reference }).update({
                userId: this.userId,
                amount: this.amount,
                status: this.status,
                updatedAt: new Date(),
            });
        } else {
            const result = await knex('loans').insert({
                userId: this.userId,
                amount: this.amount,
                status: this.status,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }
}
