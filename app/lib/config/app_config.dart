import 'package:flutter/foundation.dart';

class AppConfig {
  // Détection automatique selon la plateforme
  static String get pocketBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:8090'; // Flutter Web (Chrome)
    }
    return 'http://192.168.1.104:8090'; // Appareil réel Samsung S10
    // return 'http://10.0.2.2:8090'; // Émulateur Android
    // Pour simulateur iOS       : 'http://127.0.0.1:8090'
  }
}
