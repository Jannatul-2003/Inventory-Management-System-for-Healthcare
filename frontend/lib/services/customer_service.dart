import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:frontend/models/customer.dart';
class CustomerService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<List<Customer>> getCustomers() async {
    final response = await http.get(Uri.parse('$baseUrl/customers'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Customer.fromJson(json)).toList();
    }
    throw Exception('Failed to load customers');
  }

  Future<Customer> createCustomer(String name, String contactInfo) async {
    final response = await http.post(
      Uri.parse('$baseUrl/customers'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': name,
        'contact_info': contactInfo,
      }),
    );
    if (response.statusCode == 200) {
      return Customer.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to create customer');
  }

  Future<void> updateCustomer(int id, String name, String contactInfo) async {
    final response = await http.put(
      Uri.parse('$baseUrl/customers/$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': name,
        'contact_info': contactInfo,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update customer');
    }
  }

  Future<void> deleteCustomer(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/customers/$id'));
    if (response.statusCode != 200) {
      throw Exception('Failed to delete customer');
    }
  }
}
