import 'package:flutter/material.dart';
import 'package:frontend/models/order.dart';

class OrderDetailsDialog extends StatelessWidget {
  final Order order;

  const OrderDetailsDialog({super.key, 
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Order Details'),
      content: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Order ID: ${order.orderId}'),
            Text('Date: ${order.orderDate.toLocal()}'),
            Text('Customer: ${order.customerName}'),
            Text('Supplier: ${order.supplierName}'),
            Text('Total Amount: \$${order.totalAmount.toStringAsFixed(2)}'),
            Text('Status: ${order.status}'),
            SizedBox(height: 16.0),
            Text('Products:', style: TextStyle(fontWeight: FontWeight.bold)),
            ...order.details.map(
              (detail) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Text(
                  '${detail.productName} - Qty: ${detail.quantity}, Price: \$${detail.price.toStringAsFixed(2)}',
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text('Close'),
        ),
      ],
    );
  }
}