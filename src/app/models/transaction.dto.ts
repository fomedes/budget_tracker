export class TransactionDTO {
  constructor(
    public transactionId: string,
    public title: string,
    public date: Date,
    public category: string,
    public amount: number,
    public currency: string,
    public default_currency: string,
    public country: string,
    public description: string,
    public split: string
  ) {}
}
