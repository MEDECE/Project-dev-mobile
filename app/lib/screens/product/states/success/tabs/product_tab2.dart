import 'package:flutter/material.dart';
import 'package:formation_flutter/model/product.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/screens/product/product_fetcher.dart';
import 'package:provider/provider.dart';

class ProductTab2 extends StatelessWidget {
  const ProductTab2({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<ProductFetcher>().state;
    if (state case ProductFetcherSuccess(:final product)) {
      return _buildContent(product);
    }
    return const SizedBox.shrink();
  }

  Widget _buildContent(Product product) {
    final facts = product.nutritionFacts;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            child: Text(
              'Repères nutritionnels pour 100g',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Avenir',
                fontSize: 17,
                fontWeight: FontWeight.w400,
                color: AppColors.grey3,
              ),
            ),
          ),
          _NutrientRow(
            label: 'Matières grasses / lipides',
            value: facts?.fat?.per100g,
            unit: facts?.fat?.unit ?? 'g',
            level: _fatLevel(_toDouble(facts?.fat?.per100g)),
          ),
          _NutrientRow(
            label: 'Acides gras saturés',
            value: facts?.saturatedFat?.per100g,
            unit: facts?.saturatedFat?.unit ?? 'g',
            level: _saturatedFatLevel(_toDouble(facts?.saturatedFat?.per100g)),
          ),
          _NutrientRow(
            label: 'Sucres',
            value: facts?.sugar?.per100g,
            unit: facts?.sugar?.unit ?? 'g',
            level: _sugarLevel(_toDouble(facts?.sugar?.per100g)),
          ),
          _NutrientRow(
            label: 'Sel',
            value: facts?.salt?.per100g,
            unit: facts?.salt?.unit ?? 'g',
            level: _saltLevel(_toDouble(facts?.salt?.per100g)),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }

  _NutrientLevel _fatLevel(double? v) {
    if (v == null) return _NutrientLevel.low;
    if (v < 3) return _NutrientLevel.low;
    if (v <= 20) return _NutrientLevel.moderate;
    return _NutrientLevel.high;
  }

  _NutrientLevel _saturatedFatLevel(double? v) {
    if (v == null) return _NutrientLevel.low;
    if (v < 1.5) return _NutrientLevel.low;
    if (v <= 5) return _NutrientLevel.moderate;
    return _NutrientLevel.high;
  }

  _NutrientLevel _sugarLevel(double? v) {
    if (v == null) return _NutrientLevel.low;
    if (v < 5) return _NutrientLevel.low;
    if (v <= 12.5) return _NutrientLevel.moderate;
    return _NutrientLevel.high;
  }

  _NutrientLevel _saltLevel(double? v) {
    if (v == null) return _NutrientLevel.low;
    if (v < 0.3) return _NutrientLevel.low;
    if (v <= 1.5) return _NutrientLevel.moderate;
    return _NutrientLevel.high;
  }
}

enum _NutrientLevel { low, moderate, high }

class _NutrientRow extends StatelessWidget {
  const _NutrientRow({
    required this.label,
    required this.value,
    required this.unit,
    required this.level,
  });

  final String label;
  final dynamic value;
  final String unit;
  final _NutrientLevel level;

  @override
  Widget build(BuildContext context) {
    final color = switch (level) {
      _NutrientLevel.low => AppColors.nutrientLevelLow,
      _NutrientLevel.moderate => AppColors.nutrientLevelModerate,
      _NutrientLevel.high => AppColors.nutrientLevelHigh,
    };
    final levelLabel = switch (level) {
      _NutrientLevel.low => 'Faible quantité',
      _NutrientLevel.moderate => 'Quantité modérée',
      _NutrientLevel.high => 'Quantité élevée',
    };

    String displayValue = '—';
    if (value != null) {
      final d = value is num
          ? value.toDouble()
          : double.tryParse(value.toString());
      if (d != null) {
        String formatted = d.toStringAsFixed(2)
            .replaceAll(RegExp(r'0+$'), '')
            .replaceAll(RegExp(r'\.$'), '')
            .replaceAll('.', ',');
        displayValue = '$formatted$unit';
      }
    }

    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.grey1, width: 1)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontFamily: 'Avenir',
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: AppColors.blue,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                displayValue,
                style: TextStyle(
                  fontFamily: 'Avenir',
                  fontWeight: FontWeight.w500,
                  fontSize: 15,
                  color: color,
                ),
              ),
              Text(
                levelLabel,
                style: TextStyle(
                  fontFamily: 'Avenir',
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: color,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
