import 'package:flutter/material.dart';
import 'package:frontend/models/order.dart';

class OrderCard extends StatelessWidget {
  final Order order;
  final VoidCallback onTap;

  const OrderCard({super.key, 
    required this.order,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: ListTile(
        title: Text(order.customerName),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Supplier: ${order.supplierName}'),
            Text('Total Amount: \$${order.totalAmount.toStringAsFixed(2)}'),
            Text('Status: ${order.status}'),
          ],
        ),
        trailing: Icon(Icons.arrow_forward),
        onTap: onTap,
      ),
    );
  }
}