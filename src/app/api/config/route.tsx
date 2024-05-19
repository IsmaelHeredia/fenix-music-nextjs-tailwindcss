import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const [configData] = await conn.query("SELECT * FROM config where id = 1");
    return NextResponse.json(
        {
          status: 1,
          config: configData
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

export async function POST(request : Request) {

  try {
    const data = await request.json();

    if(data.songDirectory) {

      const newData = {
        song_directory: data.songDirectory,
      };

      const [result] = await conn.query("UPDATE config SET ? WHERE id = ?", [
        newData,
        1,
      ]);

      const json: any = result;

      if (json.affectedRows === 0) {
        return NextResponse.json(
          {
            message: "Configuration not found",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(
        {
          status: 1,
          message: "Song directory updated"
        }
      );

    }

    if(data.videoDirectory) {

      const newData = {
        video_directory: data.videoDirectory,
      };

      const [result] = await conn.query("UPDATE config SET ? WHERE id = ?", [
        newData,
        1,
      ]);

      const json: any = result;

      if (json.affectedRows === 0) {
        return NextResponse.json(
          {
            message: "Configuration not found",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(
        {
          status: 1,
          message: "Video directory updated"
        }
      );

    }    

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