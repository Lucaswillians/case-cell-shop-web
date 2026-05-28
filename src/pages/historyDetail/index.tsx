import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Ban,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import { useOrders } from "@/services/hooks/useOrders";

export default function HistoryDetailPage() {
  const { id } = useParams();

  const {
    order,
    isOrderLoading,
    isOrderError,
    cancelOrder,
    isCanceling,
    cancelError,
  } = useOrders(id);

  const [isCancelling, setIsCancelling] =
    useState(false);

  async function handleCancel() {
    if (!id) return;

    setIsCancelling(true);

    try {
      await cancelOrder(id);
    } finally {
      setIsCancelling(false);
    }
  }

  if (isOrderLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          Carregando pedido...
        </p>
      </main>
    );
  }

  if (isOrderError || !order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">
          Erro ao carregar pedido.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList
              size={20}
              className="text-accent"
            />

            <span className="font-bold text-foreground">
              Detalhes do pedido
            </span>
          </div>

          <Link
            to="/history"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-10">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Pedido
                </p>

                <p className="mt-2 text-xl font-bold text-foreground break-all">
                  {order.id}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
                <ShieldCheck size={16} />

                {order.status === "canceled"
                  ? "Cancelado"
                  : "Confirmado"}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Produtos
            </h2>

            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-secondary p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.productName}
                      </p>

                      <p className="text-sm text-muted-foreground mt-1">
                        Quantidade: {item.quantity}x
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Unitário
                      </p>

                      <p className="font-semibold text-foreground">
                        {Number(
                          item.unitPrice,
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>

                    <span className="font-bold text-foreground">
                      {Number(
                        item.totalPrice,
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                Total do pedido
              </span>

              <span className="text-2xl font-bold text-accent">
                {Number(order.totalPrice).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  },
                )}
              </span>
            </div>

            <div className="mt-4 text-sm text-muted-foreground space-y-2">
              <p>
                Cliente: {order.customerName}
              </p>

              <p>
                Endereço: {order.street},{" "}
                {order.city}
              </p>

              <p>CEP: {order.zipCode}</p>

              <p>
                Criado em:{" "}
                {new Date(
                  order.createdAt,
                ).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {cancelError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Falha ao cancelar pedido.
            </div>
          )}

          {order.status !== "canceled" && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={
                isCanceling || isCancelling
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/10 px-5 py-4 text-sm font-semibold text-destructive transition hover:bg-destructive/20 disabled:opacity-60"
            >
              <Ban size={16} />

              {isCanceling || isCancelling
                ? "Cancelando pedido..."
                : "Cancelar pedido"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}