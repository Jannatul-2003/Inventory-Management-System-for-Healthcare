class Order {
  final int orderId;
  final DateTime orderDate;
  final String customerName;
  final String supplierName;
  final double totalAmount;
  final String status;
  final List<OrderDetail> details;

  Order({
    required this.orderId,
    required this.orderDate,
    required this.customerName,
    required this.supplierName,
    required this.totalAmount,
    required this.status,
    required this.details,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      orderId: json['order_id'],
      orderDate: DateTime.parse(json['order_date']),
      customerName: json['customer_name'],
      supplierName: json['supplier_name'],
      totalAmount: json['total_amount'].toDouble(),
      status: json['status'],
      details: (json['details'] as List)
          .map((detail) => OrderDetail.fromJson(detail))
          .toList(),
    );
  }
}

class OrderDetail {
  final int productId;
  final String productName;
  final int quantity;
  final double price;

  OrderDetail({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
  });

  factory OrderDetail.fromJson(Map<String, dynamic> json) {
    return OrderDetail(
      productId: json['product_id'],
      productName: json['product_name'],
      quantity: json['quantity'],
      price: json['price'].toDouble(),
    );
  }
}