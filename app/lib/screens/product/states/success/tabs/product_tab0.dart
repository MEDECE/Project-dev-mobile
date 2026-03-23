import 'package:flutter/material.dart';
import 'package:formation_flutter/fetchers/recall_fetcher.dart';
import 'package:formation_flutter/l10n/app_localizations.dart';
import 'package:formation_flutter/model/product.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/res/app_icons.dart';
import 'package:formation_flutter/res/app_theme_extension.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class ProductTab0 extends StatelessWidget {
  const ProductTab0({super.key});

  static const double _kHorizontalPadding = 20.0;

  @override
  Widget build(BuildContext context) {
    final Product product = context.read<Product>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        _RecallBanner(barcode: product.barcode),
        const _Scores(),
        const Padding(
          padding: EdgeInsetsDirectional.symmetric(
            horizontal: _kHorizontalPadding,
            vertical: 30.0,
          ),
          child: _Info(),
        ),
      ],
    );
  }
}

class _RecallBanner extends StatefulWidget {
  final String barcode;
  const _RecallBanner({required this.barcode});

  @override
  State<_RecallBanner> createState() => _RecallBannerState();
}

class _RecallBannerState extends State<_RecallBanner> {
  late final RecallFetcher _fetcher;

  @override
  void initState() {
    super.initState();
    _fetcher = RecallFetcher()..checkRecall(widget.barcode);
  }

  @override
  void dispose() {
    _fetcher.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _fetcher,
      builder: (context, _) {
        if (_fetcher.state case RecallFetcherHasRecall()) {
          return GestureDetector(
            onTap: () => context.push(
              '/recall/${widget.barcode}',
              extra: context.read<Product>().picture,
            ),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.nutrientLevelHigh.withValues(alpha: 0.36),
                borderRadius: BorderRadius.circular(10),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 19, vertical: 13),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'Ce produit fait l\'objet d\'un rappel produit',
                      style: const TextStyle(
                        color: AppColors.recallBannerText,
                        fontFamily: 'Avenir',
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const Icon(
                    Icons.arrow_forward,
                    color: AppColors.recallBannerText,
                  ),
                ],
              ),
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}

class _Scores extends StatelessWidget {
  const _Scores();

  static const double _horizontalPadding = ProductTab0._kHorizontalPadding;
  static const double _verticalPadding = 18.0;

  @override
  Widget build(BuildContext context) {
    final Product product = context.read<Product>();

    return DefaultTextStyle(
      style: context.theme.altText,
      child: Container(
        color: AppColors.grey1,
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                vertical: _verticalPadding,
                horizontal: _horizontalPadding,
              ),
              child: IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Expanded(
                      flex: 44,
                      child: Padding(
                        padding: const EdgeInsetsDirectional.only(end: 5.0),
                        child: _Nutriscore(
                          nutriscore:
                              product.nutriScore ?? ProductNutriScore.unknown,
                        ),
                      ),
                    ),
                    const VerticalDivider(),
                    Expanded(
                      flex: 66,
                      child: Padding(
                        padding: const EdgeInsetsDirectional.only(start: 25.0),
                        child: _NovaGroup(
                          novaScore:
                              product.novaScore ?? ProductNovaScore.unknown,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const Divider(),
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                vertical: _verticalPadding,
                horizontal: _horizontalPadding,
              ),
              child: _ecoscore(
                ecoscore: product.ecoscore ?? Productecoscore.unknown,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Nutriscore extends StatelessWidget {
  const _Nutriscore({required this.nutriscore});

  final ProductNutriScore nutriscore;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          AppLocalizations.of(context)!.nutriscore,
          style: context.theme.title3,
        ),
        const SizedBox(height: 5.0),
        Image.asset(_findAssetName(), height: 42.0),
      ],
    );
  }

  String _findAssetName() {
    return switch (nutriscore) {
      ProductNutriScore.A => 'res/drawables/nutriscore_a.png',
      ProductNutriScore.B => 'res/drawables/nutriscore_b.png',
      ProductNutriScore.C => 'res/drawables/nutriscore_c.png',
      ProductNutriScore.D => 'res/drawables/nutriscore_d.png',
      ProductNutriScore.E => 'res/drawables/nutriscore_e.png',
      ProductNutriScore.unknown => 'TODO',
    };
  }
}

class _NovaGroup extends StatelessWidget {
  const _NovaGroup({required this.novaScore});

  final ProductNovaScore novaScore;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          AppLocalizations.of(context)!.nova_group,
          style: context.theme.title3,
        ),
        const SizedBox(height: 5.0),
        Text(_findLabel(), style: const TextStyle(color: AppColors.grey2)),
      ],
    );
  }

  String _findLabel() {
    return switch (novaScore) {
      ProductNovaScore.group1 =>
        'Aliments non transformés ou transformés minimalement',
      ProductNovaScore.group2 => 'Ingrédients culinaires transformés',
      ProductNovaScore.group3 => 'Aliments transformés',
      ProductNovaScore.group4 =>
        'Produits alimentaires et boissons ultra-transformés',
      ProductNovaScore.unknown => 'Score non calculé',
    };
  }
}

class _ecoscore extends StatelessWidget {
  const _ecoscore({required this.ecoscore});

  final Productecoscore ecoscore;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          AppLocalizations.of(context)!.greenscore,
          style: context.theme.title3,
        ),
        const SizedBox(height: 5.0),
        Row(
          children: <Widget>[
            Icon(_findIcon(), color: _findIconColor()),
            const SizedBox(width: 10.0),
            Expanded(
              child: Text(
                _findLabel(),
                style: const TextStyle(color: AppColors.grey2),
              ),
            ),
          ],
        ),
      ],
    );
  }

  IconData _findIcon() {
    return switch (ecoscore) {
      Productecoscore.APlus => AppIcons.ecoscore_a_plus,
      Productecoscore.A => AppIcons.ecoscore_a,
      Productecoscore.B => AppIcons.ecoscore_b,
      Productecoscore.C => AppIcons.ecoscore_c,
      Productecoscore.D => AppIcons.ecoscore_d,
      Productecoscore.E => AppIcons.ecoscore_e,
      Productecoscore.F => AppIcons.ecoscore_f,
      Productecoscore.unknown => AppIcons.ecoscore_e,
    };
  }

  Color _findIconColor() {
    return switch (ecoscore) {
      Productecoscore.APlus => AppColors.ecoscoreAPlus,
      Productecoscore.A => AppColors.ecoscoreA,
      Productecoscore.B => AppColors.ecoscoreB,
      Productecoscore.C => AppColors.ecoscoreC,
      Productecoscore.D => AppColors.ecoscoreD,
      Productecoscore.E => AppColors.ecoscoreE,
      Productecoscore.F => AppColors.ecoscoreF,
      Productecoscore.unknown => Colors.transparent,
    };
  }

  String _findLabel() {
    return switch (ecoscore) {
      Productecoscore.APlus => 'Très faible impact environnemental',
      Productecoscore.A => 'Très faible impact environnemental',
      Productecoscore.B => 'Faible impact environnemental',
      Productecoscore.C => "Impact modéré sur l'environnement",
      Productecoscore.D => 'Impact environnemental élevé',
      Productecoscore.E => 'Impact environnemental très élevé',
      Productecoscore.F => 'Impact environnemental très élevé',
      Productecoscore.unknown => 'Score non calculé',
    };
  }
}

class _Info extends StatelessWidget {
  const _Info();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations localizations = AppLocalizations.of(context)!;
    final Product product = context.read<Product>();

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        _ProductItemValue(
          label: localizations.product_quantity,
          value: product.quantity ?? '-',
        ),
        _ProductItemValue(
          label: localizations.product_countries,
          value: product.manufacturingCountries?.join(', ') ?? '-',
          includeDivider: false,
        ),
        const SizedBox(height: 15.0),
        Row(
          children: <Widget>[
            Expanded(
              flex: 40,
              child: _ProductBubble(
                label: localizations.product_vegan,
                value: product.isVegan == ProductAnalysis.yes
                    ? _ProductBubbleValue.on
                    : _ProductBubbleValue.off,
              ),
            ),
            Spacer(flex: 10),
            Expanded(
              flex: 40,
              child: _ProductBubble(
                label: localizations.product_vegetarian,
                value: product.isVegetarian == ProductAnalysis.yes
                    ? _ProductBubbleValue.on
                    : _ProductBubbleValue.off,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _ProductItemValue extends StatelessWidget {
  const _ProductItemValue({
    required this.label,
    required this.value,
    this.includeDivider = true,
  });

  final String label;
  final String value;
  final bool includeDivider;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Padding(
          padding: const EdgeInsetsDirectional.symmetric(vertical: 12.0),
          child: Row(
            children: <Widget>[
              Expanded(child: Text(label)),
              Expanded(child: Text(value, textAlign: TextAlign.end)),
            ],
          ),
        ),
        if (includeDivider) const Divider(height: 1.0),
      ],
    );
  }
}

class _ProductBubble extends StatelessWidget {
  const _ProductBubble({required this.label, required this.value});

  final String label;
  final _ProductBubbleValue value;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.blueLight,
        borderRadius: BorderRadius.circular(10.0),
      ),
      padding: const EdgeInsetsDirectional.symmetric(
        vertical: 10.0,
        horizontal: 15.0,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(
            value == _ProductBubbleValue.on
                ? AppIcons.close
                : AppIcons.checkmark,
            color: AppColors.white,
          ),
          const SizedBox(width: 10.0),
          Expanded(
            child: Text(label, style: const TextStyle(color: AppColors.white)),
          ),
        ],
      ),
    );
  }
}

enum _ProductBubbleValue { on, off }
