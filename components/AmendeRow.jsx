'use client';
import { useState } from 'react';
import { mettreAJourAmende, supprimerAmende } from '@/app/gestion/actions';
import { Check, Trash2, Pencil, UserCircle2, Loader2 } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default function AmendeRow({ amende, listePermis, statutsLabels }) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const dateAvisFormatted = amende.date_avis
     ? new Date(amende.date_avis).toISOString().split('T')[0]
     : '';
     
  const dateAffichage = amende.date_avis ? new Date(amende.date_avis).toLocaleDateString('fr-FR') : '';

  // 1. Déclaration de la variable avant son utilisation
  const permisAssocie = listePermis.find(p => p.id == amende.permis_id);

  // Fonction d'autosave (Se déclenche au blur ou au change)
  async function handleAutoSave(e) {
    if (e) e.preventDefault();
    
    const form = document.getElementById(`form-${amende.id}`);
    if (!form) return;

    setIsPending(true);
    setSuccess(false);

    const formData = new FormData(form);
    await mettreAJourAmende(formData);

    setIsPending(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <tr className="block lg:table-row bg-white dark:bg-slate-900 rounded-2xl shadow-sm lg:shadow-none border border-slate-200 dark:border-slate-800 lg:border-none relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      
      {/* COLONNE 1 : INFOS DE BASE */}
      <td className="block lg:table-cell p-4 lg:p-5 border-b lg:border-none border-slate-100 dark:border-slate-800/80 align-top lg:w-1/4">
        
        <div className="lg:hidden text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Informations Avis</div>
        
        <details className="group/editamende">
          <summary className="cursor-pointer list-none relative pr-6">
            
            <div className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex flex-wrap items-center gap-2">
              {amende.numero_avis ? (
                <>
                  Avis n°{amende.numero_avis}
                  <CopyButton text={amende.numero_avis} />
                </>
              ) : (
                'Nouvelle amende'
              )}
            </div>
            
            <div className="text-sm text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2 mb-2">
              {amende.nom_famille}
              <CopyButton text={amende.nom_famille} />
            </div>
            
            {amende.email && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded w-fit">
                  {amende.email}
                </span>
                <CopyButton text={amende.email} />
              </div>
            )}
            
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
              Date : {dateAffichage}
              <CopyButton text={dateAffichage} />
            </div>

            <div className="absolute top-0 right-0 p-1.5 opacity-50 hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Pencil size={16} className="group-open/editamende:hidden" />
            </div>
          </summary>
          
          <div className="mt-4 space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-inner">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">N° Avis</label>
              <input form={`form-${amende.id}`} type="text" name="numero_avis" defaultValue={amende.numero_avis} onBlur={handleAutoSave} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nom demandeur</label>
              <input form={`form-${amende.id}`} type="text" name="nom_famille" defaultValue={amende.nom_famille} onBlur={handleAutoSave} required className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
              <input form={`form-${amende.id}`} type="email" name="email" defaultValue={amende.email} onBlur={handleAutoSave} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Date d'avis</label>
              <input form={`form-${amende.id}`} type="date" name="date_avis" defaultValue={dateAvisFormatted} onBlur={handleAutoSave} required className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>
        </details>
      </td>
      
      {/* COLONNE 2 : STATUT ET PERMIS */}
      <td className="block lg:table-cell p-4 lg:p-5 border-b lg:border-none border-slate-100 dark:border-slate-800/80 align-top lg:min-w-[340px]">
        <div className="lg:hidden text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Statut & Affectation</div>
        
        <form id={`form-${amende.id}`} className="space-y-3" onSubmit={handleAutoSave}>
          <input type="hidden" name="id" value={amende.id} />
          
          <select name="statut" defaultValue={amende.statut} onChange={handleAutoSave} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 lg:p-2.5 text-sm w-full dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer transition-all">
            {Object.entries(statutsLabels).map(([val, label]) => (
              <option key={val} value={val} className="dark:bg-slate-800">{label}</option>
            ))}
          </select>
          
          <div className="space-y-2">
            <select name="permis_id" defaultValue={amende.permis_id || ''} onChange={handleAutoSave} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 lg:p-2.5 text-sm w-full dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer transition-all">
              <option value="" className="dark:bg-slate-800">-- Associer un permis --</option>
              {listePermis.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-slate-800">
                  {p.nom} {p.prenom} ({p.numero_permis})
                </option>
              ))}
            </select>

            {permisAssocie && (
                <details className="mt-3 text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl group/permis overflow-hidden">
                    <summary className="p-3 font-bold cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors list-none flex items-center gap-2">
                        <UserCircle2 size={16} />
                        Voir & copier les infos du permis
                    </summary>
                    
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-3 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Prénom</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.prenom}</span> <CopyButton text={permisAssocie.prenom} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Nom</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.nom}</span> <CopyButton text={permisAssocie.nom} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Date Naissance</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.dob || '-'}</span> <CopyButton text={permisAssocie.dob} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Lieu Naissance</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.lieu_naissance || '-'}</span> <CopyButton text={permisAssocie.lieu_naissance} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">N° de voie</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.rue || '-'}</span> <CopyButton text={permisAssocie.rue} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2 sm:col-span-2 lg:col-span-1 xl:col-span-2"><span className="font-bold text-slate-500">Voie, CP, Ville</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]" title={permisAssocie.ville}>{permisAssocie.ville || '-'}</span> <CopyButton text={permisAssocie.ville} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2 sm:col-span-2 lg:col-span-1 xl:col-span-2"><span className="font-bold text-slate-500">Email</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-[200px]" title={permisAssocie.email}>{permisAssocie.email || '-'}</span> <CopyButton text={permisAssocie.email} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Délivrance (DD)</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.dd || '-'}</span> <CopyButton text={permisAssocie.dd} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">Lieu Délivrance</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.lieu_delivrance || '-'}</span> <CopyButton text={permisAssocie.lieu_delivrance} /></div></div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2"><span className="font-bold text-slate-500">N° Permis</span> <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{permisAssocie.numero_permis}</span> <CopyButton text={permisAssocie.numero_permis} /></div></div>
                    </div>
                </details>
            )}
          </div>
        </form>
      </td>
      
      {/* COLONNE 3 : PAIEMENT ET POINTS */}
      <td className="block lg:table-cell p-4 lg:p-5 border-b lg:border-none border-slate-100 dark:border-slate-800/80 align-top lg:min-w-[200px]">
        <div className="lg:hidden text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Paiement & Sanctions</div>
        
        <div className="space-y-4">
          <div className="flex flex-row items-center gap-2">
            <select form={`form-${amende.id}`} name="statut_paiement" defaultValue={amende.statut_paiement} onChange={handleAutoSave} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 lg:p-2 text-sm flex-1 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer transition-all">
              <option value="impaye" className="dark:bg-slate-800">Impayé</option>
              <option value="en_cours" className="dark:bg-slate-800">En cours</option>
              <option value="paye" className="dark:bg-slate-800">Payé</option>
            </select>
            <div className="relative w-28 lg:w-24 shrink-0">
                <input form={`form-${amende.id}`} type="number" name="montant_paye" step="0.01" defaultValue={amende.montant_paye} onBlur={handleAutoSave} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 lg:p-2 text-sm w-full pr-6 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all" placeholder="0.00" />
                <span className="absolute right-3 top-3 lg:top-2 text-xs text-slate-500 font-bold">€</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 p-2.5 lg:p-2 rounded-lg border border-red-100 dark:border-red-900/30">
            <span className="text-xs font-bold text-red-700 dark:text-red-400 whitespace-nowrap flex-1">Points retirés :</span>
            <input form={`form-${amende.id}`} type="number" name="points_retires" min="0" max="12" defaultValue={amende.points_retires || 0} onBlur={handleAutoSave} className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800/50 rounded-lg p-2 text-sm w-20 dark:text-slate-200 text-red-600 dark:text-red-400 font-extrabold text-center outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all" />
          </div>
        </div>
      </td>
      
      {/* COLONNE 4 : ACTIONS ET INDICATEURS */}
      <td className="block lg:table-cell p-4 lg:p-5 align-top bg-slate-50/50 dark:bg-slate-800/20 lg:bg-transparent rounded-b-2xl lg:rounded-none">
        <div className="flex lg:flex-col items-center justify-between lg:items-end gap-3 w-full min-h-[40px]">
          
          <div className="flex-1 lg:flex-none order-2 lg:order-none flex justify-start lg:justify-end">
            {isPending && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-2 lg:py-1.5 rounded-full shadow-sm animate-pulse w-fit">
                <Loader2 className="animate-spin" size={16} /> Sauvegarde...
              </div>
            )}

            {success && !isPending && (
              <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 lg:py-1.5 rounded-full shadow-sm animate-in fade-in slide-in-from-right-2 w-fit">
                <Check size={16} /> Sauvegardé
              </div>
            )}
          </div>

          <div className="order-1 lg:order-none shrink-0 lg:mt-auto">
            <form action={supprimerAmende}>
              <input type="hidden" name="id" value={amende.id} />
              <button 
                type="submit" 
                className="p-3 lg:p-2 text-red-500 hover:text-red-700 bg-white hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/40 border border-slate-200 hover:border-red-200 dark:border-slate-700 dark:hover:border-red-800/50 rounded-xl lg:rounded-lg transition-colors shadow-sm flex items-center justify-center"
                title="Supprimer l'amende"
                onClick={(e) => {
                  if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette amende définitivement ?")) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 size={18} />
              </button>
            </form>
          </div>
          
        </div>
      </td>
    </tr>
  );
}