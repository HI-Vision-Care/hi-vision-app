import api from "@/config/axios";
import { Product } from "./types";

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/product");
  return res.data;
};
