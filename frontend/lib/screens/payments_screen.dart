import 'package:flutter/material.dart';
import 'package:frontend/models/payment.dart';
import 'package:frontend/services/payment_service.dart';
import 'package:frontend/widgets/payment_card.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  final PaymentService _paymentService = PaymentService();
  late Future<List<Payment>> _paymentsFuture;

  @override
  void initState() {
    super.initState();
    _refreshPayments();
  }

  void _refreshPayments() {
    setState(() {
      _paymentsFuture = _paymentService.getPayments();
    });
  }

  Future<void> _showRecordPaymentDialog(BuildContext context) async {
    final formKey = GlobalKey<FormState>();
    int orderId = 0;
    double amount = 0.0;

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Record Payment'),
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
              TextFormField(
                decoration: InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Amount is required';
                  }
                  double? val = double.tryParse(value);
                  if (val == null || val <= 0) {
                    return 'Please enter a valid amount';
                  }
                  return null;
                },
                onSaved: (value) => amount = double.parse(value!),
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
                  await _paymentService.recordPayment(orderId, amount);
                  _refreshPayments();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to record payment')),
                  );
                }
              }
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: Text('Payments'),
          floating: true,
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () => _showRecordPaymentDialog(context),
            ),
          ],
        ),
        FutureBuilder<List<Payment>>(
          future: _paymentsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              );
            }

            if (snapshot.hasError) {
              return SliverFillRemaining(
                child: Center(child: Text('Error loading payments')),
              );
            }

            final payments = snapshot.data!;

            return SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => PaymentCard(
                  payment: payments[index],
                  onUpdateStatus: (status) async {
                    try {
                      await _paymentService.updatePaymentStatus(
                        payments[index].paymentId,
                        status,
                      );
                      _refreshPayments();
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                            content: Text('Failed to update payment status')),
                      );
                    }
                  },
                ),
                childCount: payments.length,
              ),
            );
          },
        ),
      ],
    );
  }
}
