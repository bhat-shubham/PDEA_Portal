import { NextRequest, NextResponse } from "next/server";

// Protected and public routes
const protectedRoutes = ["admin/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  console.log(`Middleware triggered for path: ${path}`);

  // Get token from cookies (or headers if you store it there)
  const token = req.cookies.get("token")?.value;

  let isAuthorized = false;

  if (token) {
    try {
      // Call backend to verify token
      const verifyRes = await fetch(`${process.env.TEST_API}/admin/verify`, {
        method: "POST", // since you asked about POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await verifyRes.json();
        console.log("Token verification response:", data);
      if (data.message === "authorized") {
        isAuthorized = true;
      }
    } catch (err) {
      console.error("Error verifying token in middleware:", err);
    }
  }

  // If route is protected but not authorized → go to login
  if (isProtectedRoute && !isAuthorized) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If route is public but already authorized → go to dashboard
  if (isPublicRoute && isAuthorized && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
