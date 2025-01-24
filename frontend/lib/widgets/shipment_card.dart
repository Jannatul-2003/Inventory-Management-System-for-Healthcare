
// lib/widgets/shipment_card.dart
import 'package:flutter/material.dart';
import 'package:frontend/models/shipment.dart';
import 'package:intl/intl.dart';

class ShipmentCard extends StatelessWidget {
  final Shipment shipment;
  final Function(String) onUpdateStatus;

  const ShipmentCard({super.key, 
    required this.shipment,
    required this.onUpdateStatus,
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
                  'Shipment #${shipment.shipmentId}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                DropdownButton<String>(
                  value: shipment.status,
                  items: ['Pending', 'In Transit', 'Delivered'].map((status) {
                    return DropdownMenuItem(
                      value: status,
                      child: Text(status),
                    );
                  }).toList(),
                  onChanged: (value) {
                    if (value != null) onUpdateStatus(value);
                  },
                ),
              ],
            ),
            SizedBox(height: 8),
            Text('Order #${shipment.orderId}'),
            Text('Ship Date: ${DateFormat('MMM d, y').format(shipment.shipmentDate)}'),
            SizedBox(height: 16),
            Text(
              'Products',
              style: Theme.of(context).textTheme.titleSmall,
            ),
            SizedBox(height: 8),
            ...shipment.details.map((detail) => Padding(
              padding: EdgeInsets.only(bottom: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(detail.productName),
                  Text('x${detail.quantity}'),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}