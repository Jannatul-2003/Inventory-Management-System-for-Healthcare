import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:frontend/models/dashboard_metrics.dart';

class RevenueChart extends StatelessWidget {
  final List<RevenueData> data;

  const RevenueChart({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 300,
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Revenue Trend',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              SizedBox(height: 16),
              Expanded(
                child: LineChart(
                  LineChartData(
                    gridData: FlGridData(show: true),
                    titlesData: FlTitlesData(show: true),
                    borderData: FlBorderData(show: true),
                    lineBarsData: [
                      LineChartBarData(
                        spots: data.asMap().entries.map((entry) {
                          return FlSpot(
                            entry.key.toDouble(),
                            entry.value.revenue,
                          );
                        }).toList(),
                        isCurved: true,
                        color: Theme.of(context).primaryColor,
                        barWidth: 2,
                        dotData: FlDotData(show: false),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
