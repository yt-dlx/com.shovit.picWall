// src/api/database/[category]/route.ts
import metaBase from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ category: string }> }) {
  const { category } = await context.params;
  if (category in metaBase) {
    const data = metaBase[category as keyof typeof metaBase];
    return NextResponse.json(data);
  } else return NextResponse.json({ error: `Category "${category}" not found` }, { status: 404 });
}
