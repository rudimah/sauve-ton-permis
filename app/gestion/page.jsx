import { query } from '@/lib/db';
import AmendeRow from '@/components/AmendeRow';

export default async function GestionPage() {
    const amendes = await query(`
        SELECT 
            a.*,
            p.numero_permis,
            p.nom AS permis_nom,
            p.prenom AS permis_prenom
        FROM amendes a
        LEFT JOIN permis p ON a.permis_id = p.id
        ORDER BY a.created_at DESC
    `);
    
    const listePermis = await query(`SELECT * FROM permis ORDER BY nom ASC`);

    const statutsLabels = {
        en_attente_prise_en_charge: 'Attente prise en charge',
        en_attente_contestation: 'Attente contestation',
        en_cours_contestation: 'En cours',
        contestation_validee: 'Validée',
        contestation_refusee: 'Refusée'
    };

    return (
        <div className="max-w-full">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-8 dark:text-white tracking-tight">Gestion des amendes</h1>
            
            <div className="bg-transparent lg:bg-white lg:dark:bg-slate-900 lg:border lg:border-slate-200 lg:dark:border-slate-800 rounded-2xl lg:shadow-sm">
                <table className="w-full text-left text-sm block lg:table">
                    <thead className="hidden lg:table-header-group bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        <tr>
                            <th className="p-5 font-semibold">Demandeur & Avis</th>
                            <th className="p-5 font-semibold">Statut & Permis</th>
                            <th className="p-5 font-semibold">Paiement & Points</th>
                            <th className="p-5 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="block lg:table-row-group space-y-4 lg:space-y-0 lg:divide-y lg:divide-slate-200 lg:dark:divide-slate-800">
                        {amendes.map((amende) => (
                            <AmendeRow
                                key={amende.id}
                                amende={amende}
                                listePermis={listePermis}
                                statutsLabels={statutsLabels}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}