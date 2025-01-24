// import 'package:flutter/material.dart';
// import 'package:frontend/screens/dashboard_screen.dart';
// import 'package:frontend/screens/products_screen.dart';

// void main() {
//   runApp(InventoryApp());
// }

// class InventoryApp extends StatelessWidget {
//   const InventoryApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Healthcare Inventory Manager',
//       theme: ThemeData(
//         primaryColor: Color(0xFF501E31),
//         colorScheme: ColorScheme.fromSwatch().copyWith(
//           secondary: Color(0xFFD95A40),
//           background: Color(0xFFF0D06B),
//         ),
//       ),
//       home: MainLayout(),
//     );
//   }
// }

// class MainLayout extends StatefulWidget {
//   const MainLayout({super.key});

//   @override
//   State<MainLayout> createState() => _MainLayoutState();
// }

// class _MainLayoutState extends State<MainLayout> {
//   int _selectedIndex = 0;
//   final String baseUrl = 'http://localhost:8000/api/v1';

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Row(
//         children: [
//           NavigationRail(
//             backgroundColor: Color(0xFF577C80),
//             selectedIndex: _selectedIndex,
//             onDestinationSelected: (int index) {
//               setState(() {
//                 _selectedIndex = index;
//               });
//             },
//             labelType: NavigationRailLabelType.all,
//             destinations: const [
//               NavigationRailDestination(
//                 icon: Icon(Icons.dashboard),
//                 label: Text('Dashboard'),
//               ),
//               NavigationRailDestination(
//                 icon: Icon(Icons.inventory),
//                 label: Text('Products'),
//               ),
//               // Add other navigation items
//             ],
//           ),
//           Expanded(
//             child: _buildBody(),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildBody() {
//     switch (_selectedIndex) {
//       case 0:
//         return DashboardScreen();
//       case 1:
//         return ProductsScreen(baseUrl: baseUrl,);
//       default:
//         return DashboardScreen();
//     }
//   }
// }
// lib/main.dart
import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';
import 'screens/products_screen.dart';
import 'screens/orders_screen.dart';
import 'screens/suppliers_screen.dart';
import 'screens/customers_screen.dart';
import 'screens/inventory_screen.dart';
import 'screens/payments_screen.dart';
import 'screens/shipment_screen.dart';

void main() {
  runApp(InventoryApp());
}

class InventoryApp extends StatelessWidget {
  const InventoryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Healthcare Inventory Manager',
      theme: ThemeData(
        primaryColor: Color(0xFF501E31),
        colorScheme: ColorScheme.fromSwatch().copyWith(
          secondary: Color(0xFFD95A40),
          surface: Color(0xFFF0D06B),
        ),
      ),
      home: MainLayout(),
    );
  }
}

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    DashboardScreen(),
    ProductsScreen(),
    InventoryScreen(),
    OrdersScreen(),
    ShipmentsScreen(),
    SuppliersScreen(),
    CustomersScreen(),
    PaymentsScreen(),
  ];

  final List<NavigationRailDestination> _destinations = [
    NavigationRailDestination(
      icon: Icon(Icons.dashboard),
      label: Text('Dashboard'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.inventory),
      label: Text('Products'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.store),
      label: Text('Inventory'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.shopping_cart),
      label: Text('Orders'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.local_shipping),
      label: Text('Shipments'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.people_alt),
      label: Text('Suppliers'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.person),
      label: Text('Customers'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.payment),
      label: Text('Payments'),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            backgroundColor: Color(0xFF577C80),
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            labelType: NavigationRailLabelType.all,
            destinations: _destinations,
          ),
          VerticalDivider(thickness: 1, width: 1),
          Expanded(
            child: _screens[_selectedIndex],
          ),
        ],
      ),
    );
  }
}