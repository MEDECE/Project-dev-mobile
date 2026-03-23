import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:formation_flutter/fetchers/favorites_fetcher.dart';
import 'package:formation_flutter/screens/product/product_fetcher.dart';
import 'package:formation_flutter/screens/product/states/empty/product_page_empty.dart';
import 'package:formation_flutter/screens/product/states/error/product_page_error.dart';
import 'package:formation_flutter/screens/product/states/not_found/product_page_not_found.dart';
import 'package:formation_flutter/screens/product/states/success/product_page_body.dart';
import 'package:provider/provider.dart';

class ProductPage extends StatefulWidget {
  const ProductPage({super.key, required this.barcode})
    : assert(barcode.length > 0);

  final String barcode;

  @override
  State<ProductPage> createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  late final FavoritesFetcher _favoritesFetcher;

  @override
  void initState() {
    super.initState();
    _favoritesFetcher = FavoritesFetcher()..load();
  }

  @override
  void dispose() {
    _favoritesFetcher.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final MaterialLocalizations materialLocalizations =
        MaterialLocalizations.of(context);

    return ChangeNotifierProvider<FavoritesFetcher>.value(
      value: _favoritesFetcher,
      child: ChangeNotifierProvider<ProductFetcher>(
        create: (_) => ProductFetcher(barcode: widget.barcode),
        child: Scaffold(
          backgroundColor: Colors.white,
          body: Stack(
            children: [
              Consumer<ProductFetcher>(
                builder: (BuildContext context, ProductFetcher notifier, _) {
                  return switch (notifier.state) {
                    ProductFetcherLoading() => const ProductPageEmpty(),
                    ProductFetcherNotFound(:final barcode) =>
                      ProductPageNotFound(barcode: barcode),
                    ProductFetcherError(error: var err) => ProductPageError(
                      error: err,
                    ),
                    ProductFetcherSuccess() => ProductPageBody(),
                  };
                },
              ),
              PositionedDirectional(
                top: 0.0,
                start: 0.0,
                child: _HeaderIcon(
                  icon: Icons.arrow_back,
                  tooltip: materialLocalizations.backButtonTooltip,
                  onPressed: Navigator.of(context).pop,
                ),
              ),
              PositionedDirectional(
                top: 0.0,
                end: 0.0,
                child: Consumer<FavoritesFetcher>(
                  builder: (context, favFetcher, _) {
                    final productState =
                        context.watch<ProductFetcher>().state;
                    if (productState
                        case ProductFetcherSuccess(:final product)) {
                      final isFav =
                          favFetcher.isFavorite(product.barcode);
                      return SafeArea(
                        child: Padding(
                          padding: const EdgeInsetsDirectional.all(8.0),
                          child: Material(
                            type: MaterialType.transparency,
                            child: Ink(
                              padding:
                                  const EdgeInsetsDirectional.all(12.0),
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                              ),
                              child: DecoratedBox(
                                decoration: const BoxDecoration(
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black26,
                                      blurRadius: 10.0,
                                      offset: Offset(0.0, 0.0),
                                    ),
                                  ],
                                ),
                                child: InkWell(
                                  onTap: () =>
                                      favFetcher.toggle(product.barcode),
                                  customBorder: const CircleBorder(),
                                  child: SvgPicture.asset(
                                    isFav
                                        ? 'res/svg/ic_star.svg'
                                        : 'res/svg/ic_star_border.svg',
                                    width: 24,
                                    height: 24,
                                    colorFilter: const ColorFilter.mode(
                                      Colors.white,
                                      BlendMode.srcIn,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HeaderIcon extends StatelessWidget {
  const _HeaderIcon({required this.icon, required this.tooltip, this.onPressed})
    : assert(tooltip.length > 0);

  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsetsDirectional.all(8.0),
        child: Material(
          type: MaterialType.transparency,
          child: Tooltip(
            message: tooltip,
            child: InkWell(
              onTap: onPressed ?? () {},
              customBorder: const CircleBorder(),
              child: Ink(
                padding: const EdgeInsetsDirectional.all(12.0),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.0),
                ),
                child: DecoratedBox(
                  decoration: const BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10.0,
                        offset: Offset(0.0, 0.0),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
