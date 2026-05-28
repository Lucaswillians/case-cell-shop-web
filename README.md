# Case Cell Shop Web

Frontend do projeto Case Cell Shop, desenvolvido em React.

---

## 🚀 Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

---

### 2. Rodar a aplicação

```bash
npm run dev
```

---

## ⚙️ Pré-requisitos

Antes de rodar o frontend, é necessário que a API esteja rodando:

* Case Cell Shop API:
  👉 https://github.com/Lucaswillians/case-cell-shop-api

---

## 📦 Funcionalidades

* Listagem de produtos
* Seleção de produto
* Carrinho de compras
* Checkout
* Criação de pedidos
* Histórico de pedidos
* Detalhes do pedido
* Cancelamento de pedidos

---

## 🔗 Fluxo da aplicação

```txt
Produtos → Carrinho → Checkout → Pedido confirmado
```

---

## 📌 Observação

O frontend depende de produtos cadastrados na API.

Para funcionar corretamente:

1. Rode o backend
2. Crie produtos via Insomnia (`POST /products`)
3. Depois use o sistema normalmente
