import 'package:dio/dio.dart';
import 'package:formation_flutter/model/rappel.dart';

class RappelsAPI {
  static const String _baseUrl = 'http://127.0.0.1:8090/api/collections/rappels/records';

  static Future<List<Rappel>> fetchRappels() async {
    final response = await Dio().get(_baseUrl);
    final List rappelsJson = response.data['items'];
    return rappelsJson.map((json) => Rappel.fromJson(json)).toList();
  }
}
