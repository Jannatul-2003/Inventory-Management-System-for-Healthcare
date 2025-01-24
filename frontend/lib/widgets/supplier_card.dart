import 'package:flutter/material.dart';
import 'package:frontend/models/supplier.dart';

class SupplierCard extends StatelessWidget {
  final Supplier supplier;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const SupplierCard({super.key, 
    required this.supplier,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: ListTile(
        title: Text(supplier.name),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Contact: ${supplier.contactInfo}'),
            Text('Total Orders: ${supplier.totalOrders}'),
            Text('Avg Delivery Days: ${supplier.avgDeliveryDays.toStringAsFixed(2)}'),
            Text('Total Revenue: \$${supplier.totalRevenue.toStringAsFixed(2)}'),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: Icon(Icons.edit),
              onPressed: onEdit,
            ),
            IconButton(
              icon: Icon(Icons.delete),
              onPressed: onDelete,
            ),
          ],
        ),
      ),
    );
  }
}
