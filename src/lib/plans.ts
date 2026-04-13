import type { SubscriptionPlan } from "@/types";

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  description: string;
  /** Price in the smallest currency unit (centavos). R$29,00 → 2900 */
  priceAmount: number;
  priceLabel: string;
  period: string;
  currency: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para criadores profissionais",
    priceAmount: 2900,
    priceLabel: "R$ 29",
    period: "/mês",
    currency: "brl",
    features: [
      "Links ilimitados",
      "Produtos ilimitados",
      "Analytics avançado",
      "Domínio próprio",
      "Sem marca Linkora",
      "Suporte prioritário",
      "Webhooks",
    ],
    highlighted: true,
    badge: "Mais popular",
  },
  business: {
    id: "business",
    name: "Business",
    description: "Para equipes e empresas",
    priceAmount: 7900,
    priceLabel: "R$ 79",
    period: "/mês",
    currency: "brl",
    features: [
      "Tudo do Pro",
      "Múltiplas páginas",
      "Membros da equipe",
      "API completa",
      "White-label",
      "SLA 99.9%",
      "Gerente dedicado",
    ],
  },
};

export const PLAN_LIST: PlanConfig[] = [PLANS.pro, PLANS.business];

export function isSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return value === "pro" || value === "business";
}
