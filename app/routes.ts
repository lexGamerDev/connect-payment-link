import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/products", "routes/products.tsx"),
  route("/cart", "routes/cart.tsx"),
  route("/orders", "routes/orders.tsx"),
  route("/order-success", "routes/order-success.$orderId.tsx"),
  route("/test-payment", "routes/test-payment.tsx"),
] satisfies RouteConfig;
