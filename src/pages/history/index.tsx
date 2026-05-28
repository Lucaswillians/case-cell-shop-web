import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ShoppingBag, ArrowLeft, XCircle } from "lucide-react";
import { useOrders } from "@/services/hooks/useOrders";

export default function HistoryPage() {
  const {
    history = [],
    isHistoryLoading,
    isHistoryError,
    cancelOrder,
    isCanceling,
    cancelError,
  } = useOrders();

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    setCancellingId(id);

    try {
      await cancelOrder(id);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="text-accent" aria-hidden />
            <span className="font-bold text-foreground tracking-tight">Histórico de compras</span>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <ArrowLeft size={16} aria-hidden />
            Voltar
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-10">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Histórico de compras</p>
                <h1 className="mt-2 text-2xl font-bold text-foreground">Seus pedidos anteriores</h1>
              </div>
              <ShoppingBag size={24} className="text-accent" aria-hidden />
            </div>
          </div>

          {isHistoryLoading && (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Carregando histórico de pedidos...
            </div>
          )}

          {isHistoryError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Erro ao carregar histórico de pedidos.
            </div>
          )}

          {history.length === 0 && !isHistoryLoading && !isHistoryError ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              <p className="text-foreground font-semibold mb-2">Nenhum pedido encontrado.</p>
              <p className="leading-relaxed">Faça sua primeira compra e o histórico aparecerá aqui.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pedido</p>
                      <p className="font-semibold text-foreground">{item.id}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.createdAt)?.toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Produto</p>
                      <p className="mt-2 font-semibold text-foreground">
                        {item.items?.[0]?.productName}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                      <p className="mt-2 font-semibold text-foreground">
                        {item.totalPrice?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted/10 px-3 py-2 text-xs font-semibold text-muted-foreground">
                      <XCircle size={14} aria-hidden />
                      {item.status === "canceled" ? "Cancelado" : "Confirmado"}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/history/${item.id}`}
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
                      >
                        Ver detalhes
                      </Link>
                      {item.status !== "canceled" && (
                        <button
                          type="button"
                          disabled={cancellingId === item.id || isCanceling}
                          onClick={() => handleCancel(item.id)}
                          className="rounded-full border border-destructive bg-destructive/5 px-4 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancellingId === item.id && isCanceling ? "Cancelando…" : "Cancelar pedido"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cancelError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Falha ao cancelar o pedido. Tente novamente.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
