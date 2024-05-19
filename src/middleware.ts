import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateJwt } from "@/libs/jwtSecurity";

export default async function middleware(req: any) {
	const token = req.headers.get("Authorization");
	const result = await validateJwt(token);

	if (!result) {
		return Response.json({ status: 0, message: "Access denied" }, { status: 401 })
	}
}

export const config = {
	matcher: [
		'/api/config/:path*',
		'/api/profile/:path*',
		'/api/songs/:path*',
		'/api/videos/:path*',
		'/api/stations/:path*',
		'/api/streams/:path*',
		'/api/statistics/:path*'
	],
}