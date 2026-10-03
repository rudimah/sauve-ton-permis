'use client';

export default function DeletePermisForm({ action, id }) {
  return (
    <form 
      action={action} 
      onSubmit={(e) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce permis et dissocier toutes ses amendes ?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg text-sm font-semibold transition">
        Supprimer ce permis
      </button>
    </form>
  );
}