import 'package:pocketbase/pocketbase.dart';
import 'package:formation_flutter/config/app_config.dart';

class PocketBaseService {
  PocketBaseService._();
  static final PocketBaseService instance = PocketBaseService._();

  late final PocketBase client = PocketBase(AppConfig.pocketBaseUrl);
}
