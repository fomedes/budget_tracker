export class TransactionDTO {
  constructor(
    public transaction_id: string = '',
    public title: string = '',
    public description: string = '',
    public plan: string = '',
    public date: Date = new Date(),
    public category: string = '',
    public country: string = '',
    public currency: string = '',
    public amount: number = 0,
    public accountCurrencyAmount: string = '',
    public split: string = '',
    public user_id: string = ''
  ) {}
}
