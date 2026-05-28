
import { useEffect, type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";

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

  const [selectedProductId, setSelectedProductId] =
    useState<string>("");

  useEffect(() => {
    if (products.length && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const mappedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      stock: Number((product as any).stock ?? 0),
    }));
  }, [products]);

  const selectedProduct = useMemo(() => {
    return mappedProducts.find(
      (product) => product.id === selectedProductId,
    );
  }, [mappedProducts, selectedProductId]);

  function handleProductSelect(id: string) {
    setSelectedProductId(id);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedProduct) return;

    navigate("/cart", {
      state: {
        items: [
          {
            productId: selectedProduct.id,
            quantity: 1,
          },
        ],
      },
    });
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
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle size={18} />

        <p>Não foi possível carregar os produtos.</p>
      </div>
    );
  }

  if (!mappedProducts.length) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Escolha o produto
          </legend>

          <div className="grid gap-3">
            {mappedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={selectedProductId === product.id}
                onSelect={handleProductSelect}
              />
            ))}
          </div>
        </fieldset>

        {selectedProduct && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Produto selecionado
                </p>

                <p className="text-lg font-bold text-foreground">
                  {selectedProduct.name}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Preço
                </p>

                <p className="text-lg font-bold text-foreground">
                  {selectedProduct.price.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </p>
              </div>
            </div>
          </section>
        )}

        <button
          type="submit"
          disabled={
            !selectedProduct ||
            selectedProduct.stock <= 0
          }
          className={cn(
            "relative w-full rounded-xl bg-primary py-4 text-sm font-bold tracking-wide text-primary-foreground transition-all duration-150",
            "hover:opacity-90 active:scale-[0.99]",
            "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <span className="flex items-center justify-center gap-2 cursor-pointer">
            <ShoppingBag size={16} />
            Adicionar ao carrinho
          </span>
        </button>
      </div>
    </form>
  );
}
