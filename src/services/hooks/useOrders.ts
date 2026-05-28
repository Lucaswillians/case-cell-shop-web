import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Order, CreateOrderDTO } from "../orders";

import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
} from "../orders";

export function useOrders(id?: string) {
  const queryClient = useQueryClient();

  const historyQuery = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const orderQuery = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const createMutation = useMutation<Order, Error, CreateOrderDTO>({
    mutationFn: createOrder,

    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.setQueryData(
        ["order", newOrder.id],
        newOrder,
      );
    },
  });

  type CancelContext = {
    previousOrders?: Order[];
    previousOrder?: Order;
  };

  const cancelMutation = useMutation<Order, Error, string, CancelContext>({
    mutationFn: async (orderId) => {
      await cancelOrder(orderId);

      const updated = await getOrderById(orderId);

      return updated;
    },

    onMutate: async (orderId) => {
      await queryClient.cancelQueries({
        queryKey: ["orders"],
      });

      await queryClient.cancelQueries({
        queryKey: ["order", orderId],
      });

      const previousOrders =
        queryClient.getQueryData<Order[]>(["orders"]);

      const previousOrder =
        queryClient.getQueryData<Order>(["order", orderId]);

      if (previousOrders) {
        queryClient.setQueryData<Order[]>(
          ["orders"],
          previousOrders.map((item) =>
            item.id === orderId
              ? {
                ...item,
                status: "canceled",
              }
              : item,
          ),
        );
      }

      if (previousOrder) {
        queryClient.setQueryData<Order>(
          ["order", orderId],
          {
            ...previousOrder,
            status: "canceled",
          },
        );
      }

      return {
        previousOrders,
        previousOrder,
      };
    },

    onError: (_error, orderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["orders"],
          context.previousOrders,
        );
      }

      if (context?.previousOrder) {
        queryClient.setQueryData(
          ["order", orderId],
          context.previousOrder,
        );
      }
    },

    onSettled: (_data, _error, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      if (orderId) {
        queryClient.invalidateQueries({
          queryKey: ["order", orderId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    history: historyQuery.data,
    order: orderQuery.data,

    isHistoryLoading: historyQuery.isLoading,
    isOrderLoading: orderQuery.isLoading,

    isHistoryError: historyQuery.isError,
    isOrderError: orderQuery.isError,

    createOrder: createMutation.mutateAsync,
    cancelOrder: cancelMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isCanceling: cancelMutation.isPending,

    createError: createMutation.error,
    cancelError: cancelMutation.error,
  };
}