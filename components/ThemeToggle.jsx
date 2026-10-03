'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle('dark');
    setIsDark(root.classList.contains('dark'));
  };

  return (
    <button
       onClick={toggleTheme}
       className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition"
       title="Changer le thème"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}