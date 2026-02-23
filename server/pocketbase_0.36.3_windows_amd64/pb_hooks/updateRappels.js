const fetch = require('node-fetch');

module.exports = async function () {
  // 1. Appel à l’API des rappels (exemple avec rappel.conso.gouv.fr)
  const response = await fetch('https://rappel.conso.gouv.fr/api/rappels');
  const rappels = await response.json();

  // 2. Met à jour la collection PocketBase
  for (const rappel of rappels) {
    try {
      // Recherche si le rappel existe déjà (par gtin)
      const existing = await pb.collection('rappels').getFirstListItem(`gtin="${rappel.gtin}"`);
      if (existing) {
        await pb.collection('rappels').update(existing.id, rappel);
      } else {
        await pb.collection('rappels').create(rappel);
      }
    } catch (e) {
      // Si aucun existant trouvé, on crée
      if (e && e.status == 404) {
        await pb.collection('rappels').create(rappel);
      } else {
        console.error('Erreur lors de l’update/insert du rappel:', e);
      }
    }
  }
};