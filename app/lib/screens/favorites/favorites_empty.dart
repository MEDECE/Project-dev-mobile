import 'package:flutter/material.dart';
import 'package:formation_flutter/res/app_colors.dart';

class FavoritesEmpty extends StatelessWidget {
  const FavoritesEmpty({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.star_border, size: 80, color: AppColors.grey2),
          const SizedBox(height: 16),
          const Text(
            'Aucun favori pour le moment',
            style: TextStyle(
              fontFamily: 'Avenir',
              fontSize: 16,
              color: AppColors.grey2,
            ),
          ),
        ],
      ),
    );
  }
}
