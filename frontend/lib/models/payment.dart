import 'package:frontend/models/order.dart';

class Payment {
  final int paymentId;
  final int orderId;
  final DateTime paymentDate;
  final double amount;
  final String status;
  final Order order;

  Payment({
    required this.paymentId,
    required this.orderId,
    required this.paymentDate,
    required this.amount,
    required this.status,
    required this.order,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      paymentId: json['payment_id'],
      orderId: json['order_id'],
      paymentDate: DateTime.parse(json['payment_date']),
      amount: json['amount'].toDouble(),
      status: json['status'],
      order: Order.fromJson(json['order']),
    );
  }
}
