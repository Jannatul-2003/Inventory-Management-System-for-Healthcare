import 'dart:convert';

import 'package:frontend/models/inventory.dart';
import 'package:http/http.dart' as http;

class InventoryService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<List<Inventory>> getInventory() async {
    final response = await http.get(Uri.parse('$baseUrl/inventory'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Inventory.fromJson(json)).toList();
    }
    throw Exception('Failed to load inventory');
  }

  Future<void> updateQuantity(int inventoryId, int quantity) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/inventory/$inventoryId'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'quantity': quantity}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update inventory');
    }
  }
}