import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { generateToken } from "@/libs/jwt";
import { generatePassword } from "@/libs/helper";

var bcrypt = require("bcryptjs");

export async function POST(request: Request) {
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

    if (!data.new_username) {
      return NextResponse.json(
        {
          message: "New username is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!data.new_password) {
      return NextResponse.json(
        {
          message: "New password is required",
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

          const new_password = generatePassword(data.new_password);

          const newData = {
            user: data.new_username,
            pwd: new_password
          };

          const [result] = await conn.query("UPDATE users SET ? WHERE id = ?", [
            newData,
            id,
          ]);

          const json_result: any = result;

          if (json_result.affectedRows === 0) {
            return NextResponse.json(
              {
                message: "User not found",
              },
              {
                status: 404,
              }
            );
          }

  		    return NextResponse.json({
  		      status: 1,
  		      message: "Profile updated",
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