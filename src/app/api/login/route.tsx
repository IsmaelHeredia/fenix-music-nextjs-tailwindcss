import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { generateToken } from "@/libs/jwt";

var bcrypt = require("bcryptjs");

export async function POST(request : Request) {
  try {
    const data = await request.json();

    if (!data.username) {
      return NextResponse.json(
        {
          message: "Username is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!data.password) {
      return NextResponse.json(
        {
          message: "Password is required",
        },
        {
          status: 400,
        }
      );
    }

    const [result] = await conn.query("SELECT id,user,pwd FROM users where user = ?", [data.username]);

    const json: any = result;

    if(json[0] != null) {

	    const result_js = JSON.parse(JSON.stringify(result));

	    const id = result_js[0].id;
	    const pwd_db = result_js[0].pwd;

	    if(bcrypt.compareSync(data.password, pwd_db)) {

          	const payload = {
            	id:  id,
            	user: data.username
          	};

          	var token = generateToken(payload);

		    return NextResponse.json({
		      status: 1,
		      token: token,
		      message: "Token generated",
		    });

		} else {

	      return NextResponse.json(
	        {
	          message: "Incorrect password",
	        },
	        {
	          status: 400,
	        }
	      );

		}

	} else {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 400,
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