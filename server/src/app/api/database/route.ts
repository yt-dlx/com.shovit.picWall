// src/app/api/database/route.ts
import metaBase from "@/database";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(metaBase);
}
