import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number | string;
  tag?: string;
}

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function ProductCard({
  product,
  selected,
  onSelect,
}: ProductCardProps) {
  const stock = Number(product.stock ?? 0);

  const outOfStock = stock <= 0;

  return (
    <button
      type="button"
      onClick={() => !outOfStock && onSelect(product.id)}
      disabled={outOfStock}
      aria-pressed={selected}
      className={cn(
        "relative w-full text-left rounded-xl border-2 p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-accent bg-accent/5 shadow-md"
          : "border-border bg-card hover:border-accent/50",
        outOfStock &&
        "opacity-50 cursor-not-allowed hover:border-border",
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 text-accent">
          <CheckCircle size={18} aria-hidden />
        </span>
      )}

      {product.tag && (
        <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
          {product.tag}
        </span>
      )}

      <p className="font-semibold text-foreground text-sm leading-snug">
        {product.name}
      </p>

      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <span className="text-lg font-bold text-foreground">
          {Number(product.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>

        <span
          className={cn(
            "text-xs font-medium",
            outOfStock
              ? "text-destructive"
              : stock <= 3
                ? "text-amber-600"
                : "text-muted-foreground",
          )}
        >
          {outOfStock
            ? "Esgotado"
            : stock <= 3
              ? `Últimas ${stock} unid.`
              : `${stock} em estoque`}
        </span>
      </div>
    </button>
  );
}