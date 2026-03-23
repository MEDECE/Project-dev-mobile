import 'package:flutter/material.dart';
import 'package:formation_flutter/model/product.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/res/app_theme_extension.dart';
import 'package:formation_flutter/screens/product/product_fetcher.dart';
import 'package:provider/provider.dart';

class ProductTab1 extends StatelessWidget {
  const ProductTab1({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<ProductFetcher>().state;
    if (state case ProductFetcherSuccess(:final product)) {
      return _buildContent(product);
    }
    return const SizedBox.shrink();
  }

  Widget _buildContent(Product product) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Section Ingrédients
          _SectionHeader(title: 'Ingrédients'),
          if (product.ingredients != null && product.ingredients!.isNotEmpty)
            ...product.ingredients!.map((item) {
              final idx = item.indexOf(': ');
              if (idx != -1) {
                return _IngredientRow(
                  name: _capitalize(item.substring(0, idx)),
                  detail: item.substring(idx + 2),
                );
              }
              return _IngredientRow(name: _capitalize(item));
            })
          else
            const _EmptyRow(text: 'Aucun'),

          // Section Substances allergènes
          _SectionHeader(title: 'Substances allergènes'),
          if (product.allergens != null && product.allergens!.isNotEmpty)
            ...product.allergens!.map(
              (tag) => _IngredientRow(name: _cleanTag(tag)),
            )
          else
            const _EmptyRow(text: 'Aucune'),

          // Section Additifs
          _SectionHeader(title: 'Additifs'),
          if (product.additives != null && product.additives!.isNotEmpty)
            ...product.additives!.entries.map(
              (entry) => _IngredientRow(
                name: _cleanTag(entry.key).toUpperCase(),
                detail: entry.value.isNotEmpty ? entry.value : null,
              ),
            )
          else
            const _EmptyRow(text: 'Aucun'),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  String _cleanTag(String tag) {
    return tag.replaceFirst(RegExp(r'^[a-z]{2}:'), '');
  }

  String _capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.grey1,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      child: Text(
        title,
        textAlign: TextAlign.center,
        style: context.theme.title3,
      ),
    );
  }
}

class _IngredientRow extends StatelessWidget {
  const _IngredientRow({required this.name, this.detail});

  final String name;
  final String? detail;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.grey1, width: 1)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              name,
              style: const TextStyle(
                fontFamily: 'Avenir',
                fontSize: 14,
                color: Colors.black87,
              ),
            ),
          ),
          if (detail != null)
            Expanded(
              flex: 3,
              child: Text(
                detail!,
                textAlign: TextAlign.right,
                style: const TextStyle(
                  fontFamily: 'Avenir',
                  fontSize: 14,
                  color: AppColors.grey2,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _EmptyRow extends StatelessWidget {
  const _EmptyRow({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Text(
        text,
        style: const TextStyle(
          fontFamily: 'Avenir',
          fontSize: 15,
          fontWeight: FontWeight.w500,
          color: AppColors.blue,
        ),
      ),
    );
  }
}
