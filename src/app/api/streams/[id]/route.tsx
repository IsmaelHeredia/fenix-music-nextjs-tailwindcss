import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const [result] = await conn.query("SELECT * FROM live_streams WHERE id = ?", [
      params.id,
    ]);

    const json: any = result;

    if (json.length === 0) {
      return NextResponse.json(
        {
          message: "Stream not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 1,
        stream: json[0]
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const newData = {
      name: data.name,
      link: data.link,
      categories: data.categories,
    };

    const [result] = await conn.query("UPDATE live_streams SET ? WHERE id = ?", [
      newData,
      params.id,
    ]);

    const json: any = result;

    if (json.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Stream not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 1,
        message: "Stream updated"
      }
    );
    
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const [result] = await conn.query("DELETE FROM live_streams WHERE id = ?", [
      params.id,
    ]);

    const json: any = result;

    if (json.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Stream not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 1,
        message: "Stream deleted"
      }
    );

  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}