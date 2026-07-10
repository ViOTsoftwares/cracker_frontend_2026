import baseAPI from "./axios";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export const getCategories = async () => {
  const { data } = await baseAPI.get("/categories");
  return data;
};
