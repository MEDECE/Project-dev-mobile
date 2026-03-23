import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:formation_flutter/res/app_icons.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:formation_flutter/api/open_food_facts_api.dart';
import 'package:formation_flutter/fetchers/history_fetcher.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/screens/homepage/homepage_empty.dart';
import 'package:formation_flutter/screens/homepage/homepage_history_item.dart';
import 'package:formation_flutter/screens/scanner/scanner_screen.dart';
import 'package:formation_flutter/services/pocketbase_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late final HistoryFetcher _historyFetcher;

  @override
  void initState() {
    super.initState();
    _historyFetcher = HistoryFetcher()..load();
    _historyFetcher.addListener(_onHistoryChanged);
  }

  void _onHistoryChanged() {
    setState(() {});
  }

  @override
  void dispose() {
    _historyFetcher.removeListener(_onHistoryChanged);
    _historyFetcher.dispose();
    super.dispose();
  }

  bool get _hasHistory {
    final state = _historyFetcher.state;
    return state is HistoryFetcherSuccess && state.barcodes.isNotEmpty;
  }

  Future<void> _startScan() async {
    final barcode = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (_) => const ScannerScreen()),
    );
    if (barcode == null || !mounted) return;

    try {
      await OpenFoodFactsAPI().getProduct(barcode);
    } on ProductNotFoundException {
      // Produit introuvable : on affiche la page sans sauvegarder en historique
      if (mounted) context.push('/product', extra: barcode);
      return;
    } catch (_) {
      // Erreur réseau : on navigue quand même pour que l'utilisateur puisse réessayer
      if (mounted) context.push('/product', extra: barcode);
      return;
    }

    await _saveToHistory(barcode);
    if (mounted) context.push('/product', extra: barcode);
  }

  Future<void> _saveToHistory(String barcode) async {
    try {
      final pb = PocketBaseService.instance.client;
      await pb.collection('history').create(body: {
        'user': pb.authStore.record?.id ?? '',
        'barcode': barcode,
      });
      _historyFetcher.load();
    } catch (e) {
      // ignore
    }
  }

  void _logout() {
    PocketBaseService.instance.client.authStore.clear();
    context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.grey1,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        title: const Text(
          'Mes scans',
          style: TextStyle(
            color: AppColors.blue,
            fontFamily: 'Avenir',
            fontSize: 17,
            fontWeight: FontWeight.w800,
          ),
        ),
        centerTitle: false,
        actions: [
          if (_hasHistory)
            IconButton(
              icon: const Icon(AppIcons.barcode, color: AppColors.blue),
              onPressed: _startScan,
            ),
          IconButton(
            icon: SvgPicture.asset(
              'res/svg/ic_star.svg',
              width: 24,
              height: 24,
              colorFilter: const ColorFilter.mode(AppColors.blue, BlendMode.srcIn),
            ),
            onPressed: () => context.push('/favorites'),
          ),
          IconButton(
            icon: SvgPicture.asset('res/svg/ic_logout.svg', width: 24, height: 24),
            onPressed: _logout,
          ),
        ],
      ),
      body: ChangeNotifierProvider.value(
        value: _historyFetcher,
        child: Consumer<HistoryFetcher>(
          builder: (context, fetcher, _) => switch (fetcher.state) {
            HistoryFetcherLoading() =>
              const Center(child: CircularProgressIndicator()),
            HistoryFetcherError() => const Center(
                child: Text(
                  'Erreur de chargement',
                  style: TextStyle(fontFamily: 'Avenir'),
                ),
              ),
            HistoryFetcherSuccess(:final barcodes) => barcodes.isEmpty
                ? HomePageEmpty(onScan: _startScan)
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    clipBehavior: Clip.none,
                    itemCount: barcodes.length,
                    itemBuilder: (_, i) =>
                        HomepageHistoryItem(barcode: barcodes[i]),
                  ),
          },
        ),
      ),
    );
  }
}
