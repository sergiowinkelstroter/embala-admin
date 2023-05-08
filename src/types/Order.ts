import { Company } from "./Company";

export interface Order {
  id: string;
  products: [{ product: string; quantity: number; type: string }];
  company: Company;
  methodPayment: string;
}
