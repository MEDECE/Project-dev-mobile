// Hook PocketBase — Synchronisation des rappels produits (Rappels Conso V2)
// API PocketBase v0.36 : $app.findCollectionByNameOrId / $app.findFirstRecordByData / $app.save

onBootstrap(function (e) {
  e.next();

  const today = new Date().toISOString().split("T")[0];
  const url =
    "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records" +
    "?limit=100&order_by=date_publication+DESC" +
    "&where=date_de_fin_de_la_procedure_de_rappel%3E%3D%22" + today + "%22";

  let res;
  try {
    res = $http.send({ url: url, method: "GET", timeout: 30 });
  } catch (err) {
    console.error("[recalls_sync] Erreur HTTP :", String(err));
    return;
  }

  if (res.statusCode !== 200) {
    console.error("[recalls_sync] API retourne :", res.statusCode);
    return;
  }

  const results = res.json.results || [];
  let saved = 0;
  let errors = 0;
  const collection = $app.findCollectionByNameOrId("recalls");

  for (const item of results) {
    const barcode = (item.gtin || "").toString().trim();
    if (!barcode) continue;
    const reference = (item.numero_fiche || "").toString().trim();

    let record;
    try {
      record = $app.findFirstRecordByData("recalls", "reference", reference);
    } catch (_) {
      record = new Record(collection);
    }

    record.set("barcode", barcode);
    record.set("reference", reference);
    record.set("product_name", item.modeles_ou_references || "");
    record.set("brand", item.marque_produit || "");
    record.set("motif", item.motif_rappel || "");
    record.set("risques", item.risques_encourus || "");
    record.set("link", item.lien_vers_la_fiche_rappel || "");
    record.set("distributeurs", item.distributeur_noms || "");
    record.set("zone_geographique", item.zone_geographique_de_vente || "");
    const imgs = item.liens_vers_les_images;
    record.set("image_url", Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : "");
    if (item.date_debut_commercialisation) record.set("date_debut", item.date_debut_commercialisation);
    if (item.date_date_fin_commercialisation) record.set("date_fin", item.date_date_fin_commercialisation);

    try {
      $app.save(record);
      saved++;
    } catch (err) {
      console.error("[recalls_sync] Échec :", reference, String(err));
      errors++;
    }
  }

  console.log("[recalls_sync] Terminé :", results.length, "récupérés,", saved, "sauvegardés,", errors, "erreurs");
});

cronAdd("recalls_sync_hourly", "0 * * * *", function () {
  const today = new Date().toISOString().split("T")[0];
  const url =
    "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records" +
    "?limit=100&order_by=date_publication+DESC" +
    "&where=date_de_fin_de_la_procedure_de_rappel%3E%3D%22" + today + "%22";

  let res;
  try {
    res = $http.send({ url: url, method: "GET", timeout: 30 });
  } catch (err) {
    console.error("[recalls_sync] Erreur HTTP :", String(err));
    return;
  }

  if (res.statusCode !== 200) {
    console.error("[recalls_sync] API retourne :", res.statusCode);
    return;
  }

  const results = res.json.results || [];
  let saved = 0;
  let errors = 0;
  const collection = $app.findCollectionByNameOrId("recalls");

  for (const item of results) {
    const barcode = (item.gtin || "").toString().trim();
    if (!barcode) continue;
    const reference = (item.numero_fiche || "").toString().trim();

    let record;
    try {
      record = $app.findFirstRecordByData("recalls", "reference", reference);
    } catch (_) {
      record = new Record(collection);
    }

    record.set("barcode", barcode);
    record.set("reference", reference);
    record.set("product_name", item.modeles_ou_references || "");
    record.set("brand", item.marque_produit || "");
    record.set("motif", item.motif_rappel || "");
    record.set("risques", item.risques_encourus || "");
    record.set("link", item.lien_vers_la_fiche_rappel || "");
    record.set("distributeurs", item.distributeur_noms || "");
    record.set("zone_geographique", item.zone_geographique_de_vente || "");
    const imgs2 = item.liens_vers_les_images;
    record.set("image_url", Array.isArray(imgs2) && imgs2.length > 0 ? imgs2[0] : "");
    if (item.date_debut_commercialisation) record.set("date_debut", item.date_debut_commercialisation);
    if (item.date_date_fin_commercialisation) record.set("date_fin", item.date_date_fin_commercialisation);

    try {
      $app.save(record);
      saved++;
    } catch (err) {
      console.error("[recalls_sync] Échec :", reference, String(err));
      errors++;
    }
  }

  console.log("[recalls_sync] Terminé :", results.length, "récupérés,", saved, "sauvegardés,", errors, "erreurs");
});
