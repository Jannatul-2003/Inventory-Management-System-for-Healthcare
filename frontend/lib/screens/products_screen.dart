import 'package:flutter/material.dart';
import 'package:frontend/models/product.dart';
import 'package:frontend/services/product_service.dart';
import 'package:frontend/widgets/product_form.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/widgets/product_card.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<Product> products = [];
  bool isLoading = false;
  final String baseUrl = 'http://localhost:8000/api/v1';

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> _showAddProductDialog(BuildContext context) {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add Product'),
        content: ProductForm(
          onSubmit: (product) async {
            try {
              await ProductService().createProduct(product);
              fetchProducts();
              Navigator.of(context).pop();
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Failed to create product')),
              );
            }
          },
        ),
      ),
    );
  }

  Future<void> fetchProducts() async {
    setState(() => isLoading = true);
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          products = data.map((json) => Product.fromJson(json)).toList();
        });
      }
    } catch (e) {
      // Handle error
      print(e);
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: Text('Products'),
          floating: true,
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () => _showAddProductDialog(context),
            ),
          ],
        ),
        if (isLoading)
          SliverFillRemaining(
            child: Center(child: CircularProgressIndicator()),
          )
        else
          SliverGrid(
            gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 300.0,
              mainAxisSpacing: 10.0,
              crossAxisSpacing: 10.0,
              childAspectRatio: 0.75,
            ),
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                final product = products[index];
                return ProductCard(product: product);
              },
              childCount: products.length,
            ),
          ),
      ],
    );
  }
}