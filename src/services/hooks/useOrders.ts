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

  // ----------------------------
  // GET ALL ORDERS
  // ----------------------------
  const historyQuery = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  // ----------------------------
  // GET ORDER BY ID
  // ----------------------------
  const orderQuery = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  // ----------------------------
  // CREATE ORDER
  // ----------------------------
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

  // ----------------------------
  // CANCEL ORDER
  // ----------------------------
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

      // optimistic update
      if (previousOrders) {
        queryClient.setQueryData<Order[]>(
          ["orders"],
          previousOrders.map((item) =>
            item.id === orderId
              ? {
                ...item,
                status: "CANCELED",
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
            status: "CANCELED",
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
    // queries
    history: historyQuery.data,
    order: orderQuery.data,

    // loading
    isHistoryLoading: historyQuery.isLoading,
    isOrderLoading: orderQuery.isLoading,

    // errors
    isHistoryError: historyQuery.isError,
    isOrderError: orderQuery.isError,

    // mutations
    createOrder: createMutation.mutateAsync,
    cancelOrder: cancelMutation.mutateAsync,

    // mutation states
    isCreating: createMutation.isPending,
    isCanceling: cancelMutation.isPending,

    // mutation errors
    createError: createMutation.error,
    cancelError: cancelMutation.error,
  };
}