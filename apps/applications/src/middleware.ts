import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se existe token nos cookies
  const token = request.cookies.get("access_token")?.value;
  const hasToken = Boolean(token);

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/dashboard"];

  // Rotas de autenticação (login)
  const authRoutes = ["/", "/"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);

  // Se está tentando acessar rota protegida sem token
  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se está logado e tentando acessar página de login, redireciona para dashboard
  if (isAuthRoute && hasToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
