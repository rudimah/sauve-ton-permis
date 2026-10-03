'use server';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function mettreAJourAmende(formData) {
    const id = formData.get('id');
    const statut = formData.get('statut');
    const permisId = formData.get('permis_id') || null;
    const statutPaiement = formData.get('statut_paiement');
    const montantPaye = formData.get('montant_paye') || 0;
    const pointsRetires = formData.get('points_retires') || 0;

    // Données modifiables de l'avis
    const numeroAvis = formData.get('numero_avis');
    const nomFamille = formData.get('nom_famille');
    const email = formData.get('email');
    const dateAvis = formData.get('date_avis');

    await query(
        `UPDATE amendes
         SET statut = ?, permis_id = ?, statut_paiement = ?, montant_paye = ?, points_retires = ?,
             numero_avis = ?, nom_famille = ?, email = ?, date_avis = ?
         WHERE id = ?`,
        [statut, permisId ? Number(permisId) : null, statutPaiement, montantPaye, pointsRetires,
         numeroAvis, nomFamille, email, dateAvis, id]
    );

    // Mise à jour de toutes les pages concernées en temps réel
    revalidatePath('/');
    revalidatePath('/gestion');
    revalidatePath('/permis');

    return { success: true };
}

export async function supprimerAmende(formData) {
    const id = formData.get('id');
    await query(`DELETE FROM amendes WHERE id = ?`, [id]);
    
    revalidatePath('/');
    revalidatePath('/gestion');
    revalidatePath('/permis');
}