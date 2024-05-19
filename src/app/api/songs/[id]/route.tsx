import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

const fs = require("fs-extra");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const [result] = await conn.query("SELECT * FROM songs where id = ?", [params.id]);

    const json: any = result;

    const dir_songs = "public/songs/";

    const new_name = new Date().getTime().toString() + ".mp3";

    try {
      const files = fs.readdir(dir_songs, (err: any, files: any[]) => {
        if (err) {
          throw err;
        }

        files.forEach((file: any) => { 
          if (file.split(".").pop().toLowerCase() == "mp3") {
            fs.unlinkSync(dir_songs + file)
          }
        });

        fs.copySync(json[0].fullpath, dir_songs + new_name);

      });
    } catch (err) {
      console.error(err);
    }

    return NextResponse.json(
      {
        status: 1,
        temp_song: process.env.NEXT_PUBLIC_URL + "/songs/" + new_name
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