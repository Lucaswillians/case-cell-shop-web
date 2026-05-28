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
        "relative w-full text-left rounded-xl border-2 p-5 transition-all",
        selected
          ? "border-accent bg-accent/5 shadow-md"
          : "border-border bg-card hover:border-accent/50",
        outOfStock && "opacity-50 cursor-not-allowed",
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 text-accent">
          <CheckCircle size={18} />
        </span>
      )}

      <p className="font-semibold text-sm">{product.name}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-3 flex justify-between">
        <span className="font-bold">
          {Number(product.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>

        <span className="text-xs text-muted-foreground">
          {outOfStock
            ? "Esgotado"
            : stock <= 3
              ? `Últimas ${stock}`
              : `${stock} em estoque`}
        </span>
      </div>
    </button>
  );
}