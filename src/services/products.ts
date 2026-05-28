import api from "./api";

export async function getProducts() {
  const { data } = await api.get("/products");

  return data.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: product.quantity,
  }));
}