import 'package:flutter/material.dart';

class RappelBanner extends StatelessWidget {
  const RappelBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0x5CFF0000), // #FF0000 avec 36% d'opacité
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Ce produit fait l’objet d’un rappel produit',
              style: const TextStyle(
                color: Color(0xFFA60000), // #A60000
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
          const Icon(Icons.arrow_forward, color: Color(0xFFA60000)),
        ],
      ),
    );
  }
}
