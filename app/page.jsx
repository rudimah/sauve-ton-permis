import { query } from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';

export default async function HomePage() {
    const amendes = await query(`
        SELECT 
            id, 
            numero_avis, 
            statut, 
            COALESCE(updated_at, created_at) AS derniere_modif 
        FROM amendes 
        ORDER BY derniere_modif DESC
    `);

    const statutsLabels = {
        en_attente_prise_en_charge: 'Attente prise en charge',
        en_attente_contestation: 'Attente contestation',
        en_cours_contestation: 'En cours',
        contestation_validee: 'Validée',
        contestation_refusee: 'Refusée'
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* EN-TÊTE AVEC APPEL À L'ACTION FLUIDE */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Espace Public
                    </span>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                        Suivi de vos contestations
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-lg">
                        Suivez l'avancement de votre dossier en temps réel ou soumettez un nouvel avis en quelques clics.
                    </p>
                </div>
                
                {/* BOUTON D'ACTION PRINCIPAL TRÈS VISIBLE */}
                <Link 
                    href="/depot" 
                    className="shrink-0 inline-flex items-center gap-2.5 px-6 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                    <PlusCircle size={20} className="text-blue-600" />
                    Déposer une amende
                </Link>
            </div>

            {/* SECTION DU TABLEAU DE SUIVI */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Derniers dossiers enregistrés
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {amendes.length} dossier(s)
                    </span>
                </div>

                <div className="space-y-3 lg:space-y-0 lg:bg-white lg:dark:bg-slate-900 lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:rounded-2xl lg:shadow-sm">
                    
                    {/* En-tête Desktop */}
                    <div className="hidden lg:grid grid-cols-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold p-5 rounded-t-2xl">
                        <div>Numéro de l'avis</div>
                        <div>Dernière mise à jour</div>
                        <div className="text-right">Statut du dossier</div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {amendes.map((amende) => {
                            const dateModif = new Date(amende.derniere_modif);
                            const dateStr = dateModif.toLocaleDateString('fr-FR');
                            const timeStr = dateModif.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                            const statutClass = 
                                amende.statut.includes('validee') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                amende.statut.includes('refusee') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';

                            return (
                                <div key={amende.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 lg:border-none lg:rounded-none lg:grid lg:grid-cols-3 lg:items-center lg:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors shadow-sm lg:shadow-none">
                                    
                                    <div className="flex justify-between items-center lg:block mb-2 lg:mb-0">
                                        <span className="text-xs text-slate-400 font-bold lg:hidden">Avis :</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white text-base lg:text-sm">
                                            {amende.numero_avis ? `N° ${amende.numero_avis}` : <span className="text-slate-400 italic">En attente</span>}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center lg:block mb-3 lg:mb-0 text-slate-600 dark:text-slate-400 text-sm">
                                        <span className="text-xs text-slate-400 font-bold lg:hidden">Mise à jour :</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{dateStr}</span>
                                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{timeStr}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center lg:justify-end lg:block border-t border-slate-100 dark:border-slate-800/80 lg:border-none pt-3 lg:pt-0">
                                        <span className="text-xs text-slate-400 font-bold lg:hidden">Statut :</span>
                                        <span className={`inline-flex px-3 py-1.5 rounded-full font-bold text-xs capitalize ${statutClass}`}>
                                            {statutsLabels[amende.statut] || amende.statut.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

        </div>
    );
}