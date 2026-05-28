import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../products";
import type { Product } from "@/components/ProductCard";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}
