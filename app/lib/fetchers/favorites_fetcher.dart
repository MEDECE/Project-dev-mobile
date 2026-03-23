import 'package:flutter/foundation.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:formation_flutter/services/pocketbase_service.dart';

class FavoritesFetcher extends ChangeNotifier {
  FavoritesFetcherState _state = FavoritesFetcherLoading();
  FavoritesFetcherState get state => _state;

  Future<void> load() async {
    _state = FavoritesFetcherLoading();
    notifyListeners();
    try {
      final pb = PocketBaseService.instance.client;
      final userId = pb.authStore.record?.id ?? '';
      final records = await pb.collection('favorites').getFullList(
        filter: 'user = "$userId"',
      );
      _state = FavoritesFetcherSuccess(
        records: records,
        barcodes: records.map((r) => r.data['barcode'] as String).toList(),
      );
    } catch (e) {
      _state = FavoritesFetcherError(e);
    } finally {
      notifyListeners();
    }
  }

  bool isFavorite(String barcode) {
    if (_state case FavoritesFetcherSuccess(:final barcodes)) {
      return barcodes.contains(barcode);
    }
    return false;
  }

  Future<void> toggle(String barcode) async {
    final pb = PocketBaseService.instance.client;
    final userId = pb.authStore.record?.id ?? '';
    try {
      if (isFavorite(barcode)) {
        final existing = await pb.collection('favorites').getFullList(
          filter: 'user = "$userId" && barcode = "$barcode"',
        );
        if (existing.isNotEmpty) {
          await pb.collection('favorites').delete(existing.first.id);
        }
      } else {
        await pb.collection('favorites').create(body: {
          'user': userId,
          'barcode': barcode,
        });
      }
      await load();
    } catch (e) {
      _state = FavoritesFetcherError(e);
      notifyListeners();
    }
  }
}

sealed class FavoritesFetcherState {}

class FavoritesFetcherLoading extends FavoritesFetcherState {}

class FavoritesFetcherSuccess extends FavoritesFetcherState {
  final List<RecordModel> records;
  final List<String> barcodes;
  FavoritesFetcherSuccess({required this.records, required this.barcodes});
}

class FavoritesFetcherError extends FavoritesFetcherState {
  final dynamic error;
  FavoritesFetcherError(this.error);
}
