class RecallDetail {
  final String id;
  final String barcode;
  final String reference;
  final String productName;
  final String brand;
  final String? dateDebut;
  final String? dateFin;
  final String motif;
  final String risques;
  final String? link;
  final String? imageUrl;
  final String distributeurs;
  final String zoneGeographique;

  RecallDetail({
    required this.id,
    required this.barcode,
    required this.reference,
    required this.productName,
    required this.brand,
    this.dateDebut,
    this.dateFin,
    required this.motif,
    required this.risques,
    this.link,
    this.imageUrl,
    required this.distributeurs,
    required this.zoneGeographique,
  });

  factory RecallDetail.fromRecord(dynamic record) {
    final data = record.data as Map<String, dynamic>;
    return RecallDetail(
      id: record.id as String,
      barcode: data['barcode'] as String? ?? '',
      reference: data['reference'] as String? ?? '',
      productName: data['product_name'] as String? ?? '',
      brand: data['brand'] as String? ?? '',
      dateDebut: data['date_debut'] as String?,
      dateFin: data['date_fin'] as String?,
      motif: data['motif'] as String? ?? '',
      risques: data['risques'] as String? ?? '',
      link: data['link'] as String?,
      imageUrl: data['image_url'] as String?,
      distributeurs: data['distributeurs'] as String? ?? '',
      zoneGeographique: data['zone_geographique'] as String? ?? '',
    );
  }
}
