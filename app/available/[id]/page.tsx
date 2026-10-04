import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PieceView from "@/components/PieceView";
import { PIECES } from "@/lib/available";

// one page per piece that has a photo
const find = (id: string) => PIECES.find(p => p.id === id && p.image);

export function generateStaticParams() {
  return PIECES.filter(p => p.image).map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = find((await params).id);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    openGraph: { title: `${p.title} — OG Customs LA`, description: p.description, images: p.image ? [p.image] : undefined },
  };
}

export default async function PiecePage({ params }: { params: Promise<{ id: string }> }) {
  const p = find((await params).id);
  if (!p) notFound();
  return <PieceView p={p} />;
}
