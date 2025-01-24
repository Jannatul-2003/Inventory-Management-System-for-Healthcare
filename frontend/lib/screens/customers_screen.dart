import 'package:flutter/material.dart';
import 'package:frontend/models/customer.dart';
import 'package:frontend/services/customer_service.dart';
import 'package:frontend/widgets/customer_card.dart';

class CustomersScreen extends StatefulWidget {
  const CustomersScreen({super.key});

  @override
  State<CustomersScreen> createState() => _CustomersScreenState();
}

class _CustomersScreenState extends State<CustomersScreen> {
  final CustomerService _customerService = CustomerService();
  late Future<List<Customer>> _customersFuture;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _refreshCustomers();
  }

  void _refreshCustomers() {
    setState(() {
      _customersFuture = _customerService.getCustomers();
    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: Text('Customers'),
          floating: true,
          actions: [
            IconButton(
              icon: Icon(Icons.person_add),
              onPressed: () => _showAddCustomerDialog(context),
            ),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: SearchBar(
              onChanged: (value) => setState(() => _searchQuery = value),
              hintText: 'Search customers...',
            ),
          ),
        ),
        FutureBuilder<List<Customer>>(
          future: _customersFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              );
            }

            if (snapshot.hasError) {
              return SliverFillRemaining(
                child: Center(child: Text('Error loading customers')),
              );
            }

            final customers = snapshot.data!
                .where((customer) => customer.name
                    .toLowerCase()
                    .contains(_searchQuery.toLowerCase()))
                .toList();

            return SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => CustomerCard(
                  customer: customers[index],
                  onEdit: () =>
                      _showEditCustomerDialog(context, customers[index]),
                  onDelete: () => _deleteCustomer(customers[index].customerId),
                ),
                childCount: customers.length,
              ),
            );
          },
        ),
      ],
    );
  }

  Future<void> _showEditCustomerDialog(
      BuildContext context, Customer customer) async {
    final formKey = GlobalKey<FormState>();
    String name = customer.name;
    String contactInfo = customer.contactInfo;

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit Customer'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                initialValue: name,
                decoration: InputDecoration(labelText: 'Name'),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Name is required' : null,
                onSaved: (value) => name = value!,
              ),
              TextFormField(
                initialValue: contactInfo,
                decoration: InputDecoration(labelText: 'Contact Info'),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Contact info is required' : null,
                onSaved: (value) => contactInfo = value!,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            child: Text('Cancel'),
            onPressed: () => Navigator.pop(context),
          ),
          TextButton(
            child: Text('Save'),
            onPressed: () async {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                try {
                  await _customerService.updateCustomer(
                      customer.customerId, name, contactInfo);
                  _refreshCustomers();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to update customer')),
                  );
                }
              }
            },
          ),
        ],
      ),
    );
  }

  Future<void> _showAddCustomerDialog(BuildContext context) async {
    final formKey = GlobalKey<FormState>();
    String name = '';
    String contactInfo = '';

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add Customer'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Name'),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Name is required' : null,
                onSaved: (value) => name = value!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Contact Info'),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Contact info is required' : null,
                onSaved: (value) => contactInfo = value!,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            child: Text('Cancel'),
            onPressed: () => Navigator.pop(context),
          ),
          TextButton(
            child: Text('Add'),
            onPressed: () async {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                try {
                  await _customerService.createCustomer(name, contactInfo);
                  _refreshCustomers();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to create customer')),
                  );
                }
              }
            },
          ),
        ],
      ),
    );
  }

  Future<void> _deleteCustomer(int id) async {
    try {
      await _customerService.deleteCustomer(id);
      _refreshCustomers();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete customer')),
      );
    }
  }
}
