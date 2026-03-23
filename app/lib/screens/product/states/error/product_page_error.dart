import 'package:flutter/material.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/screens/product/product_fetcher.dart';
import 'package:provider/provider.dart';

class ProductPageError extends StatelessWidget {
  const ProductPageError({super.key, this.error});

  final dynamic error;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.wifi_off_rounded,
                size: 72,
                color: AppColors.grey2,
              ),
              const SizedBox(height: 24),
              const Text(
                'Une erreur est survenue',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Avenir',
                  fontWeight: FontWeight.w800,
                  fontSize: 22,
                  color: AppColors.blue,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Impossible de charger le produit.\nVérifiez votre connexion et réessayez.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Avenir',
                  fontSize: 15,
                  color: AppColors.grey2,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 36),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton.icon(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text(
                      'Retour',
                      style: TextStyle(fontFamily: 'Avenir', fontWeight: FontWeight.w600),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.blue,
                      side: const BorderSide(color: AppColors.blue),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: () => context.read<ProductFetcher>().loadProduct(),
                    icon: const Icon(Icons.refresh),
                    label: const Text(
                      'Réessayer',
                      style: TextStyle(fontFamily: 'Avenir', fontWeight: FontWeight.w700),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
