import 'dart:convert';

import 'package:frontend/models/order.dart';
import 'package:http/http.dart' as http;

class OrderService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<List<Order>> getOrders() async {
    final response = await http.get(Uri.parse('$baseUrl/orders'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Order.fromJson(json)).toList();
    }
    throw Exception('Failed to load orders');
  }

  Future<Order> getOrderById(int orderId) async {
    final response = await http.get(Uri.parse('$baseUrl/orders/$orderId'));
    if (response.statusCode == 200) {
      return Order.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to load order');
  }

  Future<void> updateOrderStatus(int orderId, String status) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$orderId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': status}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update order status');
    }
  }
}
