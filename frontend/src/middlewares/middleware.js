import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
	const token = request.cookies.get("token");

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		// Verify the token
		const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));

		// Check role-based access
		const { pathname } = request.nextUrl;
		if (pathname.startsWith("/admin") && payload.role !== "admin") {
			return NextResponse.redirect(new URL("/unauthorized", request.url));
		}
		if (pathname.startsWith("/student") && payload.role !== "student") {
			return NextResponse.redirect(new URL("/unauthorized", request.url));
		}

		return NextResponse.next();
	} catch (error) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: ["/admin/:path*", "/student/:path*", "/dashboard/:path*"],
};
