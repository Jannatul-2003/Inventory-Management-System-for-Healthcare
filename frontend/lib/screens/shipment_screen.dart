import 'package:flutter/material.dart';
import 'package:frontend/services/shipment_service.dart';
import 'package:frontend/widgets/shipment_card.dart';
import 'package:intl/intl.dart';
import 'package:frontend/models/shipment.dart';

class ShipmentsScreen extends StatefulWidget {
  const ShipmentsScreen({super.key});

  @override
  State<ShipmentsScreen>  createState() => _ShipmentsScreenState();
}

class _ShipmentsScreenState extends State<ShipmentsScreen> {
  final ShipmentService _shipmentService = ShipmentService();
  late Future<List<Shipment>> _shipmentsFuture;

  @override
  void initState() {
    super.initState();
    _refreshShipments();
  }

  void _refreshShipments() {
    setState(() {
      _shipmentsFuture = _shipmentService.getShipments();
    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: Text('Shipments'),
          floating: true,
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () => _showCreateShipmentDialog(context),
            ),
          ],
        ),
        FutureBuilder<List<Shipment>>(
          future: _shipmentsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              );
            }

            if (snapshot.hasError) {
              return SliverFillRemaining(
                child: Center(child: Text('Error loading shipments')),
              );
            }

            final shipments = snapshot.data!;

            return SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => ShipmentCard(
                  shipment: shipments[index],
                  onUpdateStatus: (status) async {
                    try {
                      await _shipmentService.updateShipmentStatus(
                        shipments[index].shipmentId,
                        status,
                      );
                      _refreshShipments();
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to update shipment status')),
                      );
                    }
                  },
                ),
                childCount: shipments.length,
              ),
            );
          },
        ),
      ],
    );
  }

  Future<void> _showCreateShipmentDialog(BuildContext context) async {
    final formKey = GlobalKey<FormState>();
    int orderId = 0;
    DateTime shipmentDate = DateTime.now();

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Create Shipment'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Order ID'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Order ID is required';
                  }
                  int? id = int.tryParse(value);
                  if (id == null || id <= 0) {
                    return 'Please enter a valid Order ID';
                  }
                  return null;
                },
                onSaved: (value) => orderId = int.parse(value!),
              ),
              SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: shipmentDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(Duration(days: 365)),
                  );
                  if (date != null) {
                    setState(() => shipmentDate = date);
                  }
                },
                child: Row(
                  children: [
                    Icon(Icons.calendar_today),
                    SizedBox(width: 8),
                    Text(DateFormat('yyyy-MM-dd').format(shipmentDate)),
                  ],
                ),
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
            child: Text('Create'),
            onPressed: () async {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                try {
                  await _shipmentService.createShipment(orderId, shipmentDate);
                  _refreshShipments();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to create shipment')),
                  );
                }
              }
            },
          ),
        ],
      ),
    );
  }
}
