import 'package:flutter/material.dart';
import 'package:frontend/models/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              product.name,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 8),
            Text(
              product.description,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '\$${product.price.toStringAsFixed(2)}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Chip(
                  label: Text(product.stockStatus),
                  backgroundColor: _getStockStatusColor(product.stockStatus),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStockStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'in stock':
        return Colors.green[100]!;
      case 'low stock':
        return Colors.orange[100]!;
      case 'out of stock':
        return Colors.red[100]!;
      default:
        return Colors.grey[100]!;
    }
  }
}
