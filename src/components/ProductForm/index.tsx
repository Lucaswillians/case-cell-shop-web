import { useState } from "react";

import {
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  AlertCircle,
  WifiOff,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { ProductCard } from "./../ProductCard";

import { OrderSummary } from "./../OrderSummary";
import { useProducts } from "@/services/hooks/useProducts";



type Status = "idle" | "loading" | "success" | "error";

interface ErrorState {
  message: string;
  type: "unavailable" | "validation" | "stock";
}

interface SuccessState {
  orderId: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function ProductForm() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useProducts();

  const [selectedProductId, setSelectedProductId] =
    useState<string>("");

  const [quantity, setQuantity] = useState(1);

  const [status, setStatus] =
    useState<Status>("idle");

  const [error, setError] =
    useState<ErrorState | null>(null);

  const [order, setOrder] =
    useState<SuccessState | null>(null);

  const selectedProduct = products.find(
    (p: any) => p.id === selectedProductId,
  );

  const isProcessing = status === "loading";

  function clearError() {
    if (error) setError(null);

    if (status === "error") {
      setStatus("idle");
    }
  }

  function incrementQty() {
    setQuantity((q) => Math.min(q + 1, 5));

    clearError();
  }

  function decrementQty() {
    setQuantity((q) => Math.max(q - 1, 1));

    clearError();
  }

  function handleProductSelect(id: string) {
    setSelectedProductId(id);

    setQuantity(1);

    clearError();
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (isProcessing || !selectedProduct) {
      return;
    }

    setStatus("loading");

    setError(null);

    // Aqui vamos integrar o checkout depois
    setTimeout(() => {
      setOrder({
        orderId: crypto.randomUUID(),

        product: selectedProduct.name,

        quantity,

        unitPrice: selectedProduct.price,

        total:
          selectedProduct.price * quantity,
      });

      setStatus("success");
    }, 1000);
  }

  function handleNewOrder() {
    setSelectedProductId("");

    setQuantity(1);

    setStatus("idle");

    setError(null);

    setOrder(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2
          size={24}
          className="animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex items-center gap-3
          rounded-lg border border-red-200
          bg-red-50
          p-4
          text-sm text-red-700
        "
      >
        <AlertCircle size={18} />

        <p>
          Não foi possível carregar os
          produtos.
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum produto encontrado.
      </div>
    );
  }

  if (!selectedProduct && products.length) {
    setSelectedProductId(products[0].id);
    return null;
  }

  const subtotal = selectedProduct
    ? selectedProduct.price * quantity
    : 0;

  if (status === "success" && order) {
    return (
      <OrderSummary
        orderId={order.orderId}
        product={order.product}
        quantity={order.quantity}
        unitPrice={order.unitPrice}
        total={order.total}
        onNewOrder={handleNewOrder}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="space-y-6">
        {/* Product selection */}
        <fieldset>
          <legend
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-muted-foreground
            "
          >
            1. Escolha o produto
          </legend>

          <div className="grid gap-3">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={
                  selectedProductId ===
                  product.id
                }
                onSelect={
                  handleProductSelect
                }
              />
            ))}
          </div>
        </fieldset>

        {/* Quantity */}
        <fieldset>
          <legend
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-muted-foreground
            "
          >
            2. Quantidade{" "}
            <span className="normal-case font-normal">
              (máx. 5 por pedido)
            </span>
          </legend>

          <div className="flex items-center gap-4">
            <div
              className="
                flex items-center
                overflow-hidden
                rounded-lg
                border border-border
                bg-card
              "
            >
              <button
                type="button"
                onClick={decrementQty}
                disabled={
                  quantity <= 1 ||
                  isProcessing
                }
                aria-label="Diminuir quantidade"
                className="
                  px-4 py-3
                  text-muted-foreground
                  transition-colors
                  hover:bg-secondary
                  hover:text-foreground
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Minus size={14} />
              </button>

              <span
                aria-live="polite"
                aria-atomic="true"
                className="
                  w-10
                  select-none
                  text-center
                  text-sm
                  font-bold
                  text-foreground
                "
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={incrementQty}
                disabled={
                  quantity >= 5 ||
                  isProcessing
                }
                aria-label="Aumentar quantidade"
                className="
                  px-4 py-3
                  text-muted-foreground
                  transition-colors
                  hover:bg-secondary
                  hover:text-foreground
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              Subtotal:{" "}
              <span className="font-semibold text-foreground">
                {subtotal.toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  },
                )}
              </span>
            </div>
          </div>
        </fieldset>

        {/* Error feedback */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className={cn(
              "flex gap-3 rounded-lg p-4 text-sm",

              error.type ===
                "unavailable"
                ? `
                  border border-amber-200
                  bg-amber-50
                  text-amber-800
                `
                : `
                  border border-red-200
                  bg-red-50
                  text-red-800
                `,
            )}
          >
            {error.type ===
              "unavailable" ? (
              <WifiOff
                size={16}
                className="
                  mt-0.5 shrink-0
                  text-amber-600
                "
              />
            ) : (
              <AlertCircle
                size={16}
                className="
                  mt-0.5 shrink-0
                  text-red-500
                "
              />
            )}

            <p className="leading-relaxed">
              {error.message}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={
            isProcessing ||
            !selectedProduct ||
            selectedProduct.stock === 0
          }
          aria-disabled={isProcessing}
          className={cn(
            `
              relative
              w-full
              rounded-xl
              bg-primary
              py-4
              text-sm
              font-bold
              tracking-wide
              text-primary-foreground
              transition-all
              duration-150
            `,
            `
              hover:opacity-90
              active:scale-[0.99]
            `,
            `
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:active:scale-100
            `,
            `
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
            `,
          )}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2
                size={16}
                className="animate-spin"
              />

              Processando pedido…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={16} />

              Finalizar compra
            </span>
          )}
        </button>

        {isProcessing && (
          <p
            role="status"
            aria-live="polite"
            className="
              text-center
              text-xs
              text-muted-foreground
            "
          >
            Aguarde, estamos confirmando
            seu pedido…
          </p>
        )}
      </div>
    </form>
  );
}