import 'package:flutter/material.dart';
import 'package:formation_flutter/l10n/app_localizations.dart';
import 'package:formation_flutter/model/product.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class ProductTab3 extends StatelessWidget {
  const ProductTab3({super.key});

  @override
  Widget build(BuildContext context) {
    final Product product = context.read<Product>();
    if (product.nutritionFacts == null) {
      return const SizedBox.shrink();
    }

    return DefaultTextStyle.merge(
      style: TextStyle(color: AppColors.blue),
      child: Table(
        columnWidths: const <int, TableColumnWidth>{
          0: FlexColumnWidth(3),
          1: FlexColumnWidth(2),
          2: FlexColumnWidth(2),
        },
        children: _body(context, product.nutritionFacts!),
      ),
    );
  }

  List<TableRow> _body(BuildContext context, NutritionFacts nutritionFacts) {
    final AppLocalizations localizations = AppLocalizations.of(context)!;
    final NumberFormat numberFormat = NumberFormat.decimalPatternDigits(
      locale: Localizations.localeOf(context).countryCode,
      decimalDigits: 1,
    );

    final List<TableRow?> rows = <TableRow?>[];

    rows.add(
      TableRow(
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.grey2, width: 0.5)),
        ),
        children: <Widget>[
          TableCell(child: SizedBox.shrink()),
          _NutritionFactsValue(
            text: localizations.product_nutrition_facts_per_100g,
          ),
          _NutritionFactsValue(
            text: localizations.product_nutrition_facts_per_serving,
          ),
        ],
      ),
    );

    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_energy,
        nutritionFacts.energy,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_fat,
        nutritionFacts.fat,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_saturated_fats,
        nutritionFacts.saturatedFat,
        indent: true,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_carbohydrates,
        nutritionFacts.carbohydrate,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_sugars,
        nutritionFacts.sugar,
        indent: true,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_fiber,
        nutritionFacts.fiber,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_proteins,
        nutritionFacts.proteins,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_salt,
        nutritionFacts.salt,
      ),
    );
    rows.add(
      _generateCell(
        numberFormat,
        localizations.product_nutrition_facts_sodium,
        nutritionFacts.sodium,
      ),
    );

    return rows.nonNulls.toList(growable: false);
  }

  TableRow? _generateCell(
    NumberFormat numberFormat,
    String label,
    Nutriment? nutriment, {
    bool indent = false,
  }) {
    if (nutriment == null) {
      return null;
    }

    String formatField(dynamic field, String unit, {String fallback = '-'}) {
      if (field == null || field.toString() == 'null') return fallback;
      if (field is num) return '${numberFormat.format(field)} $unit';
      final parsed = double.tryParse(field.toString());
      if (parsed != null) return '${numberFormat.format(parsed)} $unit';
      return '$field $unit';
    }

    return TableRow(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.grey2, width: 0.5)),
      ),
      children: <Widget>[
        _NutritionFactsTitle(text: label, indent: indent),
        _NutritionFactsValue(
          text: formatField(nutriment.per100g, nutriment.unit),
        ),
        _NutritionFactsValue(
          text: formatField(nutriment.perServing, nutriment.unit, fallback: '?'),
        ),
      ],
    );
  }
}

class _NutritionFactsValue extends StatelessWidget {
  const _NutritionFactsValue({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(
        horizontal: 4.0,
        vertical: 6.0,
      ),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: const TextStyle(color: AppColors.blue),
      ),
    );
  }
}

class _NutritionFactsTitle extends StatelessWidget {
  const _NutritionFactsTitle({required this.text, this.indent = false});

  final String text;
  final bool indent;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.only(
        start: indent ? 16.0 : 4.0,
        end: 4.0,
        top: 6.0,
        bottom: 6.0,
      ),
      child: Text(
        text,
        style: TextStyle(
          fontWeight: indent ? FontWeight.w400 : FontWeight.w600,
          color: AppColors.blue,
        ),
      ),
    );
  }
}

extension ProductNutrimentsExtension on Product {}
