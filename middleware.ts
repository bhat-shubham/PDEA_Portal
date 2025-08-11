import { NextRequest, NextResponse } from "next/server";

const roleRoutes = {
  admin: ["/admin", "/dashboard"],
  teacher: ["/teacher", "/dashboard"],
  student: ["/student", "/dashboard"],
};

const publicRoutes = ["/admin/login", "/admin/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  let user: { email: string; role: string; exp?: number } | null = null;

  console.log(`Current path: ${path}`);

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  const token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const verifyRes = await fetch(`${process.env.TEST_API}/admin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (verifyRes.ok) {
        user = await verifyRes.json();
      } else {
        console.warn("Token verification failed:", await verifyRes.text());
      }
    } catch (err) {
      console.error("Error verifying token in middleware:", err);
    }
  }

  // ✅ If public route & logged in → redirect to dashboard
  if (isPublicRoute && user?.role) {
    return NextResponse.redirect(new URL(`/${user.role}/dashboard`, req.url));
  }

  // ✅ If private route & not logged in → redirect to login
  if (!isPublicRoute && !user?.role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Role-based access check
  const allowedRoutes = roleRoutes[user?.role as keyof typeof roleRoutes] || [];
  const isAllowed = allowedRoutes.some((route) => path.startsWith(route));

  if (!isPublicRoute && user?.role && !isAllowed) {
    return NextResponse.redirect(new URL(`/${user.role}/dashboard`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
