import { NextResponse } from 'next/server';

global.authCodes = global.authCodes || {};

export async function POST() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return NextResponse.json({ success: false, error: "Configuration manquante" }, { status: 500 });
    }

    const existingAuth = global.authCodes[chatId];
    const now = Date.now();

    // S'il existe déjà un code valide généré il y a moins de 60 secondes, on ne renvoie PAS de double message
    if (existingAuth && existingAuth.expires - now > 240000) {
        return NextResponse.json({ success: true, message: "Code déjà actif" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    global.authCodes[chatId] = { code, expires: now + 300000 }; // Expire dans 5 min

    const text = `🔐 *SAUVE TON PERMIS*\n\nVotre code de connexion unique est : \`${code}\`\n\n_Ce code expire dans 5 minutes._`;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
        });

        const data = await response.json();
        
        if (data.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: data });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}