export interface IProduct {
  productId: string;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

export interface IOrder {
  products: IProduct[];
  user: {
    name: string;
    email: string;
    address: string;
    phone: string;
    postCode: string;
  };
  tnxId?: string;
  totalAmount: number;
  status: "unpaid" | "paid";
  date: string;
}
