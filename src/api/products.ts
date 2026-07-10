import baseAPI from "./axios";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  images: string[];
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  stock: number;
  safetyInfo: string;
  notes: string;
  isFeatured: boolean;
  ratings: number;
  reviews: Review[];
  category: { _id: string; name: string; slug: string; image: string };
  createdAt: string;
}

export interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = async (params: ProductsParams = {}) => {
  const { data } = await baseAPI.get("/products", { params });
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data } = await baseAPI.get(`/products/${slug}`);
  return data;
};

export const getFeaturedProducts = async () => {
  const { data } = await baseAPI.get("/featured");
  return data;
};

export const getRelatedProducts = async (slug: string) => {
  const { data } = await baseAPI.get(`/products/related/${slug}`);
  return data;
};

