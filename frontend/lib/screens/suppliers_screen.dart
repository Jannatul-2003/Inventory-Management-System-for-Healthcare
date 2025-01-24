import 'package:flutter/material.dart';
import 'package:frontend/models/supplier.dart';
import 'package:frontend/services/supplier_service.dart';
import 'package:frontend/widgets/supplier_card.dart';

class SuppliersScreen extends StatefulWidget {
  const SuppliersScreen({super.key});

  @override
  State<SuppliersScreen> createState() => _SuppliersScreenState();
}

class _SuppliersScreenState extends State<SuppliersScreen> {
  final SupplierService _supplierService = SupplierService();
  late Future<List<Supplier>> _suppliersFuture;

  @override
  void initState() {
    super.initState();
    _refreshSuppliers();
  }

  void _refreshSuppliers() {
    setState(() {
      _suppliersFuture = _supplierService.getSuppliers();
    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: Text('Suppliers'),
          floating: true,
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () => _showAddSupplierDialog(context),
            ),
          ],
        ),
        FutureBuilder<List<Supplier>>(
          future: _suppliersFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              );
            }

            if (snapshot.hasError) {
              return SliverFillRemaining(
                child: Center(child: Text('Error loading suppliers')),
              );
            }

            final suppliers = snapshot.data!;

            return SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => SupplierCard(
                  supplier: suppliers[index],
                  onEdit: () =>
                      _showEditSupplierDialog(context, suppliers[index]),
                  onDelete: () => _deleteSupplier(suppliers[index].supplierId),
                ),
                childCount: suppliers.length,
              ),
            );
          },
        ),
      ],
    );
  }

  Future<void> _showAddSupplierDialog(BuildContext context) async {
    final formKey = GlobalKey<FormState>();
    String name = '';
    String contactInfo = '';

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add Supplier'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a name';
                  }
                  return null;
                },
                onSaved: (value) => name = value!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Contact Info'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter contact info';
                  }
                  return null;
                },
                onSaved: (value) => contactInfo = value!,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                _supplierService
                    .createSupplier(name, contactInfo)
                    .then((_) => _refreshSuppliers());
                Navigator.of(context).pop();
              }
            },
            child: Text('Add'),
          ),
        ],
      ),
    );
  }

  Future<void> _showEditSupplierDialog(
      BuildContext context, Supplier supplier) async {
    final formKey = GlobalKey<FormState>();
    String name = supplier.name;
    String contactInfo = supplier.contactInfo;

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit Supplier'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                initialValue: name,
                decoration: InputDecoration(labelText: 'Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a name';
                  }
                  return null;
                },
                onSaved: (value) => name = value!,
              ),
              TextFormField(
                initialValue: contactInfo,
                decoration: InputDecoration(labelText: 'Contact Info'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter contact info';
                  }
                  return null;
                },
                onSaved: (value) => contactInfo = value!,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                Supplier updatedSupplier = Supplier(
                  supplierId: supplier.supplierId,
                  name: name,
                  contactInfo: contactInfo,
                  totalOrders: supplier.totalOrders,
                  avgDeliveryDays: supplier.avgDeliveryDays,
                  totalRevenue: supplier.totalRevenue,
                );
                _supplierService
                    .updateSupplier(updatedSupplier)
                    .then((_) => _refreshSuppliers());
                Navigator.of(context).pop();
              }
            },
            child: Text('Save'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteSupplier(int supplierId) async {
    bool confirm = await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Supplier'),
        content: Text('Are you sure you want to delete this supplier?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm) {
      _supplierService
          .deleteSupplier(supplierId)
          .then((_) => _refreshSuppliers());
    }
  }
}
