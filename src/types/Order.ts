import { Company } from "./Company";

export interface Order {
  id: string;
  products: [{ product: string; quatity: number; type: string }];
  company: Company;
  methodPayment: string;
}
