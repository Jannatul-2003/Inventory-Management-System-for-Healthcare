import 'package:flutter/material.dart';
import 'package:frontend/models/order.dart';
import 'package:frontend/services/order_service.dart';
import 'package:frontend/widgets/order_card.dart';
import 'package:frontend/widgets/order_details_dialog.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final OrderService _orderService = OrderService();
  late Future<List<Order>> _ordersFuture;

  @override
  void initState() {
    super.initState();
    _ordersFuture = _orderService.getOrders();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Order>>(
      future: _ordersFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Error loading orders'));
        }

        final orders = snapshot.data!;

        return CustomScrollView(
          slivers: [
            SliverAppBar(
              title: Text('Orders'),
              floating: true,
              actions: [
                IconButton(
                  icon: Icon(Icons.filter_list),
                  onPressed: () => _showFilterDialog(context),
                ),
              ],
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => OrderCard(
                  order: orders[index],
                  onTap: () => _showOrderDetails(context, orders[index]),
                ),
                childCount: orders.length,
              ),
            ),
          ],
        );
      },
    );
  }

  void _showOrderDetails(BuildContext context, Order order) {
    showDialog(
      context: context,
      builder: (context) => OrderDetailsDialog(order: order),
    );
  }

  void _showFilterDialog(BuildContext context) {
    // Implement filter dialog
  }
}
