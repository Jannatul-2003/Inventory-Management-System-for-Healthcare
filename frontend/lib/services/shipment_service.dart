import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:frontend/models/shipment.dart';

class ShipmentService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<List<Shipment>> getShipments() async {
    final response = await http.get(Uri.parse('$baseUrl/shipments'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Shipment.fromJson(json)).toList();
    }
    throw Exception('Failed to load shipments');
  }

  Future<Shipment> createShipment(int orderId, DateTime shipmentDate) async {
    final response = await http.post(
      Uri.parse('$baseUrl/shipments'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'order_id': orderId,
        'shipment_date': shipmentDate.toIso8601String(),
      }),
    );
    if (response.statusCode == 200) {
      return Shipment.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to create shipment');
  }

  Future<void> updateShipmentStatus(int shipmentId, String status) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/shipments/$shipmentId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': status}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update shipment status');
    }
  }
}