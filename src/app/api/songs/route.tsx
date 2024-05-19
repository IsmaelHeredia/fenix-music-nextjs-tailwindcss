import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const [playlistList] = await conn.query("SELECT * FROM playlists");
    const [songsList] = await conn.query("SELECT * FROM songs");
    return NextResponse.json(
      {
        status: 1,
        playlists : playlistList,
        songs : songsList
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