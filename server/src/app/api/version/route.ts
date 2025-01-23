// src/app/api/version/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ version: "4.0.0" });
}
