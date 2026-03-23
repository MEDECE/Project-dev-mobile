import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:formation_flutter/l10n/app_localizations.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/res/app_vectorial_images.dart';

class HomePageEmpty extends StatelessWidget {
  const HomePageEmpty({super.key, this.onScan});

  final VoidCallback? onScan;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations localizations = AppLocalizations.of(context)!;

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          SvgPicture.asset(AppVectorialImages.illEmpty),
          const SizedBox(height: 62.87),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 100),
            child: Text(
              localizations.my_scans_screen_description,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppColors.blue,
                fontFamily: 'Avenir',
                fontSize: 17,
                fontWeight: FontWeight.w400,
                letterSpacing: -0.41,
              ),
            ),
          ),
          const SizedBox(height: 41),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 89),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.yellow,
                foregroundColor: AppColors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(22),
                ),
                elevation: 0,
                padding: const EdgeInsets.only(left: 26, right: 28),
              ),
              onPressed: onScan,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text(
                    localizations.my_scans_screen_button.toUpperCase(),
                    style: const TextStyle(
                      fontFamily: 'Avenir',
                      fontWeight: FontWeight.w800,
                      fontSize: 15,
                    ),
                  ),
                  const Icon(Icons.arrow_forward, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
