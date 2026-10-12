import { NextResponse } from 'next/server';

global.authCodes = global.authCodes || {};

export async function POST(request) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return NextResponse.json({ success: false, error: "Configuration manquante" }, { status: 500 });
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = realIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || request.ip || '::1';
    
    const userAgent = request.headers.get('user-agent') || 'Appareil Inconnu';

    let location = "Localisation inconnue";
    
    if (ip === '::1' || ip === '127.0.0.1') {
        location = "Local (Votre ordinateur)";
    } else {
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
            const geoData = await geoRes.json();
            
            if (geoData.status === 'success') {
                location = `${geoData.city}, ${geoData.country}`;
            }
        } catch (error) {
            console.error("Erreur de géolocalisation:", error);
        }
    }

    const existingAuth = global.authCodes[chatId];
    const now = Date.now();

    if (existingAuth && existingAuth.expires - now > 240000) {
        return NextResponse.json({ success: true, message: "Code déjà actif" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    global.authCodes[chatId] = { code, expires: now + 300000 };

    const text = `🚨 *SAUVE TON PERMIS*\n\nVotre code de connexion unique est : \`${code}\`\n\n📱 *Appareil* : ${userAgent}\n🌐 *IP* : ${ip}\n📍 *Lieu* : ${location}\n\n_Ce code expire dans 5 minutes._`;

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