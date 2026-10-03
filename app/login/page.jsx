'use client';
import { useState, useEffect, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function LoginPage() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    // Utilisation d'une référence pour empêcher le double déclenchement
    const hasSentCode = useRef(false);

    useEffect(() => {
        if (!hasSentCode.current) {
            hasSentCode.current = true;
            fetch('/api/auth/send-code', { method: 'POST' });
        }
    }, []);

    async function handleVerifierCode(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });

        const data = await res.json();
        
        if (data.success) {
            window.location.href = '/gestion';
        } else {
            setMessage('Code incorrect ou expiré.');
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl mt-16 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
            </div>
            
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">SAUVE TON PERMIS</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Veuillez entrer le code de sécurité
            </p>

            {message && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-bold border border-red-200 dark:border-red-800/50">
                    {message}
                </div>
            )}

            <form onSubmit={handleVerifierCode} className="space-y-4">
                <input
                    type="text"
                    maxLength="6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code d'accès"
                    className="w-full text-center tracking-widest text-2xl font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-slate-500/20 transition-all"
                    required
                />
                <button
                    type="submit"
                    disabled={loading || code.length < 5}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Vérification...' : 'Valider'}
                </button>
            </form>
        </div>
    );
}