import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl.pathname;

    // On protège les pages /permis et la nouvelle page /gestion
    if (url.startsWith('/permis') || url.startsWith('/gestion')) {
        const session = request.cookies.get('auth_session');
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/permis/:path*', '/gestion/:path*'],
};