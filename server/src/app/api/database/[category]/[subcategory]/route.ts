// src/api/database/[category]/[subcategory]/route.ts
import metaBase from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ category: string; subcategory: string }> }) {
  const { category, subcategory } = await context.params;
  if (category in metaBase) {
    const categoryData = metaBase[category as keyof typeof metaBase];
    if (subcategory in categoryData) {
      const subcategoryData = categoryData[subcategory as keyof typeof categoryData];
      return NextResponse.json(subcategoryData);
    } else return NextResponse.json({ error: `Subcategory "${subcategory}" not found in category "${category}"` }, { status: 404 });
  } else return NextResponse.json({ error: `Category "${category}" not found` }, { status: 404 });
}
