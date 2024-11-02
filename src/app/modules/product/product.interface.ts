export type TProduct = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: TRating;
};

export type TRating = {
  rate: number;
  count: number;
};
