import 'package:flutter/foundation.dart';
import 'package:formation_flutter/services/pocketbase_service.dart';

class RecallFetcher extends ChangeNotifier {
  RecallFetcherState _state = RecallFetcherIdle();
  RecallFetcherState get state => _state;

  Future<void> checkRecall(String barcode) async {
    if (barcode.isEmpty) {
      _state = RecallFetcherNoRecall();
      notifyListeners();
      return;
    }
    _state = RecallFetcherChecking();
    notifyListeners();
    try {
      final pb = PocketBaseService.instance.client;
      final records = await pb.collection('recalls').getFullList(
        filter: 'barcode = "$barcode"',
      );
      if (records.isEmpty) {
        _state = RecallFetcherNoRecall();
      } else {
        _state = RecallFetcherHasRecall(barcode);
      }
    } catch (e) {
      _state = RecallFetcherNoRecall(); // En cas d'erreur réseau, on n'affiche pas la bannière
    } finally {
      notifyListeners();
    }
  }
}

sealed class RecallFetcherState {}

class RecallFetcherIdle extends RecallFetcherState {}

class RecallFetcherChecking extends RecallFetcherState {}

class RecallFetcherNoRecall extends RecallFetcherState {}

class RecallFetcherHasRecall extends RecallFetcherState {
  final String barcode;
  RecallFetcherHasRecall(this.barcode);
}
