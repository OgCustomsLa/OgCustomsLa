import type { Metadata } from "next";
import OrderWizard from "@/components/OrderWizard";

export const metadata: Metadata = { title: "Start an order — OG Customs LA" };

export default function OrderPage() {
  return <OrderWizard />;
}
