import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api";
import { Product } from "./types";

export const useGetProducts = (enabled = true) =>
  useQuery<Product[], Error>(
    ["products"], // query key
    () => getProducts(), // fetcher
    { enabled } // giữ đúng pattern enabled đang dùng
  );
