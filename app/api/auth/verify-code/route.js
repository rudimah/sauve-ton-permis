import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    const { code } = await request.json();
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const storedAuth = global.authCodes?.[chatId];

    if (storedAuth && storedAuth.code === code && storedAuth.expires > Date.now()) {
        // Code valide ! On supprime le code utilisé
        delete global.authCodes[chatId];

        // Création du cookie de session (valable 7 jours)
        cookies().set('auth_session', 'authenticated_secure_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}