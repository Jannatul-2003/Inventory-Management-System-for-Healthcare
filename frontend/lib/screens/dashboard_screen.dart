import 'package:flutter/material.dart';
// import 'package:charts_flutter/flutter.dart' as charts;
import 'package:frontend/models/dashboard_metrics.dart';
import 'package:frontend/services/dashboard_service.dart';
import 'package:frontend/widgets/low_stock_table.dart';
import 'package:frontend/widgets/metric_card.dart';
import 'package:frontend/widgets/revenue_chart.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final DashboardService _dashboardService = DashboardService();
  late Future<DashboardMetrics> _metricsFuture;

  @override
  void initState() {
    super.initState();
    _metricsFuture = _dashboardService.getDashboardMetrics();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<DashboardMetrics>(
      future: _metricsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Error loading dashboard'));
        }

        final metrics = snapshot.data!;
        
        return CustomScrollView(
          slivers: [
            SliverAppBar(
              title: Text('Dashboard'),
              floating: true,
            ),
            SliverPadding(
              padding: EdgeInsets.all(16.0),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16.0,
                  crossAxisSpacing: 16.0,
                  childAspectRatio: 1.5,
                ),
                delegate: SliverChildListDelegate([
                  MetricCard(
                    title: 'Total Products',
                    value: metrics.totalProducts.toString(),
                    icon: Icons.inventory,
                    color: Theme.of(context).primaryColor,
                  ),
                  MetricCard(
                    title: 'Low Stock Items',
                    value: metrics.lowStockCount.toString(),
                    icon: Icons.warning,
                    color: Colors.orange,
                  ),
                  MetricCard(
                    title: 'Pending Orders',
                    value: metrics.pendingOrders.toString(),
                    icon: Icons.shopping_cart,
                    color: Colors.blue,
                  ),
                  MetricCard(
                    title: 'Monthly Revenue',
                    value: '\$${metrics.monthlyRevenue.toStringAsFixed(2)}',
                    icon: Icons.attach_money,
                    color: Colors.green,
                  ),
                ]),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: RevenueChart(data: metrics.revenueData),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: LowStockTable(products: metrics.lowStockProducts),
              ),
            ),
          ],
        );
      },
    );
  }
}