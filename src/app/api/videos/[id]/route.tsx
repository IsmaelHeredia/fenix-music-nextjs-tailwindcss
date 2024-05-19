import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

const fs = require("fs-extra");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const [result] = await conn.query("SELECT * FROM videos where id = ?", [params.id]);

    const json: any = result;

    const dir_videos = "public/videos/";

    const new_name = new Date().getTime().toString() + ".mp4";

    try {
      const files = fs.readdir(dir_videos, (err: any, files: any) => {
        if (err) {
          throw err;
        }

        files.forEach((file: any) => { 
          if (file.split(".").pop().toLowerCase() == "mp4") {
            fs.unlinkSync(dir_videos + file)
          }
        });

        fs.copySync(json[0].fullpath, dir_videos + new_name);

      });
    } catch (err) {
      console.error(err);
    }

    return NextResponse.json(
      {
        status: 1,
        temp_video: process.env.NEXT_PUBLIC_URL + "/videos/" + new_name
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