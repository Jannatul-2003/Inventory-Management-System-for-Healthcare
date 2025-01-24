import 'package:flutter/material.dart';
import 'package:frontend/models/inventory.dart';
import 'package:intl/intl.dart';

class InventoryCard extends StatefulWidget {
  final Inventory inventory;
  final Function(int) onQuantityChanged;

  const InventoryCard({super.key, 
    required this.inventory,
    required this.onQuantityChanged,
  });

  @override
  State<InventoryCard> createState() => _InventoryCardState();
}

class _InventoryCardState extends State<InventoryCard> {
  late TextEditingController _quantityController;

  @override
  void initState() {
    super.initState();
    _quantityController = TextEditingController(
      text: widget.inventory.quantity.toString(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.inventory.product.name,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Status: ${widget.inventory.status}',
                    style: TextStyle(
                      color: _getStatusColor(widget.inventory.status),
                    ),
                  ),
                  Text(
                    'Last Updated: ${DateFormat('MMM d, y').format(widget.inventory.lastUpdated)}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            SizedBox(width: 16),
            SizedBox(
              width: 100,
              child: TextFormField(
                controller: _quantityController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Quantity',
                  suffixIcon: IconButton(
                    icon: Icon(Icons.save),
                    onPressed: () {
                      final newQuantity = int.tryParse(_quantityController.text);
                      if (newQuantity != null && newQuantity >= 0) {
                        widget.onQuantityChanged(newQuantity);
                      }
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'in stock':
        return Colors.green;
      case 'low stock':
        return Colors.orange;
      case 'out of stock':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }
}
