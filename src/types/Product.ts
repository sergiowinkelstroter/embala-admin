import { Photo } from "./Photo";

export interface Product {
  id?: string;
  name: string;
  image?: Photo;
  description: string;
  status: string;
  category: string;
  types: [{ name: string; price: number }, { name: string; price: number }];
}
