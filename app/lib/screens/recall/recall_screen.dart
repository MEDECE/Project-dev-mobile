import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:formation_flutter/fetchers/recall_detail_fetcher.dart';
import 'package:formation_flutter/model/recall_detail.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/res/app_icons.dart';
import 'package:formation_flutter/res/app_theme_extension.dart';

class RecallScreen extends StatefulWidget {
  final String barcode;
  final String? productImageUrl;
  const RecallScreen({super.key, required this.barcode, this.productImageUrl});

  @override
  State<RecallScreen> createState() => _RecallScreenState();
}

class _RecallScreenState extends State<RecallScreen> {
  late final RecallDetailFetcher _fetcher;

  @override
  void initState() {
    super.initState();
    _fetcher = RecallDetailFetcher()..load(widget.barcode);
  }

  @override
  void dispose() {
    _fetcher.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: _fetcher,
      child: Consumer<RecallDetailFetcher>(
        builder: (context, fetcher, _) {
          return switch (fetcher.state) {
            RecallDetailFetcherLoading() => Scaffold(
                backgroundColor: const Color(0xFFFAFAFA),
                appBar: _buildAppBar(null),
                body: const Center(child: CircularProgressIndicator()),
              ),
            RecallDetailFetcherError() => Scaffold(
                backgroundColor: const Color(0xFFFAFAFA),
                appBar: _buildAppBar(null),
                body: const Center(
                  child: Text(
                    'Rappel introuvable',
                    style: TextStyle(fontFamily: 'Avenir'),
                  ),
                ),
              ),
            RecallDetailFetcherSuccess(:final recall) => Scaffold(
                backgroundColor: const Color(0xFFFAFAFA),
                appBar: _buildAppBar(recall),
                body: _RecallBody(
                  recall: recall,
                  productImageUrl: widget.productImageUrl,
                ),
              ),
          };
        },
      ),
    );
  }

  AppBar _buildAppBar(RecallDetail? recall) {
    return AppBar(
      backgroundColor: AppColors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      leading: BackButton(color: AppColors.blue),
      title: const Text(
        'Rappel produit',
        style: TextStyle(
          color: AppColors.blue,
          fontFamily: 'Avenir',
          fontSize: 17,
          fontWeight: FontWeight.w800,
        ),
      ),
      actions: [
        IconButton(
          icon: Transform.scale(
            scaleX: -1,
            child: const Icon(AppIcons.share, color: AppColors.blue, size: 20),
          ),
          onPressed: recall != null
              ? () {
                  final text = recall.link?.isNotEmpty == true
                      ? recall.link!
                      : 'Rappel produit : ${recall.productName}';
                  Clipboard.setData(ClipboardData(text: text));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Lien copié dans le presse-papier')),
                  );
                }
              : null,
        ),
      ],
    );
  }
}

class _RecallBody extends StatelessWidget {
  final RecallDetail recall;
  final String? productImageUrl;
  const _RecallBody({required this.recall, this.productImageUrl});

  @override
  Widget build(BuildContext context) {
    final imageUrl = (recall.imageUrl != null && recall.imageUrl!.isNotEmpty)
        ? recall.imageUrl
        : productImageUrl;

    return ListView(
      children: [
        if (imageUrl != null && imageUrl.isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 84, vertical: 16),
            child: AspectRatio(
              aspectRatio: 1,
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (ctx, e, st) => const SizedBox.shrink(),
              ),
            ),
          ),
        if (recall.dateDebut != null || recall.dateFin != null) ...[
          _SectionTitle(title: 'Dates de commercialisation'),
          _SectionContent(text: _formatDates(recall.dateDebut, recall.dateFin)),
        ],
        if (recall.distributeurs.isNotEmpty) ...[
          _SectionTitle(title: 'Distributeurs'),
          _SectionContent(text: recall.distributeurs),
        ],
        if (recall.zoneGeographique.isNotEmpty) ...[
          _SectionTitle(title: 'Zone géographique'),
          _SectionContent(text: recall.zoneGeographique),
        ],
        if (recall.motif.isNotEmpty) ...[
          _SectionTitle(title: 'Motif du rappel'),
          _SectionContent(text: recall.motif),
        ],
        if (recall.risques.isNotEmpty) ...[
          _SectionTitle(title: 'Risques encourus'),
          _SectionContent(text: recall.risques),
        ],
        const SizedBox(height: 32),
      ],
    );
  }

  String _formatDates(String? debut, String? fin) {
    final fmt = DateFormat('dd/MM/yyyy');
    final d = _fmtDate(debut, fmt);
    final f = _fmtDate(fin, fmt);
    if (d != null && f != null) return 'Du $d au $f';
    if (d != null) return 'À partir du $d';
    if (f != null) return "Jusqu'au $f";
    return '';
  }

  String? _fmtDate(String? raw, DateFormat fmt) {
    if (raw == null || raw.isEmpty) return null;
    try {
      return fmt.format(DateTime.parse(raw).toLocal());
    } catch (_) {
      return raw;
    }
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.grey1,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      child: Text(
        title,
        textAlign: TextAlign.center,
        style: context.theme.title3,
      ),
    );
  }
}

class _SectionContent extends StatelessWidget {
  const _SectionContent({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontFamily: 'Avenir',
          fontSize: 13,
          color: AppColors.grey3,
          height: 1.5,
        ),
      ),
    );
  }
}
