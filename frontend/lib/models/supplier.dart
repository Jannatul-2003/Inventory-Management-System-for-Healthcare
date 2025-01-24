class Supplier {
  final int supplierId;
  final String name;
  final String contactInfo;
  final int totalOrders;
  final double avgDeliveryDays;
  final double totalRevenue;

  Supplier({
    required this.supplierId,
    required this.name,
    required this.contactInfo,
    required this.totalOrders,
    required this.avgDeliveryDays,
    required this.totalRevenue,
  });

  factory Supplier.fromJson(Map<String, dynamic> json) {
    return Supplier(
      supplierId: json['supplier_id'],
      name: json['name'],
      contactInfo: json['contact_info'],
      totalOrders: json['total_orders'],
      avgDeliveryDays: json['avg_delivery_days'].toDouble(),
      totalRevenue: json['total_revenue'].toDouble(),
    );
  }
}