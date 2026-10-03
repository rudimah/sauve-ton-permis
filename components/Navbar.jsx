'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X, LogOut, ShieldCheck, Settings, PlusCircle } from 'lucide-react';

export default function Navbar({ isAuthenticated }) {
    const [isOpen, setIsOpen] = useState(false);

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    }

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                
                <Link href="/" className="font-extrabold text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight hover:opacity-80 transition z-50">
                    SAUVE TON PERMIS
                </Link>

                <div className="flex items-center gap-4 md:hidden z-50">
                    <ThemeToggle />
                    <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2 focus:outline-none">
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                <nav className={`fixed md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto bg-white dark:bg-slate-900 md:bg-transparent md:dark:bg-transparent flex flex-col md:flex-row items-center justify-center md:justify-end gap-8 md:gap-6 text-lg md:text-sm font-bold md:font-medium transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Suivi des Amendes
                    </Link>
                    
                    {/* Bouton de dépôt mis en valeur dans la navbar */}
                    <Link href="/depot" onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl transition-all shadow-md hover:shadow-cyan-500/20 flex items-center gap-2">
                        <PlusCircle size={18} /> Déposer une amende
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                            
                            <Link href="/gestion" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                <Settings size={18} /> Gestion
                            </Link>

                            <Link href="/permis" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                <ShieldCheck size={18} /> Permis
                            </Link>

                            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1.5 transition-colors font-bold">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm font-semibold ml-2">
                            Admin
                        </Link>
                    )}

                    <div className="hidden md:flex pl-4 border-l border-slate-200 dark:border-slate-700 items-center">
                        <ThemeToggle />
                    </div>
                </nav>
            </div>
        </header>
    );
}