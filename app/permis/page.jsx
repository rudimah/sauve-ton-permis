import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import CopyButton from '@/components/CopyButton';
import DeletePermisForm from '@/components/DeletePermisForm';

export default async function PermisPage() {
    const permis = await query(`
        SELECT 
            p.*,
            COUNT(a.id) AS nb_amendes,
            COALESCE(SUM(a.points_retires), 0) AS total_points_retires_amendes,
            COALESCE(SUM(a.montant_paye), 0) AS total_montant,
            MAX(a.date_avis) AS date_derniere_utilisation,
            COALESCE(
                JSON_ARRAYAGG(
                    CASE WHEN a.id IS NOT NULL THEN
                        JSON_OBJECT(
                            'id', a.id,
                            'numero_avis', a.numero_avis,
                            'demandeur', a.nom_famille,
                            'email_demandeur', a.email,
                            'date_avis', a.date_avis,
                            'montant', a.montant_paye,
                            'points', a.points_retires,
                            'statut', a.statut
                        )
                    ELSE NULL END
                ), JSON_ARRAY()
            ) AS historique_amendes
        FROM permis p
        LEFT JOIN amendes a ON a.permis_id = p.id
        GROUP BY p.id
        ORDER BY p.date_creation DESC
    `);

    async function ajouterPermis(formData) {
        'use server';
        const numero = formData.get('numero_permis');
        const nom = formData.get('nom');
        const prenom = formData.get('prenom');
        const dob = formData.get('dob');
        const lieuNaissance = formData.get('lieu_naissance');
        const dd = formData.get('dd');
        const de = formData.get('de');
        const lieuDelivrance = formData.get('lieu_delivrance');
        const email = formData.get('email');
        const numeroVoie = formData.get('numero_voie');
        const adresseComplete = formData.get('adresse_complete');
        const points = formData.get('points_retires') || 0;

        await query(
            `INSERT INTO permis (numero_permis, nom, prenom, dob, lieu_naissance, dd, de, lieu_delivrance, email, numero_voie, adresse_complete, points_retires)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [numero, nom, prenom, dob, lieuNaissance, dd, de, lieuDelivrance, email, numeroVoie, adresseComplete, points]
        );
        revalidatePath('/permis');
    }

    async function modifierPermis(formData) {
        'use server';
        const id = formData.get('id');
        const numero = formData.get('numero_permis');
        const nom = formData.get('nom');
        const prenom = formData.get('prenom');
        const dob = formData.get('dob');
        const lieuNaissance = formData.get('lieu_naissance');
        const dd = formData.get('dd');
        const de = formData.get('de');
        const lieuDelivrance = formData.get('lieu_delivrance');
        const email = formData.get('email');
        const numeroVoie = formData.get('numero_voie');
        const adresseComplete = formData.get('adresse_complete');
        const points = formData.get('points_retires') || 0;

        await query(
            `UPDATE permis
             SET numero_permis=?, nom=?, prenom=?, dob=?, lieu_naissance=?, dd=?, de=?, lieu_delivrance=?, email=?, numero_voie=?, adresse_complete=?, points_retires=?
             WHERE id=?`,
            [numero, nom, prenom, dob, lieuNaissance, dd, de, lieuDelivrance, email, numeroVoie, adresseComplete, points, id]
        );
        revalidatePath('/permis');
        revalidatePath('/amendes');
    }

    async function supprimerPermis(formData) {
        'use server';
        const id = formData.get('id');
        await query(`DELETE FROM permis WHERE id = ?`, [id]);
        revalidatePath('/permis');
        revalidatePath('/amendes');
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <h1 className="text-2xl md:text-3xl font-extrabold dark:text-white tracking-tight">Gestion des Permis</h1>

            {/* FORMULAIRE D'AJOUT */}
            <details className="group">
                <summary className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer list-none inline-flex items-center gap-2 mb-2">
                    <span className="group-open:hidden flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Ajouter un permis
                    </span>
                    <span className="hidden group-open:flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Fermer le formulaire
                    </span>
                </summary>
                
                <div className="mt-4 bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none animate-in slide-in-from-top-2 fade-in duration-300">
                    <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Nouveau permis</h2>
                    <form action={ajouterPermis}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Numéro de permis *</label><input type="text" name="numero_permis" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Nom *</label><input type="text" name="nom" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Prénom *</label><input type="text" name="prenom" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Date de naissance</label><input type="text" name="dob" placeholder="JJ/MM/AAAA" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Lieu de naissance</label><input type="text" name="lieu_naissance" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Date délivrance (DD)</label><input type="text" name="dd" placeholder="JJ/MM/AAAA" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Numéro de voie</label><input type="text" name="numero_voie" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="md:col-span-2 space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Voie, Code Postal, Ville</label><input type="text" name="adresse_complete" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="ex: 95 Av Jean Lolive, 93500 Pantin" /></div>
                            
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Lieu de délivrance</label><input type="text" name="lieu_delivrance" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5 md:col-span-2 lg:col-span-1"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Email</label><input type="email" name="email" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Date expiration (DE)</label><input type="text" name="de" placeholder="JJ/MM/AAAA" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                            <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Points retirés (Base)</label><input type="number" name="points_retires" defaultValue="0" min="0" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" /></div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md">
                                Enregistrer le permis
                            </button>
                        </div>
                    </form>
                </div>
            </details>

            {/* LISTE DES PERMIS (CARTES) AVEC LE BON ORDRE DE COPIE */}
            <div>
                <h2 className="text-xl font-bold mb-6 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Permis enregistrés</h2>
                <div className="space-y-6">
                    {permis.map((p) => {
                        const historique = Array.isArray(p.historique_amendes) ? p.historique_amendes.filter(Boolean) : [];
                        const pointsRetiresTotal = Number(p.points_retires) + Number(p.total_points_retires_amendes);

                        return (
                            <details key={p.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                
                                <summary className="p-5 md:p-6 flex flex-col md:flex-row justify-between md:items-center cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                                            {p.nom ? p.nom.charAt(0) : ''}{p.prenom ? p.prenom.charAt(0) : ''}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                                                {p.prenom} {p.nom}
                                            </h3>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                                                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{p.numero_permis}</span>
                                                <span>•</span>
                                                <span>Dernière amende : <span className="font-medium text-slate-700 dark:text-slate-300">{p.date_derniere_utilisation ? new Date(p.date_derniere_utilisation).toLocaleDateString('fr-FR') : 'Aucune'}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center md:flex-col md:items-end gap-2 md:gap-1.5 border-t border-slate-100 dark:border-slate-800 md:border-none pt-3 md:pt-0">
                                        <span className={`inline-flex px-3 py-1.5 rounded-full font-bold shadow-sm text-xs ${pointsRetiresTotal >= 8 ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' : 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400'}`}>
                                            {pointsRetiresTotal} point(s) retiré(s)
                                        </span>
                                        <span className="text-xs text-slate-400 group-open:hidden ml-auto md:ml-0 flex items-center gap-1">Voir détails <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                                    </div>
                                </summary>

                                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                    {/* ORDRE DE COPIE EXACT DEMANDÉ */}
                                    <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Prénom</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.prenom}</span> <CopyButton text={p.prenom} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Nom</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.nom}</span> <CopyButton text={p.nom} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Date Naissance</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.dob || '-'}</span> <CopyButton text={p.dob} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Lieu Naissance</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.lieu_naissance || '-'}</span> <CopyButton text={p.lieu_naissance} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">N° de voie</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.numero_voie || '-'}</span> <CopyButton text={p.numero_voie} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2 md:col-span-2 lg:col-span-1"><span className="font-bold text-slate-500">Voie, CP, Ville</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]" title={p.adresse_complete}>{p.adresse_complete || '-'}</span> <CopyButton text={p.adresse_complete} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2 md:col-span-2 lg:col-span-1"><span className="font-bold text-slate-500">Email</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]" title={p.email}>{p.email || '-'}</span> <CopyButton text={p.email} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Délivrance (DD)</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.dd || '-'}</span> <CopyButton text={p.dd} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Lieu Délivrance</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.lieu_delivrance || '-'}</span> <CopyButton text={p.lieu_delivrance} /></div></div>
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">N° Permis</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{p.numero_permis}</span> <CopyButton text={p.numero_permis} /></div></div>
                                    </div>

                                    {/* FORMULAIRE DE MODIFICATION */}
                                    <details className="group/edit border-t border-slate-200 dark:border-slate-700">
                                        <summary className="p-4 text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer select-none hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors list-none flex items-center justify-center gap-2">
                                            <span className="group-open/edit:hidden flex items-center gap-2">Modifier ce permis</span>
                                            <span className="hidden group-open/edit:flex items-center gap-2">Annuler la modification</span>
                                        </summary>
                                        
                                        <div className="p-5 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                                            <form id={`edit-form-${p.id}`} action={modifierPermis}>
                                                <input type="hidden" name="id" value={p.id} />
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">N° permis</label><input type="text" name="numero_permis" defaultValue={p.numero_permis} required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Nom</label><input type="text" name="nom" defaultValue={p.nom} required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Prénom</label><input type="text" name="prenom" defaultValue={p.prenom} required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Date naissance</label><input type="text" name="dob" defaultValue={p.dob || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Lieu naissance</label><input type="text" name="lieu_naissance" defaultValue={p.lieu_naissance || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Délivrance (DD)</label><input type="text" name="dd" defaultValue={p.dd || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Numéro de voie</label><input type="text" name="numero_voie" defaultValue={p.numero_voie || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5 md:col-span-2 lg:col-span-1"><label className="block text-xs font-bold text-slate-500">Voie, Code Postal, Ville</label><input type="text" name="adresse_complete" defaultValue={p.adresse_complete || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Lieu délivrance</label><input type="text" name="lieu_delivrance" defaultValue={p.lieu_delivrance || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Email</label><input type="email" name="email" defaultValue={p.email || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Expiration (DE)</label><input type="text" name="de" defaultValue={p.de || ''} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                    <div className="space-y-1.5"><label className="block text-xs font-bold text-slate-500">Points (Base)</label><input type="number" name="points_retires" defaultValue={p.points_retires} min="0" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                                </div>
                                                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                    <DeletePermisForm action={supprimerPermis} id={p.id} />
                                                    <button form={`edit-form-${p.id}`} type="submit" className="w-full md:w-auto bg-slate-800 dark:bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 dark:hover:bg-blue-700 shadow-md transition-colors">
                                                        Enregistrer les modifications
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </details>

                                    {/* HISTORIQUE DES AMENDES */}
                                    {historique.length > 0 ? (
                                        <div className="border-t border-slate-200 dark:border-slate-700 p-5 md:p-6">
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Historique des amendes</h4>
                                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                                <table className="w-full text-xs text-left min-w-[600px]">
                                                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                                        <tr>
                                                            <th className="p-3 font-bold uppercase tracking-wider">N° Avis</th>
                                                            <th className="p-3 font-bold uppercase tracking-wider">Demandeur</th>
                                                            <th className="p-3 font-bold uppercase tracking-wider">Date</th>
                                                            <th className="p-3 font-bold uppercase tracking-wider">Montant</th>
                                                            <th className="p-3 font-bold uppercase tracking-wider">Points</th>
                                                            <th className="p-3 font-bold uppercase tracking-wider">Statut</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900/50">
                                                        {historique.map((amende) => (
                                                            <tr key={amende.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                                <td className="p-3 text-slate-900 dark:text-slate-200 font-bold">{amende.numero_avis || '-'}</td>
                                                                <td className="p-3 text-slate-900 dark:text-slate-200">
                                                                    <div className="font-bold">{amende.demandeur}</div>
                                                                    {amende.email_demandeur && <div className="text-[10px] text-slate-500 font-medium">{amende.email_demandeur}</div>}
                                                                </td>
                                                                <td className="p-3 text-slate-700 dark:text-slate-300">{amende.date_avis ? new Date(amende.date_avis).toLocaleDateString('fr-FR') : '-'}</td>
                                                                <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{amende.montant || '0'} €</td>
                                                                <td className="p-3 text-red-600 dark:text-red-400 font-bold">{amende.points > 0 ? `-${amende.points}` : '0'}</td>
                                                                <td className="p-3">
                                                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded font-bold capitalize text-[10px] whitespace-nowrap">
                                                                        {amende.statut.replace(/_/g, ' ')}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 italic text-center bg-white dark:bg-slate-900">
                                            Aucune amende n'est rattachée à ce permis pour le moment.
                                        </div>
                                    )}
                                </div>
                            </details>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}