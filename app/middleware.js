import { NextResponse } from 'next/server';

export function middleware(request) {
    // Les routes que l'on veut protéger
    const protectedPaths = ['/gestion', '/permis'];
    const path = request.nextUrl.pathname;

    const isProtected = protectedPaths.some(p => path.startsWith(p));

    if (isProtected) {
        const sessionCookie = request.cookies.get('auth_session');
        const expectedSecret = process.env.SESSION_SECRET || 'valeur_secrete_a_changer_en_production';

        // Si le cookie est absent ou invalide, on redirige vers le login
        if (sessionCookie?.value !== expectedSecret) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Optimisation pour ne pas exécuter le middleware sur les images, CSS, etc.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};