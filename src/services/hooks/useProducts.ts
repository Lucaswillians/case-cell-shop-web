import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../products";


export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}