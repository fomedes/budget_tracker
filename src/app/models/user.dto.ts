export class UserDTO {
  constructor(
    public user_id: string = '',
    public access_token: string = '',
    public name: string = '',
    public username: string = '',
    public email: string = '',
    public password: string = '',
    public currency: string = '',
    public country: string = '',
    public defaultCurrency: {
      name: string;
      code: string;
      symbol: string;
    } = {
      name: '',
      code: '',
      symbol: '',
    },
    public lastCountry: string = '',
    public lastCurrency: string = '',
    public transactions: any[] = []
  ) {}
}
