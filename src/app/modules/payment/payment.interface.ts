export type TPaymentProps = {
  clientName: string | undefined;
  address: string | null | undefined;
  clientPhoneNo: number | null | undefined;
  transactionId: string;
  clientEmail: string | undefined;
  orderId: string;
  totalCost: number;
  _id?: string;
};

export type TPaymentInfo = {
  transactionId: string;
  clientEmail: string;
  orderId?: string;
  amount: string;
  quantity?: number;
};
