import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

const fs = require("fs-extra");
const path = require("path");

export async function GET() {
  try {

    const [result] = await conn.query("SELECT video_directory FROM config where id = 1");

    const result_js = JSON.parse(JSON.stringify(result));

    const dir_videos = result_js[0].video_directory;

    if(dir_videos == null || dir_videos == "") {
      return NextResponse.json(
        {
          message: "Video directory not found",
        },
        {
          status: 404,
        }
      );
    } 

    const videos_list = [];

    const files = fs.readdirSync(dir_videos);

    // Clear DB

    const [results_dv] = await conn.query("DELETE FROM videos;");
    const [results_rv] = await conn.query("ALTER TABLE videos AUTO_INCREMENT = 1;");

    // Videos

    for (const file of files) {
      const filename = `${dir_videos}/${file}`;

      if(path.extname(filename) == ".mp4") {
        var split_title = path.basename(filename);
        var title = split_title.split(".mp4")[0];
        const data: any = {};
        data["name"] = title;
        data["fullpath"] = filename;
        data["time"] = fs.statSync(filename).mtime.getTime();
        videos_list.push(data);

      }

    }

    let videos_list_sorted = videos_list.sort((a, b) => {        
        return b.time - a.time;
    });

    videos_list_sorted.forEach(async function (video) {
      const [results] = await conn.query("INSERT INTO videos SET ?",
      {
          name : video.name,
          fullpath: video.fullpath
      });
    });
    
    return NextResponse.json(
      {
        status: 1,
        video_directory: dir_videos,
        videos_count: videos_list.length
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