import { NextRequest, NextResponse } from "next/server";
import requestClient from "@/lib/request-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await requestClient.post(`${API_BASE_URL}/auth/register`, body);
    const data = response.data;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
