import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request: Request) {
  try {

    const formData = await request.formData();

    const json_file: any = formData.get("json_file");

    if(!json_file) {
      return NextResponse.json(
        {
          message: "JSON File is required",
        },
        {
          status: 400,
        }
      );
    } else {

      const [results_ds] = await conn.query("DELETE FROM stations;");
      const [results_rs] = await conn.query("ALTER TABLE stations AUTO_INCREMENT = 1;");
 
      const content = Buffer.from(await json_file.arrayBuffer()).toString();
      const stationsData = JSON.parse(content);

      for (var i = 0; i < stationsData.length; i++) {
          var stationData = stationsData[i];
          var stationName = stationData.name;
          var stationLink = stationData.link;
          var stationCategories = stationData.categories;

          const [results] = await conn.query("INSERT INTO stations SET ?",
          {
              name : stationName,
              link: stationLink,
              categories: stationCategories
          });
      }

      return NextResponse.json({
        status: 1,
        stations_count: stationsData.length,
        message: "Stations imported",
      });

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