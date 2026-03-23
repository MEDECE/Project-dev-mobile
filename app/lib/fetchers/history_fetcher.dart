import 'package:flutter/foundation.dart';
import 'package:formation_flutter/services/pocketbase_service.dart';

class HistoryFetcher extends ChangeNotifier {
  HistoryFetcherState _state = HistoryFetcherLoading();
  HistoryFetcherState get state => _state;

  Future<void> load() async {
    _state = HistoryFetcherLoading();
    notifyListeners();
    try {
      final pb = PocketBaseService.instance.client;
      final userId = pb.authStore.record?.id ?? '';
      final records = await pb.collection('history').getFullList(
        sort: '-scanned_at',
        filter: 'user = "$userId"',
      );
      final barcodes = records.map((r) => r.data['barcode'] as String).toList();
      _state = HistoryFetcherSuccess(barcodes);
    } catch (e) {
      _state = HistoryFetcherError(e);
    } finally {
      notifyListeners();
    }
  }
}

sealed class HistoryFetcherState {}

class HistoryFetcherLoading extends HistoryFetcherState {}

class HistoryFetcherSuccess extends HistoryFetcherState {
  final List<String> barcodes;
  HistoryFetcherSuccess(this.barcodes);
}

class HistoryFetcherError extends HistoryFetcherState {
  final dynamic error;
  HistoryFetcherError(this.error);
}
