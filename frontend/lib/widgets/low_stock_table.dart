import 'package:flutter/material.dart';
import 'package:frontend/models/product.dart';

class LowStockTable extends StatelessWidget {
  final List<Product> products;

  const LowStockTable({super.key, required this.products});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Low Stock Items',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('Product')),
                  DataColumn(label: Text('Current Stock')),
                  DataColumn(label: Text('Status')),
                  DataColumn(label: Text('Price')),
                ],
                rows: products.map((product) {
                  return DataRow(cells: [
                    DataCell(Text(product.name)),
                    DataCell(Text(product.currentStock.toString())),
                    DataCell(Text(product.stockStatus)),
                    DataCell(Text('\$${product.price.toStringAsFixed(2)}')),
                  ]);
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}