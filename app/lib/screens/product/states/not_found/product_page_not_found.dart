import 'package:flutter/material.dart';
import 'package:formation_flutter/res/app_colors.dart';

class ProductPageNotFound extends StatelessWidget {
  const ProductPageNotFound({super.key, required this.barcode});

  final String barcode;

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
                Icons.search_off_rounded,
                size: 72,
                color: AppColors.grey2,
              ),
              const SizedBox(height: 24),
              const Text(
                'Produit introuvable',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Avenir',
                  fontWeight: FontWeight.w800,
                  fontSize: 22,
                  color: AppColors.blue,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Aucun produit trouvé pour le code-barres\n$barcode',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Avenir',
                  fontSize: 15,
                  color: AppColors.grey2,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 36),
              ElevatedButton.icon(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.arrow_back),
                label: const Text(
                  'Retour',
                  style: TextStyle(fontFamily: 'Avenir', fontWeight: FontWeight.w700),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
