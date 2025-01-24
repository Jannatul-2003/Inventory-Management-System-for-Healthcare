import 'package:frontend/models/order.dart';

class Customer {
  final int customerId;
  final String name;
  final String contactInfo;
  final int totalOrders;
  final double totalSpent;
  final List<Order> recentOrders;

  Customer({
    required this.customerId,
    required this.name,
    required this.contactInfo,
    required this.totalOrders,
    required this.totalSpent,
    required this.recentOrders,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      customerId: json['customer_id'],
      name: json['name'],
      contactInfo: json['contact_info'],
      totalOrders: json['total_orders'],
      totalSpent: json['total_spent'].toDouble(),
      recentOrders: (json['recent_orders'] as List)
          .map((order) => Order.fromJson(order))
          .toList(),
    );
  }
}
