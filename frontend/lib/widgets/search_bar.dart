import 'package:flutter/material.dart';

class SearchBar extends StatelessWidget {
  final Function(String) onChanged;
  final String hintText;

  const SearchBar({super.key, 
    required this.onChanged,
    required this.hintText,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: Icon(Icons.search),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
        filled: true,
        fillColor: Theme.of(context).cardColor,
      ),
    );
  }
}