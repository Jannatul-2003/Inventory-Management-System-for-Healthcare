// lib/widgets/product_form.dart
import 'package:flutter/material.dart';
import 'package:frontend/models/product.dart';

class ProductForm extends StatefulWidget {
  final Product? product;
  final Function(Product) onSubmit;

  const ProductForm({
    super.key,
    this.product,
    required this.onSubmit,
  });

  @override
  State<ProductForm> createState() => _ProductFormState();
}

class _ProductFormState extends State<ProductForm> {
  late TextEditingController nameController;
  late TextEditingController descriptionController;
  late TextEditingController priceController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.product?.name ?? '');
    descriptionController = TextEditingController(text: widget.product?.description ?? '');
    priceController = TextEditingController(
      text: widget.product?.price.toString() ?? '',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextFormField(
            controller: nameController,
            decoration: InputDecoration(labelText: 'Name'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a name';
              }
              return null;
            },
          ),
          TextFormField(
            controller: descriptionController,
            decoration: InputDecoration(labelText: 'Description'),
            maxLines: 3,
          ),
          TextFormField(
            controller: priceController,
            decoration: InputDecoration(labelText: 'Price'),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a price';
              }
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              final product = Product(
                productId: widget.product?.productId ?? 0,
                name: nameController.text,
                description: descriptionController.text,
                price: double.parse(priceController.text),
                currentStock: widget.product?.currentStock ?? 0,
                stockStatus: widget.product?.stockStatus ?? 'Unknown',
              );
              widget.onSubmit(product);
            },
            child: Text(widget.product == null ? 'Create' : 'Update'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    nameController.dispose();
    descriptionController.dispose();
    priceController.dispose();
    super.dispose();
  }
}