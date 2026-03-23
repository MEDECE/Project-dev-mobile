import 'package:flutter/foundation.dart';
import 'package:formation_flutter/services/pocketbase_service.dart';
import 'package:formation_flutter/model/recall_detail.dart';

class RecallDetailFetcher extends ChangeNotifier {
  RecallDetailFetcherState _state = RecallDetailFetcherLoading();
  RecallDetailFetcherState get state => _state;

  Future<void> load(String barcode) async {
    _state = RecallDetailFetcherLoading();
    notifyListeners();
    try {
      final pb = PocketBaseService.instance.client;
      final records = await pb.collection('recalls').getFullList(
        filter: 'barcode = "$barcode"',
      );
      if (records.isEmpty) throw Exception('Rappel introuvable');
      _state = RecallDetailFetcherSuccess(RecallDetail.fromRecord(records.first));
    } catch (e) {
      _state = RecallDetailFetcherError(e);
    } finally {
      notifyListeners();
    }
  }
}

sealed class RecallDetailFetcherState {}

class RecallDetailFetcherLoading extends RecallDetailFetcherState {}

class RecallDetailFetcherSuccess extends RecallDetailFetcherState {
  final RecallDetail recall;
  RecallDetailFetcherSuccess(this.recall);
}

class RecallDetailFetcherError extends RecallDetailFetcherState {
  final dynamic error;
  RecallDetailFetcherError(this.error);
}
