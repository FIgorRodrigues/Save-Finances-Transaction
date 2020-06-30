import { uuid } from 'uuidv4';
import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Omit<Balance, 'total'>, currentValue: Transaction) => {
        const { type } = currentValue;
        if (type === 'income') accumulator.income += currentValue.value;
        else if (type === 'outcome') accumulator.outcome += currentValue.value;
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
      },
    );
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction: Transaction = {
      id: uuid(),
      title,
      value,
      type,
    };
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
