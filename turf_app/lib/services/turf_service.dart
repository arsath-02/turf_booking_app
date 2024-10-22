import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/turf.dart';

class TurfService {
  final String baseUrl = 'https://turf-booking-app-e7rc.onrender.com'; // Ensure this URL is correct

  // Fetch all turfs from API
  Future<List<Turf>> fetchAllTurfs({String category = 'all'}) async {
    try {
      final url = Uri.parse('$baseUrl/turfs');
      print('Fetching turfs from: $url'); // Print the URL being fetched

      final response = await http.get(url);

      if (response.statusCode == 200) {
        List jsonResponse = json.decode(response.body)['data']; // Access the 'data' key

        // Filter by category if it's not 'all'
        if (category != 'all') {
          jsonResponse = jsonResponse.where((turf) => turf['category'] == category).toList();
        }

        return jsonResponse.map((data) => Turf.fromJson(data)).toList();
      } else {
        throw Exception('Failed to load turfs: ${response.statusCode}');
      }
    } catch (e) {
      print('Error occurred: $e');
      throw Exception('Failed to load turfs: $e');
    }
  }

  // Fetch turf details by ID
Future<Turf> fetchTurfDetails(String turfId) async {
  try {
    final url = Uri.parse('$baseUrl/turfs/$turfId'); // Updated URL
    print('Fetching turf details from: $url'); // Print the URL being fetched

    final response = await http.get(url);

    if (response.statusCode == 200) {
      // Decode the response and access the 'data' key as an object
      final jsonResponse = json.decode(response.body);
      
      // Check if the 'data' key exists
      if (jsonResponse['data'] != null) {
        return Turf.fromJson(jsonResponse['data']); // Return the turf object
      } else {
        throw Exception('No turf details found for the provided ID');
      }
    } else {
      throw Exception('Failed to load turf details: ${response.statusCode}');
    }
  } catch (e) {
    print('Error occurred: $e');
    throw Exception('Failed to load turf details: $e');
  }
}

}