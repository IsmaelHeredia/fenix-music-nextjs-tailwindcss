import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const [statisticsData] = await conn.query("SELECT (SELECT COUNT(*) FROM songs) AS number_songs,(SELECT COUNT(*) FROM playlists) AS number_playlists,(SELECT COUNT(*) FROM stations) AS number_stations,(SELECT COUNT(*) FROM videos) AS number_videos,(SELECT COUNT(*) FROM live_streams) AS number_live_streams");
    return NextResponse.json(
        {
          status: 1,
          statistics: statisticsData
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