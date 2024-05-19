import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const [stationsList] = await conn.query("SELECT * FROM stations");
    return NextResponse.json(
        {
          status: 1,
          stations: stationsList
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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        {
          message: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!data.link) {
      return NextResponse.json(
        {
          message: "Link is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!data.categories) {
      return NextResponse.json(
        {
          message: "Categories is required",
        },
        {
          status: 400,
        }
      );
    }

    const [result] = await conn.query("INSERT INTO stations SET ?", {
      name: data.name,
      link: data.link,
      categories: data.categories
    });

    const json: any = result;

    return NextResponse.json({
      status: 1,
      message: "Station created",
      id: json.insertId,
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