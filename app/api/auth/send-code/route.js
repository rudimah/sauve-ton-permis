import { NextResponse } from 'next/server';

// Stockage temporaire en mémoire du code (en production, utilisez un cache ou la base de données)
global.authCodes = global.authCodes || {};

export async function POST() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Générer un code aléatoire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Le code expire dans 5 minutes
    global.authCodes[chatId] = { code, expires: Date.now() + 300000 };

    const text = `🔐 *Votre code de connexion unique est : \`${code}\`\n\n_Ce code expire dans 5 minutes._`;

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
        return NextResponse.json({ success: false, error: error.message });
    }
}