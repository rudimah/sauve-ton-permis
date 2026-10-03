'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  // Ne rien afficher s'il n'y a pas de texte à copier
  if (!text || text === '-') return null;

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche le clic d'ouvrir l'accordéon <summary>
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors p-1.5 rounded-md inline-flex items-center justify-center cursor-pointer bg-transparent hover:bg-blue-50 dark:hover:bg-slate-800"
      title="Copier"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}