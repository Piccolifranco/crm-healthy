import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/pacientes"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Token guardado en cookie por el login
  const token = req.cookies.get("accessToken")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = pathname === "/"; // tu login está en "/"

  // Si NO está logueado e intenta entrar a una ruta protegida -> mandar al login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si YA está logueado y va al login -> redirigir a /pacientes
  if (token && isAuthPage) {
    const pacientesUrl = new URL("/turnos", req.url);
    return NextResponse.redirect(pacientesUrl);
  }

  // Dejar pasar
  return NextResponse.next();
}

// Indicar en qué rutas corre el middleware
export const config = {
  matcher: ["/", "/pacientes/:path*"],
};