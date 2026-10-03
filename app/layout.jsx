import './globals.css';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'SAUVE TON PERMIS',
    description: 'Plateforme de suivi et de contestation des amendes et permis',
    icons: {
        icon: '/favicon.png',
    },
};

export default function RootLayout({ children }) {
    const isAuthenticated = cookies().has('auth_session');

    return (
        <html lang="fr" className="antialiased">
            <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 flex flex-col">
                
                <Navbar isAuthenticated={isAuthenticated} />
                
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 w-full animate-in fade-in duration-500">
                    {children}
                </main>
                
            </body>
        </html>
    );
}