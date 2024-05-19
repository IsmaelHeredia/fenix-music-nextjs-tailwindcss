import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

const fs = require("fs-extra");
const path = require("path");
const getMP3Duration = require("get-mp3-duration");

export async function GET() {
  try {

    const [result] = await conn.query("SELECT song_directory FROM config where id = 1");

    const result_js = JSON.parse(JSON.stringify(result));

    const dir_songs = result_js[0].song_directory;

    if(dir_songs == null || dir_songs == "") {
      return NextResponse.json(
        {
          message: "Song directory not found",
        },
        {
          status: 404,
        }
      );
    }    

    const songs_list = [];

    const files = fs.readdirSync(dir_songs);

    // Clear DB

    const [results_ds] = await conn.query("DELETE FROM songs;");
    const [results_dp] = await conn.query("DELETE FROM playlists;");
    const [results_rs] = await conn.query("ALTER TABLE songs AUTO_INCREMENT = 1;");
    const [results_rp] = await conn.query("ALTER TABLE playlists AUTO_INCREMENT = 1;");

    // Playlists

    const playlists_list = [];

    for (const file of files) {
      const dir_name = `${dir_songs}/${file}`;
      if (fs.statSync(dir_name).isDirectory()) {
        var playlist_name = dir_name.split("/").pop();
        const [results] = await conn.query("INSERT INTO playlists SET ?",
        {
            name : playlist_name
        });
        const json: any = results;
        const data: any = {};
        data["id"] = json.insertId;
        data["name"] = playlist_name;
        playlists_list.push(data);
      }
    }

    // Songs

    var songs_repeated: string[] = [];

    for (const file of files) {
      const dir_name = `${dir_songs}/${file}`;
      const playlist_name = dir_name.split("/").pop();
      if (fs.statSync(dir_name).isDirectory()) {
        //console.log('Directory : ' + dir_name);
        const files_dir = fs.readdirSync(dir_name);
        for (const file_dir of files_dir) {
          const filename = `${dir_name}/${file_dir}`;
          if(!songs_repeated.includes(filename)) {
            if(path.extname(filename) == ".mp3") {
              //console.log('Song : ' + filename);
              const buffer = fs.readFileSync(filename);
              const millis_song = getMP3Duration(buffer);
              var minutes = Math.floor(millis_song / 60000);
              var seconds = ((millis_song % 60000) / 1000).toFixed(0);
              var duration_format = minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
              var split_title = path.basename(filename);
              var title = split_title.split(".mp3")[0];
              const data: any = {};
              data["name"] = title;
              data["fullpath"] = filename;
              data["time"] = fs.statSync(filename).mtime.getTime();
              data["duration"] = millis_song;
              data["duration_format"] = duration_format;
              data["id_playlist"] = playlists_list.find(p => p.name === playlist_name).id;
              songs_list.push(data);
              songs_repeated.push(filename);
            }
          }
        }
      }
    }

    let songs_list_sorted = songs_list.sort((a: any, b: any) => {        
        return b.time - a.time;
    });

    songs_list_sorted.forEach(async function (song: any) {
      const [results] = await conn.query("INSERT INTO songs SET ?",
      {
          title : song.name,
          duration_string: song.duration_format,
          fullpath: song.fullpath,
          id_playlist: song.id_playlist
      });
    });

    return NextResponse.json(
      {
        status: 1,
        song_directory: dir_songs,
        songs_count: songs_list.length
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