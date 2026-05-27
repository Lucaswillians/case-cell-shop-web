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
import { ProductCard, type Product } from "./../ProductCard";
import { OrderSummary } from "./../OrderSummary";

const PRODUCTS: Product[] = [
  {
    id: "case-001",
    name: "Capinha Silicone Premium",
    description:
      "Silicone macio, proteção das bordas e sensação agradável ao toque.",
    price: 49.9,
    stock: 10,
    tag: "Mais vendida",
  },
  {
    id: "case-002",
    name: "Capinha Clear Anti-Impacto",
    description:
      "Transparente com bordas reforçadas, mostra o design original do seu celular.",
    price: 69.9,
    stock: 3,
  },
  {
    id: "case-003",
    name: "Capinha Couro Vegano",
    description:
      "Acabamento premium em couro sintético com suporte para cartões.",
    price: 119.9,
    stock: 0,
  },
];

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
  const [selectedProductId, setSelectedProductId] = useState<string>("case-001");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<ErrorState | null>(null);
  const [order, setOrder] = useState<SuccessState | null>(null);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId)!;
  const isProcessing = status === "loading";

  function clearError() {
    if (error) setError(null);
    if (status === "error") setStatus("idle");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isProcessing) return;

    setStatus("loading");
    setError(null);

    // const result = await checkoutService({
    //   productId: selectedProductId,
    //   quantity,
    // });

    // if (result.ok) {
    //   setOrder({
    //     orderId: result.orderId,
    //     product: result.product,
    //     quantity: result.quantity,
    //     unitPrice: result.unitPrice,
    //     total: result.total,
    //   });
    //   setStatus("success");
    // } else {
    //   setError({ message: result.message, type: result.type });
    //   setStatus("error");
    // }
  }

  function handleNewOrder() {
    setSelectedProductId("case-001");
    setQuantity(1);
    setStatus("idle");
    setError(null);
    setOrder(null);
  }

  const subtotal = selectedProduct.price * quantity;

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
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {/* Product selection */}
        <fieldset>
          <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            1. Escolha o produto
          </legend>
          <div className="grid gap-3">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={selectedProductId === product.id}
                onSelect={handleProductSelect}
              />
            ))}
          </div>
        </fieldset>

        {/* Quantity */}
        <fieldset>
          <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            2. Quantidade{" "}
            <span className="normal-case font-normal">(máx. 5 por pedido)</span>
          </legend>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={decrementQty}
                disabled={quantity <= 1 || isProcessing}
                aria-label="Diminuir quantidade"
                className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={14} aria-hidden />
              </button>
              <span
                aria-live="polite"
                aria-atomic="true"
                className="w-10 text-center text-sm font-bold text-foreground select-none"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                disabled={quantity >= 5 || isProcessing}
                aria-label="Aumentar quantidade"
                className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={14} aria-hidden />
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              Subtotal:{" "}
              <span className="font-semibold text-foreground">
                {subtotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
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
              error.type === "unavailable"
                ? "bg-amber-50 border border-amber-200 text-amber-800"
                : "bg-red-50 border border-red-200 text-red-800"
            )}
          >
            {error.type === "unavailable" ? (
              <WifiOff
                size={16}
                className="shrink-0 mt-0.5 text-amber-600"
                aria-hidden
              />
            ) : (
              <AlertCircle
                size={16}
                className="shrink-0 mt-0.5 text-red-500"
                aria-hidden
              />
            )}
            <p className="leading-relaxed">{error.message}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isProcessing || selectedProduct.stock === 0}
          aria-disabled={isProcessing}
          className={cn(
            "relative w-full rounded-xl py-4 text-sm font-bold tracking-wide transition-all duration-150",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 active:scale-[0.99]",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" aria-hidden />
              Processando pedido…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={16} aria-hidden />
              Finalizar compra
            </span>
          )}
        </button>

        {isProcessing && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-xs text-muted-foreground"
          >
            Aguarde, estamos confirmando seu pedido…
          </p>
        )}
      </div>
    </form>
  );
}
