import baseAPI from "./axios";

export interface Banner {
  _id: string;
  title: string;
  desktopImage: string;
  mobileImage: string;
  link: string;
  status: string;
  sortOrder: number;
}

export const getBanners = async () => {
  const { data } = await baseAPI.get("/banners");
  return data;
};
