import { NextRequest, NextResponse } from "next/server";

const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  teacher: ["/teacher"],
  student: ["/student"],
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  let user: { email: string; role: string; exp?: number };

  const protectedRoutes = Object.values(roleRoutes).flat();
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isAuthPage = path.endsWith("/login") || path.endsWith("/register");

  if (isProtectedRoute && !isAuthPage) {
    if (!token) {
      const res = NextResponse.redirect(new URL("/", req.url));

      return res;
    }

    try {
      const verifyRes = await fetch(`${process.env.TEST_API}/admin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await verifyRes.json();

      if (verifyRes.ok && data.message === "authorized") {
        user = data.user;

        const allowedRoutes = roleRoutes[user.role] || [];
        if (!allowedRoutes.some((route) => path.startsWith(route))) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("Error verifying token in middleware:", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    "/",
    "/teacher/:path*",
    "/student/:path*",
    "/admin/:path*",
  ],
};
