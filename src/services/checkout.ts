import api from "./api";

export async function createCheckout(data: {
  productId: string;
  quantity: number;
}) {
  const { data: response } = await api.post(
    "/checkout",
    data,
  );

  return response;
}

export async function getCheckoutHistory() {
  const { data } = await api.get("/checkout");
  return data;
}

export async function getCheckoutById(id: string) {
  const { data } = await api.get(
    `/checkout/${id}`,
  );

  return data;
}

export async function cancelCheckout(id: string) {
  const { data } = await api.patch(
    `/checkout/${id}/cancel`,
  );

  return data;
}