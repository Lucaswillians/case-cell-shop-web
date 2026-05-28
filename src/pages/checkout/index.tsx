import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Smartphone,
  ListChecks,
} from "lucide-react";

import { Checkout } from "@/components/Checkout";

export default function CheckoutPage() {
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

      <div className="flex-1 px-4 py-10">
        <Checkout />
      </div>
    </main>
  );
}