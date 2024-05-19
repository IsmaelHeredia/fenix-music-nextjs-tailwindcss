import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const [videosList] = await conn.query("SELECT * FROM videos");
    return NextResponse.json(
      {
        status: 1,
        videos : videosList
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}