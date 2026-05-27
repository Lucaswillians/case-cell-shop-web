import { CheckCircle2, PackageCheck } from "lucide-react";

interface OrderSummaryProps {
  orderId: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  onNewOrder: () => void;
}

export function OrderSummary({
  orderId,
  product,
  quantity,
  unitPrice,
  total,
  onNewOrder,
}: OrderSummaryProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={36} className="text-green-600" aria-hidden />
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground">
          Pedido confirmado!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Seu pedido foi registrado com sucesso.
        </p>
      </div>

      <div className="w-full rounded-xl border border-border bg-secondary p-5 text-left space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
          <PackageCheck size={13} aria-hidden />
          <span>Resumo do pedido</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pedido</span>
          <span className="font-mono font-semibold text-foreground">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Produto</span>
          <span className="font-semibold text-foreground text-right max-w-[55%]">
            {product}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quantidade</span>
          <span className="text-foreground">{quantity}x</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Preço unitário</span>
          <span className="text-foreground">
            {unitPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-lg text-accent">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewOrder}
        className="mt-2 w-full rounded-lg border-2 border-foreground py-3 text-sm font-semibold text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors duration-150"
      >
        Fazer novo pedido
      </button>
    </div>
  );
}
