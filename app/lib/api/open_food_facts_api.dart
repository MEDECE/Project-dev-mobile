import 'package:dio/dio.dart';
import 'package:formation_flutter/model/product.dart';

class ProductNotFoundException implements Exception {
  const ProductNotFoundException(this.barcode);
  final String barcode;
  @override
  String toString() => 'Produit introuvable : $barcode';
}

class OpenFoodFactsAPI {
  static const String _baseUrl = 'https://api.formation-flutter.fr/v2';

  // Singleton
  static final OpenFoodFactsAPI _instance = OpenFoodFactsAPI._internal();

  factory OpenFoodFactsAPI() => _instance;

  final Dio _dio;

  OpenFoodFactsAPI._internal() : _dio = Dio(BaseOptions(baseUrl: _baseUrl));

  Future<Product> getProduct(String barcode) async {
    try {
      final response = await _dio.get(
        '/getProduct',
        queryParameters: {'barcode': barcode},
      );
      final dynamic productData = response.data['response'];
      if (productData == null) {
        throw ProductNotFoundException(barcode);
      }
      return Product.fromJson(productData as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw ProductNotFoundException(barcode);
      }
      rethrow;
    }
  }
}
