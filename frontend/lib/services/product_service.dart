// lib/services/product_service.dart
import 'dart:convert';

import 'package:frontend/models/product.dart';
import 'package:http/http.dart' as http;

class ProductService {
  final String baseUrl = 'http://localhost:8000/api/v1';
  final http.Client client = http.Client();

  Future<List<Product>> getProducts() async {
    final response = await client.get(Uri.parse('$baseUrl/products'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    }
    throw Exception('Failed to load products');
  }

  Future<Product> createProduct(Product product) async {
    final response = await client.post(
      Uri.parse('$baseUrl/products'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': product.name,
        'description': product.description,
        'price': product.price,
      }),
    );
    if (response.statusCode == 200) {
      return Product.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to create product');
  }

  Future<Product> updateProduct(Product product) async {
    final response = await client.put(
      Uri.parse('$baseUrl/products/${product.productId}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': product.name,
        'description': product.description,
        'price': product.price,
      }),
    );
    if (response.statusCode == 200) {
      return Product.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to update product');
  }

  Future<void> deleteProduct(int productId) async {
    final response = await client.delete(
      Uri.parse('$baseUrl/products/$productId'),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to delete product');
    }
  }
}

