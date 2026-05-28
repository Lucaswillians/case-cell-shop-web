import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCheckout,
  getCheckoutHistory,
  getCheckoutById,
  cancelCheckout,
} from "../checkout";

export function useCheckout(id?: string) {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["checkout-history"],
    queryFn: getCheckoutHistory,
  });

  const byIdQuery = useQuery({
    queryKey: ["checkout", id],
    queryFn: () => getCheckoutById(id!),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: createCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkout-history"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkout-history"],
      });

      if (id) {
        queryClient.invalidateQueries({
          queryKey: ["checkout", id],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    history: historyQuery.data,
    isHistoryLoading: historyQuery.isLoading,

    checkout: byIdQuery.data,
    isCheckoutLoading: byIdQuery.isLoading,

    createCheckout: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    cancelCheckout: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,
  };
}