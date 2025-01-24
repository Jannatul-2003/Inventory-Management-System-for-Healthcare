class Product {
  final int productId;
  final String name;
  final String description;
  final double price;
  final int currentStock;
  final String stockStatus;

  Product({
    required this.productId,
    required this.name,
    required this.description,
    required this.price,
    required this.currentStock,
    required this.stockStatus,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      productId: json['product_id'],
      name: json['name'],
      description: json['description'] ?? '',
      price: json['price'].toDouble(),
      currentStock: json['current_stock'] ?? 0,
      stockStatus: json['stock_status'] ?? 'Unknown',
    );
  }
}