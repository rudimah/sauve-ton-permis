import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    const { code } = await request.json();
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const storedAuth = global.authCodes?.[chatId];

    if (storedAuth && storedAuth.code === code && storedAuth.expires > Date.now()) {
        delete global.authCodes[chatId];
        
        const sessionSecret = process.env.SESSION_SECRET || 'valeur_secrete_a_changer_en_production';

        cookies().set('auth_session', sessionSecret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}