import 'package:flutter/material.dart';
import 'package:frontend/models/customer.dart';

class CustomerCard extends StatelessWidget {
  final Customer customer;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const CustomerCard({super.key, 
    required this.customer,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  customer.name,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                PopupMenuButton(
                  itemBuilder: (context) => [
                    PopupMenuItem(
                      onTap: onEdit,
                      child: Text('Edit'),
                    ),
                    PopupMenuItem(
                      onTap: onDelete,
                      child: Text('Delete'),
                    ),
                  ],
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(customer.contactInfo),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total Orders: ${customer.totalOrders}'),
                Text(
                  'Total Spent: \$${customer.totalSpent.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
