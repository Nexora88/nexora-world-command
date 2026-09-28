export type OrderType = "move" | "attack" | "build" | "produce" | "research" | "trade" | "diplomacy";
export type OrderStatus = "queued" | "active" | "completed" | "cancelled" | "failed";

export interface GameOrder {
  id: string;
  type: OrderType;
  actorId: string;
  sourceId?: string;
  targetId?: string;
  createdAt: number;
  startsAt?: number;
  finishesAt?: number;
  status: OrderStatus;
  progress: number;
  payload?: Record<string, string | number | boolean>;
}

const orders = new Map<string, GameOrder>();

export function createOrder(input: Omit<GameOrder, "id" | "status" | "progress">) {
  const order: GameOrder = { ...input, id: crypto.randomUUID(), status: "queued", progress: 0 };
  orders.set(order.id, order);
  return { ...order };
}

export function getOrders() { return [...orders.values()].map(order => ({ ...order })); }
export function getOrder(id: string) { const order = orders.get(id); return order ? { ...order } : undefined; }
export function cancelOrder(id: string) { const order = orders.get(id); if (!order) return false; order.status = "cancelled"; return true; }

export function tickOrders(gameTime: number) {
  for (const order of orders.values()) {
    if (order.status === "queued" && (!order.startsAt || gameTime >= order.startsAt)) order.status = "active";
    if (order.status !== "active" || !order.finishesAt) continue;
    const duration = Math.max(1, order.finishesAt - (order.startsAt ?? order.createdAt));
    order.progress = Math.max(0, Math.min(1, (gameTime - (order.startsAt ?? order.createdAt)) / duration));
    if (gameTime >= order.finishesAt) { order.progress = 1; order.status = "completed"; }
  }
  return getOrders();
}

export function resetOrders() { orders.clear(); }
