import { NextResponse } from "next/server";
import type { Category } from "@/lib/types";

const MOCK_CATEGORIES: Category[] = [
  { id: "cat-streaming", name: "Streaming", icon: "🎬", color: "#E50914" },
  { id: "cat-software", name: "Software", icon: "💻", color: "#3B82F6" },
  { id: "cat-fitness", name: "Fitness", icon: "💪", color: "#10B981" },
  { id: "cat-media", name: "Nieuws & Media", icon: "📰", color: "#F59E0B" },
  { id: "cat-cloud", name: "Cloud Storage", icon: "☁️", color: "#8B5CF6" },
  { id: "cat-insurance", name: "Verzekeringen", icon: "🛡️", color: "#0EA5E9" },
  { id: "cat-fixed", name: "Vaste lasten", icon: "🏠", color: "#84CC16" },
  { id: "cat-vehicle", name: "Voertuig", icon: "🚗", color: "#6366F1" },
  { id: "cat-health", name: "Gezondheid", icon: "🏥", color: "#EC4899" },
  { id: "cat-finance", name: "Bank & Financiën", icon: "🏦", color: "#14B8A6" },
  { id: "cat-other", name: "Overig", icon: "📦", color: "#6B7280" },
];

export async function GET() {
  return NextResponse.json(MOCK_CATEGORIES);
}
