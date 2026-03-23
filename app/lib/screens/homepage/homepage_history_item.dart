import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:formation_flutter/api/open_food_facts_api.dart';
import 'package:formation_flutter/model/product.dart';
import 'package:formation_flutter/res/app_colors.dart';

class HomepageHistoryItem extends StatelessWidget {
  final String barcode;
  const HomepageHistoryItem({super.key, required this.barcode});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Product>(
      future: OpenFoodFactsAPI().getProduct(barcode),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return _buildSkeleton();
        }
        if (!snapshot.hasData || snapshot.hasError) {
          return _buildFallback(context);
        }
        return _buildCard(context, snapshot.data!);
      },
    );
  }

  Widget _buildCard(BuildContext context, Product product) {
    const double cardHeight = 108.0;
    const double imageTopOverflow = 23.0;
    const double imagePadLeft = 18.0;
    const double imagePadBottom = 18.0;
    // L'image part du top du container et s'arrête 18px avant le bas de la card
    const double imageSize = cardHeight + imageTopOverflow - imagePadBottom; // 113px
    const double outerHeight = cardHeight + imageTopOverflow; // 131px

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: SizedBox(
        height: outerHeight,
        child: Stack(
          children: [
            // Card blanche : démarre 23px sous le top du container
            Positioned(
              left: 0,
              right: 0,
              top: imageTopOverflow,
              bottom: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.14),
                      blurRadius: 20,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () => context.push('/product', extra: barcode),
                  ),
                ),
              ),
            ),
            // Image : top du container → 18px avant le bas de la card
            Positioned(
              left: imagePadLeft,
              top: 0,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: product.picture != null
                    ? Image.network(
                        product.picture!,
                        width: imageSize,
                        height: imageSize,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stack) => _placeholder(),
                      )
                    : _placeholder(),
              ),
            ),
            // Texte : dans la card (top card → bottom card−18)
            Positioned(
              left: imagePadLeft + imageSize + 16,
              right: 18,
              top: imageTopOverflow,
              bottom: imagePadBottom,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    product.name ?? barcode,
                    style: const TextStyle(
                      fontFamily: 'Avenir',
                      fontWeight: FontWeight.w800,
                      fontSize: 17,
                      height: 1.2,
                      color: AppColors.blue,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (product.brands != null && product.brands!.isNotEmpty)
                    Text(
                      product.brands!.first,
                      style: const TextStyle(
                        fontFamily: 'Avenir',
                        fontSize: 13,
                        height: 1.2,
                        fontWeight: FontWeight.w500,
                        color: AppColors.grey3,
                      ),
                    ),
                  if (product.nutriScore != null &&
                      product.nutriScore != ProductNutriScore.unknown)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Row(
                        children: [
                          Container(
                            width: 13,
                            height: 13,
                            decoration: BoxDecoration(
                              color: _nutriscoreColor(product.nutriScore!),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Nutriscore : ${product.nutriScore!.name.toUpperCase()}',
                            style: const TextStyle(
                              fontFamily: 'Avenir',
                              fontSize: 12,
                              height: 1.2,
                              fontWeight: FontWeight.w400,
                              color: AppColors.black,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _nutriscoreColor(ProductNutriScore score) {
    return switch (score) {
      ProductNutriScore.A => AppColors.nutriscoreA,
      ProductNutriScore.B => AppColors.nutriscoreB,
      ProductNutriScore.C => AppColors.nutriscoreC,
      ProductNutriScore.D => AppColors.nutriscoreD,
      ProductNutriScore.E => AppColors.nutriscoreE,
      _ => AppColors.grey2,
    };
  }

  Widget _placeholder() {
    return Container(
      width: 113,
      height: 113,
      decoration: BoxDecoration(
        color: AppColors.grey1,
        borderRadius: BorderRadius.circular(8),
      ),
      child: const Icon(Icons.image_not_supported, color: AppColors.grey2),
    );
  }

  Widget _buildSkeleton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 29),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 113,
              height: 113,
              decoration: BoxDecoration(
                color: AppColors.grey1,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(height: 17, width: 140, color: AppColors.grey1),
                  const SizedBox(height: 6),
                  Container(height: 13, width: 80, color: AppColors.grey1),
                  const SizedBox(height: 6),
                  Container(height: 12, width: 100, color: AppColors.grey1),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFallback(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 29),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.14),
              blurRadius: 20,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(8),
          onTap: () => context.push('/product', extra: barcode),
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Row(
              children: [
                _placeholder(),
                const SizedBox(width: 12),
                Text(
                  barcode,
                  style: const TextStyle(
                    fontFamily: 'Avenir',
                    fontSize: 14,
                    color: AppColors.grey2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
