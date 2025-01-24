import 'package:frontend/models/payment.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class PaymentService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<List<Payment>> getPayments() async {
    final response = await http.get(Uri.parse('$baseUrl/payments'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Payment.fromJson(json)).toList();
    }
    throw Exception('Failed to load payments');
  }

  Future<Payment> recordPayment(int orderId, double amount) async {
    final response = await http.post(
      Uri.parse('$baseUrl/payments'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'order_id': orderId,
        'amount': amount,
      }),
    );
    if (response.statusCode == 200) {
      return Payment.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to record payment');
  }

  Future<void> updatePaymentStatus(int paymentId, String status) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/payments/$paymentId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': status}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update payment status');
    }
  }
}
