import { useState, type FormEvent } from "react";
import { ArrowLeft, CreditCard, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderSummary } from "@/components/OrderSummary";

interface CheckoutFormState {
  name: string;
  address: string;
  postalCode: string;
  phone: string;
}

const DEFAULT_ORDER = {
  orderId: "CS-20260526",
  product: "Capinha Silicone Premium",
  quantity: 1,
  unitPrice: 49.9,
  total: 49.9,
};

export function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutFormState>({
    name: "",
    address: "",
    postalCode: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(field: keyof CheckoutFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    if (error) setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.address.trim() || !form.postalCode.trim()) {
      setError("Preencha nome, endereço e CEP para continuar.");
      return;
    }

    setSuccess(true);
  }

  function handleResetOrder() {
    setForm({ name: "", address: "", postalCode: "", phone: "" });
    setError(null);
    setSuccess(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <OrderSummary
            orderId={DEFAULT_ORDER.orderId}
            product={DEFAULT_ORDER.product}
            quantity={DEFAULT_ORDER.quantity}
            unitPrice={DEFAULT_ORDER.unitPrice}
            total={DEFAULT_ORDER.total}
            onNewOrder={handleResetOrder}
          />
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={16} aria-hidden />
            Voltar para as capinhas
          </button>
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
              <h1 className="text-xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground">
                Complete seus dados para finalizar a compra.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Dados do cliente
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-foreground">
                  <span>Nome completo</span>
                  <div className="rounded-xl border border-border bg-background px-4 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} />
                      <input
                        value={form.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        placeholder="Ex: Maria Silva"
                        className="w-full bg-transparent text-sm text-foreground outline-none"
                      />
                    </div>
                  </div>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>Telefone</span>
                  <div className="rounded-xl border border-border bg-background px-4 py-3">
                    <input
                      value={form.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-transparent text-sm text-foreground outline-none"
                    />
                  </div>
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Endereço de entrega
              </legend>
              <div className="space-y-4">
                <label className="space-y-2 text-sm text-foreground">
                  <span>Rua, número e complemento</span>
                  <div className="rounded-xl border border-border bg-background px-4 py-3">
                    <input
                      value={form.address}
                      onChange={(event) => handleChange("address", event.target.value)}
                      placeholder="Rua das Flores, 123"
                      className="w-full bg-transparent text-sm text-foreground outline-none"
                    />
                  </div>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>CEP</span>
                  <div className="rounded-xl border border-border bg-background px-4 py-3 flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} />
                    <input
                      value={form.postalCode}
                      onChange={(event) => handleChange("postalCode", event.target.value)}
                      placeholder="00000-000"
                      className="w-full bg-transparent text-sm text-foreground outline-none"
                    />
                  </div>
                </label>
              </div>
            </fieldset>

            {error && (
              <p className="rounded-xl border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Confirmar compra
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-3">Resumo do pedido</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Produto</span>
              <span>{DEFAULT_ORDER.product}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantidade</span>
              <span>{DEFAULT_ORDER.quantity}x</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {DEFAULT_ORDER.unitPrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-foreground font-semibold">
              <span>Total</span>
              <span>
                {DEFAULT_ORDER.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
