import api from "./api";

export type OrderStatus = "pending" | "approved" | "canceled";

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  customerName: string;
  street: string;
  city: string;
  zipCode: string;
  items: CreateOrderItemDTO[];
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  street: string;
  city: string;
  zipCode: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export async function createOrder(data: CreateOrderDTO) {
  const { data: response } = await api.post<Order>("/orders", data);
  return response;
}

export async function getOrders() {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}

export async function cancelOrder(id: string) {
  const { data } = await api.patch<Order>(`/orders/${id}/cancel`);
  return data;
}