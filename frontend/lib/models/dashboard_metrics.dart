import 'package:frontend/models/product.dart';

class DashboardMetrics {
  final int totalProducts;
  final int lowStockCount;
  final int pendingOrders;
  final double monthlyRevenue;
  final List<RevenueData> revenueData;
  final List<Product> lowStockProducts;

  DashboardMetrics({
    required this.totalProducts,
    required this.lowStockCount,
    required this.pendingOrders,
    required this.monthlyRevenue,
    required this.revenueData,
    required this.lowStockProducts,
  });

  factory DashboardMetrics.fromJson(Map<String, dynamic> json) {
    return DashboardMetrics(
      totalProducts: json['total_products'],
      lowStockCount: json['low_stock_count'],
      pendingOrders: json['pending_orders'],
      monthlyRevenue: json['monthly_revenue'].toDouble(),
      revenueData: (json['revenue_data'] as List)
          .map((data) => RevenueData.fromJson(data))
          .toList(),
      lowStockProducts: (json['low_stock_products'] as List)
          .map((product) => Product.fromJson(product))
          .toList(),
    );
  }
}

class RevenueData {
  final DateTime date;
  final double revenue;

  RevenueData({required this.date, required this.revenue});

  factory RevenueData.fromJson(Map<String, dynamic> json) {
    return RevenueData(
      date: DateTime.parse(json['date']),
      revenue: json['revenue'].toDouble(),
    );
  }
}