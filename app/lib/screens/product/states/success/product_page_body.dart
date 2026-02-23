import 'package:flutter/material.dart';
import 'package:formation_flutter/l10n/app_localizations.dart';
import 'package:formation_flutter/model/product.dart';
import 'package:formation_flutter/res/app_icons.dart';
import 'package:formation_flutter/screens/product/product_fetcher.dart';
import 'package:formation_flutter/screens/product/states/success/product_header.dart';
import 'package:formation_flutter/api/rappels_api.dart';
import 'package:formation_flutter/screens/product/states/success/tabs/product_tab0.dart';
import 'package:formation_flutter/screens/product/states/success/tabs/product_tab1.dart';
import 'package:formation_flutter/screens/product/states/success/tabs/product_tab2.dart';
import 'package:formation_flutter/screens/product/states/success/tabs/product_tab3.dart';
import 'package:formation_flutter/screens/product/states/success/rappel_banner.dart';
import 'package:provider/provider.dart';

class ProductPageBody extends StatefulWidget {
  const ProductPageBody({super.key});

  @override
  State<ProductPageBody> createState() => _ProductPageBodyState();
}

class _ProductPageBodyState extends State<ProductPageBody> {
  late ProductDetailsCurrentTab _tab;
  List<String> _rappelsBarcodes = [];
  bool _isLoadingRappels = true;
  bool _isRappel = false;

  @override
  void initState() {
    super.initState();
    _tab = ProductDetailsCurrentTab.summary;
    _fetchRappels();
  }

  Future<void> _fetchRappels() async {
    try {
      final rappels = await RappelsAPI.fetchRappels();
      setState(() {
        _rappelsBarcodes = rappels.map((r) => r.gtin).toList();
        _isLoadingRappels = false;
        final product = (context.read<ProductFetcher>().state as ProductFetcherSuccess).product;
        _isRappel = _rappelsBarcodes.contains(product.barcode);
      });
    } catch (_) {
      setState(() {
        _isLoadingRappels = false;
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    final AppLocalizations localizations = AppLocalizations.of(context)!;

    return Provider<Product>(
      create: (_) =>
          (context.read<ProductFetcher>().state as ProductFetcherSuccess)
              .product,
      child: Column(
        children: [
          if (_isLoadingRappels)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(),
            ),
          if (!_isLoadingRappels && _isRappel)
            const RappelBanner(),
          Expanded(
            child: CustomScrollView(
              slivers: <Widget>[
                ProductPageHeader(),
                SliverPadding(
                  padding: EdgeInsetsDirectional.only(top: 10.0),
                  sliver: SliverFillRemaining(
                    fillOverscroll: true,
                    hasScrollBody: false,
                    child: _getBody(),
                  ),
                ),
              ],
            ),
          ),
          BottomNavigationBar(
            currentIndex: _tab.index,
            onTap: (int position) => setState(
              () => _tab = ProductDetailsCurrentTab.values[position],
            ),
            items: ProductDetailsCurrentTab.values
                .map(
                  (ProductDetailsCurrentTab tab) => BottomNavigationBarItem(
                    icon: Icon(tab.icon),
                    label: tab.label(localizations),
                  ),
                )
                .toList(growable: false),
          ),
        ],
      ),
    );
  }

  Widget _getBody() {
    return Stack(
      children: <Widget>[
        Offstage(
          offstage: _tab != ProductDetailsCurrentTab.summary,
          child: ProductTab0(),
        ),
        Offstage(
          offstage: _tab != ProductDetailsCurrentTab.info,
          child: ProductTab1(),
        ),
        Offstage(
          offstage: _tab != ProductDetailsCurrentTab.nutrition,
          child: ProductTab2(),
        ),
        Offstage(
          offstage: _tab != ProductDetailsCurrentTab.nutritionalValues,
          child: ProductTab3(),
        ),
      ],
    );
  }
}

enum ProductDetailsCurrentTab {
  summary(AppIcons.tab_barcode),
  info(AppIcons.tab_fridge),
  nutrition(AppIcons.tab_nutrition),
  nutritionalValues(AppIcons.tab_array);

  const ProductDetailsCurrentTab(this.icon);

  final IconData icon;

  String label(AppLocalizations appLocalizations) => switch (this) {
    ProductDetailsCurrentTab.summary => appLocalizations.product_tab_summary,
    ProductDetailsCurrentTab.info => appLocalizations.product_tab_properties,
    ProductDetailsCurrentTab.nutrition =>
      appLocalizations.product_tab_nutrition,
    ProductDetailsCurrentTab.nutritionalValues =>
      appLocalizations.product_tab_nutrition_facts,
  };
}
