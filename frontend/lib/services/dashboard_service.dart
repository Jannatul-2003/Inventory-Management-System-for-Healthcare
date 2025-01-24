import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/models/dashboard_metrics.dart';
class DashboardService {
  final String baseUrl = 'http://localhost:8000/api/v1';

  Future<DashboardMetrics> getDashboardMetrics() async {
    final response = await http.get(Uri.parse('$baseUrl/dashboard'));
    
    if (response.statusCode == 200) {
      return DashboardMetrics.fromJson(json.decode(response.body));
    }
    
    throw Exception('Failed to load dashboard metrics');
  }
}
