import 'package:pocketbase/pocketbase.dart';

Future<void> testPocketBase() async {
  final pb = PocketBase('http://127.0.0.1:8090');
  // Remplacez par l'ID réel d'un record existant dans votre collection 'rappels'
  final record = await pb.collection('rappels').getOne('76gi7gpmfa9su27');
  print(record.data); // Affiche toutes les données du record
}
