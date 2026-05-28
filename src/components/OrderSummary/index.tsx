import {
  CheckCircle2,
  PackageCheck,
  MapPin,
  User,
} from "lucide-react";

interface OrderSummaryProps {
  order: {
    id: string;
    customerName: string;
    street: string;
    city: string;
    zipCode: string;
    status: string;
    totalPrice: number;
  };

  message?: string;

  onNewOrder: () => void;
}

export function OrderSummary({
  order,
  message,
  onNewOrder,
}: OrderSummaryProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2
          size={36}
          className="text-green-600"
          aria-hidden
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground">
          Pedido confirmado!
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {message ??
            "Seu pedido foi registrado com sucesso."}
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-secondary p-5 text-left space-y-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
          <PackageCheck size={13} aria-hidden />

          <span>Resumo do pedido</span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              Pedido
            </span>

            <span className="font-mono text-right font-semibold text-foreground break-all">
              {order.id}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              Status
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700">
              {order.status}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User size={15} />
            Cliente
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Nome
              </span>

              <span className="font-medium text-right text-foreground">
                {order.customerName}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin size={15} />
            Entrega
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Rua
              </span>

              <span className="font-medium text-right text-foreground">
                {order.street}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Cidade
              </span>

              <span className="font-medium text-right text-foreground">
                {order.city}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                CEP
              </span>

              <span className="font-medium text-right text-foreground">
                {order.zipCode}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="font-semibold text-foreground">
            Total pago
          </span>

          <span className="font-bold text-xl text-accent">
            {Number(order.totalPrice).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              },
            )}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewOrder}
        className="mt-2 w-full rounded-lg border-2 border-foreground py-3 text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-foreground hover:text-primary-foreground cursor-pointer"
      >
        Fazer novo pedido
      </button>
    </div>
  );
}