import 'package:flutter/material.dart';
import 'package:frontend/models/inventory.dart';
import 'package:frontend/services/inventory_service.dart';
import 'package:frontend/widgets/inventory_card.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final InventoryService _inventoryService = InventoryService();
  late Future<List<Inventory>> _inventoryFuture;
  String _searchQuery = '';
  String _filterStatus = '';

  @override
  void initState() {
    super.initState();
    _refreshInventory();
  }

  void _refreshInventory() {
    setState(() {
      _inventoryFuture = _inventoryService.getInventory();
    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: Text('Inventory Management'),
          floating: true,
          actions: [
            IconButton(
              icon: Icon(Icons.filter_list),
              onPressed: () => _showFilterDialog(context),
            ),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: SearchBar(
              onChanged: (value) => setState(() => _searchQuery = value),
              hintText: 'Search products...',
            ),
          ),
        ),
        FutureBuilder<List<Inventory>>(
          future: _inventoryFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              );
            }

            if (snapshot.hasError) {
              return SliverFillRemaining(
                child: Center(child: Text('Error loading inventory')),
              );
            }

            final inventory = snapshot.data!
                .where((item) =>
                    item.product.name.toLowerCase().contains(_searchQuery.toLowerCase()) &&
                    (_filterStatus.isEmpty || item.status == _filterStatus))
                .toList();

            return SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => InventoryCard(
                  inventory: inventory[index],
                  onQuantityChanged: (quantity) async {
                    try {
                      await _inventoryService.updateQuantity(
                        inventory[index].inventoryId,
                        quantity,
                      );
                      _refreshInventory();
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to update quantity')),
                      );
                    }
                  },
                ),
                childCount: inventory.length,
              ),
            );
          },
        ),
      ],
    );
  }

  void _showFilterDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Filter Inventory'),
        content: StatefulBuilder(
          builder: (context, setState) => Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<String>(
                title: Text('All'),
                value: '',
                groupValue: _filterStatus,
                onChanged: (value) => setState(() => _filterStatus = value!),
              ),
              RadioListTile<String>(
                title: Text('In Stock'),
                value: 'In Stock',
                groupValue: _filterStatus,
                onChanged: (value) => setState(() => _filterStatus = value!),
              ),
              RadioListTile<String>(
                title: Text('Low Stock'),
                value: 'Low Stock',
                groupValue: _filterStatus,
                onChanged: (value) => setState(() => _filterStatus = value!),
              ),
              RadioListTile<String>(
                title: Text('Out of Stock'),
                value: 'Out of Stock',
                groupValue: _filterStatus,
                onChanged: (value) => setState(() => _filterStatus = value!),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            child: Text('Apply'),
            onPressed: () {
              setState(() {}); // Refresh the main screen
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
