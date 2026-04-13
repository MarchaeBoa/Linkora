export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid";

export type SubscriptionPlan = "pro" | "business";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme_color: string;
  social_links: Record<string, string>;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "trialing",
];

export function hasActiveSubscription(
  profile: Pick<Profile, "subscription_status"> | null | undefined,
): boolean {
  if (!profile) return false;
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(profile.subscription_status);
}

export type ProductType = "ebook" | "pdf" | "curso" | "arquivo" | "link_externo";

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number;
  cover_url: string | null;
  file_url: string;
  product_type: ProductType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  position: number;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_email: string;
  amount: number;
  stripe_session_id: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
}
