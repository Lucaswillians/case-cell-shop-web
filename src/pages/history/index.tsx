// import { Link } from "react-router-dom";
// import { CalendarDays, ShoppingBag, ArrowLeft } from "lucide-react";

// export default function HistoryPage() {

//   return (
//     <main className="min-h-screen bg-background flex flex-col">
//       <header className="border-b border-border bg-card">
//         <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <CalendarDays size={20} className="text-accent" aria-hidden />
//             <span className="font-bold text-foreground tracking-tight">
//               Histórico de compras
//             </span>
//           </div>
//           <Link
//             to="/products"
//             className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
//           >
//             <ArrowLeft size={16} aria-hidden />
//             Voltar
//           </Link>
//         </div>
//       </header>

//       <div className="flex-1 px-4 py-10">
//         <div className="mx-auto w-full max-w-3xl space-y-6">
//           <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground uppercase tracking-wide">
//                   Histórico de compras
//                 </p>
//                 <h1 className="mt-2 text-2xl font-bold text-foreground">
//                   Seus pedidos anteriores
//                 </h1>
//               </div>
//               <ShoppingBag size={24} className="text-accent" aria-hidden />
//             </div>
//           </div>

//           {history.length === 0 ? (
//             <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
//               <p className="text-foreground font-semibold mb-2">
//                 Nenhum pedido encontrado.
//               </p>
//               <p className="leading-relaxed">
//                 Faça sua primeira compra e o histórico aparecerá aqui.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {history.map((item) => (
//                 <div
//                   key={item.id}
//                   className="rounded-2xl border border-border bg-card p-6"
//                 >
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Pedido</p>
//                       <p className="font-semibold text-foreground">{item.id}</p>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(item.date).toLocaleString("pt-BR", {
//                         dateStyle: "short",
//                         timeStyle: "short",
//                       })}
//                     </p>
//                   </div>

//                   <div className="mt-5 grid gap-4 sm:grid-cols-2">
//                     <div className="rounded-2xl border border-border bg-secondary p-4">
//                       <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                         Produto
//                       </p>
//                       <p className="mt-2 font-semibold text-foreground">
//                         {item.product}
//                       </p>
//                     </div>
//                     <div className="rounded-2xl border border-border bg-secondary p-4">
//                       <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                         Total
//                       </p>
//                       <p className="mt-2 font-semibold text-foreground">
//                         {item.total.toLocaleString("pt-BR", {
//                           style: "currency",
//                           currency: "BRL",
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
