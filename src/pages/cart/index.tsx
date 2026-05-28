import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useMemo, useState } from "react";

import {
  ShieldCheck,
  Smartphone,
  ListChecks,
  Minus,
  Plus,
} from "lucide-react";

import { useProducts } from "@/services/hooks/useProducts";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartData {
  customerName: string;
  street: string;
  city: string;
  zipCode: string;
  items: CartItem[];
}

export default function CartPage() {
  const location = useLocation();

  const navigate = useNavigate();

  const stateCart = location.state as CartData | undefined;

  const [customerName, setCustomerName] = useState(
    stateCart?.customerName ?? "",
  );

  const [street, setStreet] = useState(
    stateCart?.street ?? "",
  );

  const [city, setCity] = useState(
    stateCart?.city ?? "",
  );

  const [zipCode, setZipCode] = useState(
    stateCart?.zipCode ?? "",
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(
    stateCart?.items ?? [],
  );

  const { data: products = [] } = useProducts();

  function incrementQty(productId: string) {
    setCartItems((items) =>
      items.map((item) =>
        item.productId === productId
          ? {
            ...item,
            quantity: Math.min(item.quantity + 1, 5),
          }
          : item,
      ),
    );
  }

  function decrementQty(productId: string) {
    setCartItems((items) =>
      items.map((item) =>
        item.productId === productId
          ? {
            ...item,
            quantity: Math.max(item.quantity - 1, 1),
          }
          : item,
      ),
    );
  }

  const detailedItems = useMemo(() => {
    return cartItems.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId,
      );

      return {
        ...item,
        product,
        subtotal: product
          ? Number(product.price) * item.quantity
          : 0,
      };
    });
  }, [cartItems, products]);

  const total = detailedItems.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  function handleProceedCheckout() {
    navigate("/checkout", {
      state: {
        customerName,
        street,
        city,
        zipCode,
        items: cartItems,
      },
    });
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">
            Carrinho vazio
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Adicione produtos antes de continuar.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Ir para produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Smartphone
              size={20}
              className="text-accent"
              aria-hidden
            />

            <span className="font-bold text-foreground tracking-tight">
              CapeShop
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={13} aria-hidden />

              <span>Compra segura</span>
            </div>

            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
            >
              <ListChecks size={14} aria-hidden />
              Histórico
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground text-balance">
              Carrinho
            </h1>

            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Revise os itens e preencha os dados antes
              de seguir para o checkout.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6">
            <section className="rounded-3xl border border-border bg-background p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">
                Dados do cliente
              </h2>

              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Nome
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Rua
                </label>

                <input
                  type="text"
                  value={street}
                  onChange={(e) =>
                    setStreet(e.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Digite sua rua"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Cidade
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    CEP
                  </label>

                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) =>
                      setZipCode(e.target.value)
                    }
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="CEP"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground">
                Itens do carrinho
              </h2>

              <div className="mt-4 space-y-4">
                {detailedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {item.product?.name ??
                            "Produto"}
                        </p>

                        <p className="mt-3 text-sm text-muted-foreground">
                          Unitário:{" "}
                          <span className="font-semibold text-foreground">
                            {Number(
                              item.product?.price ?? 0,
                            ).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Subtotal:{" "}
                          <span className="font-semibold text-foreground">
                            {item.subtotal.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              },
                            )}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center overflow-hidden rounded-lg border border-border bg-card">
                        <button
                          type="button"
                          onClick={() =>
                            decrementQty(item.productId)
                          }
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-10 text-center text-sm font-bold text-foreground">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            incrementQty(item.productId)
                          }
                          disabled={item.quantity >= 5}
                          className="px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total
                </span>

                <span className="text-lg font-bold text-foreground">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </section>

            <button
              type="button"
              onClick={handleProceedCheckout}
              disabled={
                !customerName ||
                !street ||
                !city ||
                !zipCode
              }
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Realizar pagamento
            </button>

            <Link
              to="/products"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Voltar para produtos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}