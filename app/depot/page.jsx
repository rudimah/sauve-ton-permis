import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default function DepotPage({ searchParams }) {
    async function soumettreAmende(formData) {
        'use server';
        const numeroAvis = formData.get('numero_avis');
        const email = formData.get('email');
        const nomFamille = formData.get('nom_famille');
        const dateAvis = formData.get('date_avis');

        await query(
            `INSERT INTO amendes (numero_avis, email, nom_famille, date_avis, statut)
             VALUES (?, ?, ?, ?, 'en_attente_prise_en_charge')`,
            [numeroAvis, email, nomFamille, dateAvis]
        );
        revalidatePath('/amendes');
        redirect('/depot?succes=true');
    }

    const estSucces = searchParams?.succes === 'true';

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 md:p-10 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none mt-4 md:mt-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold mb-3 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                    Demander une contestation
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Renseignez les données de l'avis. Notre équipe vous contactera pour obtenir les éléments du permis.
                </p>
            </div>

            {estSucces && (
                <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <p className="font-medium">Votre demande a bien été enregistrée. Nous vous contactons très rapidement.</p>
                </div>
            )}

            <form action={soumettreAmende} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nom de famille</label>
                        <input type="text" name="nom_famille" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="ex: Dupont" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Numéro de l'avis</label>
                        <input type="text" name="numero_avis" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="ex: 3777123456" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Adresse Email</label>
                    <input type="email" name="email" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="votre@email.com" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Date de l'avis</label>
                    <input type="date" name="date_avis" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 mt-4">
                    Envoyer la demande
                </button>
            </form>
        </div>
    );
}