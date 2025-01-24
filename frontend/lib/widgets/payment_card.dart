import 'package:flutter/material.dart';
import 'package:frontend/models/payment.dart';

class PaymentCard extends StatelessWidget {
  final Payment payment;
  final Function(String) onUpdateStatus;

  const PaymentCard({
    super.key,
    required this.payment,
    required this.onUpdateStatus,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Payment #${payment.paymentId}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Chip(
                  label: Text(payment.status),
                  backgroundColor: _getStatusColor(payment.status),
                ),
              ],
            ),
            const SizedBox(height: 8.0),
            Text('Order ID: ${payment.orderId}'),
            Text('Amount: \$${payment.amount.toStringAsFixed(2)}'),
            Text('Payment Date: ${payment.paymentDate.toLocal()}'),
            Text('Customer: ${payment.order.customerName}'),
            const SizedBox(height: 8.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => onUpdateStatus('Completed'),
                  child: const Text('Mark as Completed'),
                ),
                TextButton(
                  onPressed: () => onUpdateStatus('Failed'),
                  child: const Text('Mark as Failed'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Completed':
        return Colors.green;
      case 'Pending':
        return Colors.orange;
      case 'Failed':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
