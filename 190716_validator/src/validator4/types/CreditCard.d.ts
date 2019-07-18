export interface CreditCard {
  owner: {
    name: string;
    date_of_birth: string;
  };
  number: number;
  expires_at: string;
}
