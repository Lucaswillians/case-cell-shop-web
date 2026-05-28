import { useEffect, type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProductCard } from "./../ProductCard";
import { useProducts } from "@/services/hooks/useProducts";

export function ProductForm() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useProducts();

  const navigate = useNavigate();

  // ✅ agora é array (multi-select)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (products.length && selectedProductIds.length === 0) {
      setSelectedProductIds([products[0].id]);
    }
  }, [products]);

  const mappedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      stock: Number((product as any).stock ?? 0),
    }));
  }, [products]);

  const selectedProducts = useMemo(() => {
    return mappedProducts.filter((product) =>
      selectedProductIds.includes(product.id),
    );
  }, [mappedProducts, selectedProductIds]);

  function handleProductToggle(id: string) {
    setSelectedProductIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedProducts.length) return;

    navigate("/cart", {
      state: {
        items: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: 1,
        })),
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle size={18} />
        <p>Não foi possível carregar os produtos.</p>
      </div>
    );
  }

  if (!mappedProducts.length) {
    return <div className="text-sm text-muted-foreground">Nenhum produto encontrado.</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Escolha os produtos
          </legend>

          <div className="grid gap-3">
            {mappedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={selectedProductIds.includes(product.id)}
                onSelect={handleProductToggle}
              />
            ))}
          </div>
        </fieldset>

        {selectedProducts.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Produtos selecionados
            </p>

            <ul className="mt-2 space-y-1">
              {selectedProducts.map((p) => (
                <li key={p.id} className="font-semibold text-foreground">
                  {p.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        <button
          type="submit"
          disabled={selectedProducts.length === 0}
          className={cn(
            "relative w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground",
            "hover:opacity-90 active:scale-[0.99]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingBag size={16} />
            Adicionar ao carrinho
          </span>
        </button>
      </div>
    </form>
  );
}