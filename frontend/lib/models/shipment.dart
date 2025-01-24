import 'package:frontend/models/order.dart';

class Shipment {
  final int shipmentId;
  final int orderId;
  final DateTime shipmentDate;
  final String status;
  final Order order;
  final List<ShipmentDetail> details;

  Shipment({
    required this.shipmentId,
    required this.orderId,
    required this.shipmentDate,
    required this.status,
    required this.order,
    required this.details,
  });

  factory Shipment.fromJson(Map<String, dynamic> json) {
    return Shipment(
      shipmentId: json['shipment_id'],
      orderId: json['order_id'],
      shipmentDate: DateTime.parse(json['shipment_date']),
      status: json['status'],
      order: Order.fromJson(json['order']),
      details: (json['details'] as List)
          .map((detail) => ShipmentDetail.fromJson(detail))
          .toList(),
    );
  }
}

class ShipmentDetail {
  final int productId;
  final String productName;
  final int quantity;

  ShipmentDetail({
    required this.productId,
    required this.productName,
    required this.quantity,
  });

  factory ShipmentDetail.fromJson(Map<String, dynamic> json) {
    return ShipmentDetail(
      productId: json['product_id'],
      productName: json['product_name'],
      quantity: json['quantity'],
    );
  }
}
