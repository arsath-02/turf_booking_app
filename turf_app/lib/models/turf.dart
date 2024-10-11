class Turf {
  final String id;
  final String name;
  final String location;
  final double price;
  final double rating;
  final String contactNumber;
  final String pricePerHour;
  final String city;
  final String imageUrl;
  final String category; 

  Turf({
    required this.id,
    required this.name,
    required this.location,
    required this.price,
    required this.rating,
    required this.contactNumber,
    required this.pricePerHour,
    required this.city,
    required this.imageUrl,
    required this.category,
  });

  factory Turf.fromJson(Map<String, dynamic> json) {
    return Turf(
      id: json['_id'] ?? '',  // Default empty string if _id is null
      name: json['name'] ?? 'Unknown Turf',  // Default name
      location: json['location'] ?? 'Unknown Location', // Default location
      price: json['price'] != null ? double.tryParse(json['price'].toString()) ?? 0.0 : 0.0,  // Safe parsing
      rating: json['rating'] != null ? double.tryParse(json['rating'].toString()) ?? 0.0 : 0.0, // Safe parsing
      contactNumber: json['contactnumber'] ?? 'No Contact', // Default contact number
      pricePerHour: json['pricePerHour']?.toString() ?? '0', // Default to 0 if null
      city: json['city'] ?? 'Unknown City', // Default city
      imageUrl: json.containsKey('_id') ? 'http://localhost:3000/turfs/image/${json['_id']}' : 'https://placehold.co/150', // Fallback image
      category: json['category'] ?? 'General', // Default category
    );
  }
}