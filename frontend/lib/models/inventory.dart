import 'package:frontend/models/product.dart';

class Inventory {
  final int inventoryId;
  final Product product;
  final int quantity;
  final String status;
  final DateTime lastUpdated;

  Inventory({
    required this.inventoryId,
    required this.product,
    required this.quantity,
    required this.status,
    required this.lastUpdated,
  });

  factory Inventory.fromJson(Map<String, dynamic> json) {
    return Inventory(
      inventoryId: json['inventory_id'],
      product: Product.fromJson(json['product']),
      quantity: json['quantity'],
      status: json['status'],
      lastUpdated: DateTime.parse(json['last_updated']),
    );
  }
}
