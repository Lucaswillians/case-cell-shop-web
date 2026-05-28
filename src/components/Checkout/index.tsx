import { useState } from "react";

import {
  ArrowLeft,
  CreditCard,
  Loader2,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { OrderSummary } from "@/components/OrderSummary";

import { useOrders } from "@/services/hooks/useOrders";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CheckoutData {
  customerName: string;
  street: string;
  city: string;
  zipCode: string;
  items: CartItem[];
}

export function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  const checkoutData =
    location.state as CheckoutData | undefined;

  const { createOrder, isCreating } = useOrders();

  const [error, setError] = useState<string | null>(
    null,
  );

  const [successOrder, setSuccessOrder] =
    useState<any>(null);

  async function handleCreateOrder() {
    if (!checkoutData) {
      setError("Dados do checkout não encontrados.");

      return;
    }

    if (!checkoutData.items.length) {
      setError("Carrinho vazio.");

      return;
    }

    try {
      const response = await createOrder({
        customerName: checkoutData.customerName,
        street: checkoutData.street,
        city: checkoutData.city,
        zipCode: checkoutData.zipCode,
        items: checkoutData.items,
      });

      setSuccessOrder(response);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        "Erro ao finalizar pedido",
      );
    }
  }

  function handleResetOrder() {
    setSuccessOrder(null);

    setError(null);

    navigate("/products");
  }

  if (successOrder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <OrderSummary
            order={successOrder.order}
            message={successOrder.message}
            onNewOrder={handleResetOrder}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 text-foreground">
            <CreditCard size={20} aria-hidden />

            <div>
              <h1 className="text-xl font-bold">
                Checkout
              </h1>

              <p className="text-sm text-muted-foreground">
                Revise os dados antes de finalizar a compra.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">
                Dados do cliente
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Nome:
                  </span>

                  <p className="font-medium text-foreground">
                    {checkoutData?.customerName}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    Rua:
                  </span>

                  <p className="font-medium text-foreground">
                    {checkoutData?.street}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    Cidade:
                  </span>

                  <p className="font-medium text-foreground">
                    {checkoutData?.city}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    CEP:
                  </span>

                  <p className="font-medium text-foreground">
                    {checkoutData?.zipCode}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Produtos
              </h2>

              <div className="space-y-3">
                {checkoutData?.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between rounded-xl border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Produto
                      </p>

                      <p className="text-xs text-muted-foreground break-all">
                        {item.productId}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-foreground">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {error && (
              <p className="rounded-xl border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleCreateOrder}
              disabled={isCreating}
              className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
            >
              <span className="flex items-center justify-center gap-2">
                {isCreating && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isCreating
                  ? "Processando compra..."
                  : "Confirmar compra"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}