import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

const fs = require("fs-extra");

export async function GET() {
  try {

    const dir_downloads = "public/downloads/";

    const json_file = "stations.json";

    const filename = dir_downloads + json_file;

    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    const [results] = await conn.query("SELECT * FROM stations");

    const stationsData = JSON.parse(JSON.stringify(results));

    var stationsObject = [];

    for (var i = 0; i < stationsData.length; i++) {
      var stationData = stationsData[i];
      var stationName = stationData.name;
      var stationLink = stationData.link;
      var stationCategories = stationData.categories;
      
      stationsObject.push(
        {
          name: stationName,
          link: stationLink,
          categories: stationCategories
        }
      );
    }

    var stationsJSON = JSON.stringify(stationsObject, null, 2);

    fs.writeFile(filename, stationsJSON, "utf8");

    return NextResponse.json({
      status: 1,
      filename: process.env.NEXT_PUBLIC_URL + "/downloads/" + json_file,
      message: "Stations exported",
    });

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