import 'package:frontend/models/supplier.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
class SupplierService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<List<Supplier>> getSuppliers() async {
    final response = await http.get(Uri.parse('$baseUrl/suppliers'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Supplier.fromJson(json)).toList();
    }
    throw Exception('Failed to load suppliers');
  }

  Future<Supplier> createSupplier(String name, String contactInfo) async {
    final response = await http.post(
      Uri.parse('$baseUrl/suppliers'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': name,
        'contact_info': contactInfo,
      }),
    );
    if (response.statusCode == 200) {
      return Supplier.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to create supplier');
  }

  Future<void> updateSupplier(Supplier supplier) async {
    final response = await http.put(
      Uri.parse('$baseUrl/suppliers/${supplier.supplierId}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': supplier.name,
        'contact_info': supplier.contactInfo,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update supplier');
    }
  }

  Future<void> deleteSupplier(int supplierId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/suppliers/$supplierId'),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to delete supplier');
    }
  }
}
