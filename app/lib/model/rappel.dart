class Rappel {
  final String gtin;
  final String? libelle;

  Rappel({required this.gtin, this.libelle});

  factory Rappel.fromJson(Map<String, dynamic> json) {
    return Rappel(
      gtin: json['gtin'].toString(),
      libelle: json['libelle'],
    );
  }
}
