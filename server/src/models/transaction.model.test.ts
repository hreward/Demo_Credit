
import { Transaction } from './Transaction.Model';


describe('Transaction', () => {

    describe('create', () => {
        it('should insert a new transaction and return it', async () => {
            // Needed vars
            const fromUserId = 'user1';
            const toUserId = 'user2';
            const amount = 100;
            const expectedTransaction = new Transaction(expect.any(String), fromUserId, toUserId, amount, expect.any(Date));
            jest.spyOn(Transaction, 'create').mockResolvedValue(expectedTransaction);

            // Make the call
            const transaction = await Transaction.create(fromUserId, toUserId, amount);

            // Check
            expect(transaction).toEqual(expectedTransaction);
        });
    });

    describe('Get User\'s Transactions', () => {
        it('should find all transactions by user and return them', async () => {
            // Needed Vars
            const userId = 'user2';
            const expectedTransaction = expect.any([Transaction]);
            jest.spyOn(Transaction, 'findAllByUserId').mockResolvedValue(expectedTransaction);

            // Make the calls
            const transactions = await Transaction.findAllByUserId(userId);

            // Check
            expect(transactions).toBe(expect.arrayContaining([expect.any(Transaction)]) || []);
        });
    });

    describe('Get a specific transactions by a user', () => {
        it('should find all transactions by user and return them', async () => {
            // Needed Vars
            const userId = 'user2';
            const tranxId = 'gts2hys45g';
            const expectedTransaction = expect.any(Transaction);
            jest.spyOn(Transaction, 'findTransactionByUserId').mockResolvedValue(expectedTransaction);

            // Make the calls
            const transaction = await Transaction.findTransactionByUserId(tranxId ,userId);

            // Check
            expect(transaction).toEqual(expectedTransaction);
        });
    });

    describe('Get a specific transactions by a user', () => {
        it('should find all transactions by user and return them', async () => {
            // Needed Vars
            const userId = 'user2';
            const tranxId = 'gts2hys45g';
            const expectedTransaction = expect.any(Transaction);
            jest.spyOn(Transaction, 'findTransactionByUserId').mockResolvedValue(expectedTransaction);

            // Make the calls
            const transaction = await Transaction.findTransactionByUserId(tranxId ,userId);

            // Check
            expect(transaction).toEqual(expectedTransaction || undefined);
        });
    });


});