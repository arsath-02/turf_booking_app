import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class TurfDetailsPage extends StatefulWidget {
  final String turfId;

  const TurfDetailsPage({Key? key, required this.turfId}) : super(key: key);

  @override
  _TurfDetailsPageState createState() => _TurfDetailsPageState();
}

class _TurfDetailsPageState extends State<TurfDetailsPage> {
  bool loading = false;
  String errorMessage = '';
  String successMessage = '';
  Map<String, dynamic> turfData = {};

  @override
  void initState() {
    super.initState();
    fetchTurfDetails();
  }

  Future<void> fetchTurfDetails() async {
    setState(() {
      loading = true;
      errorMessage = '';
    });

    try {
      final response = await http.get(Uri.parse('http://localhost:3000/turfs/${widget.turfId}'));

      if (response.statusCode == 200) {
        setState(() {
          turfData = json.decode(response.body)['data'];
        });
      } else {
        setState(() {
          errorMessage = 'Failed to fetch turf details. Status: ${response.statusCode}';
          // Provide default values
          turfData = getDefaultTurfData();
        });
      }
    } catch (error) {
      setState(() {
        errorMessage = 'Network error: ${error.toString()}';
        // Provide default values on error
        turfData = getDefaultTurfData();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Map<String, dynamic> getDefaultTurfData() {
    return {
      'image': 'https://example.com/default-image.jpg', // Default image URL
      'event': 'Football Match',
      'team': 'Team A vs Team B',
      'location': 'Unknown Location',
      'startTime': 'N/A',
      'endTime': 'N/A',
      'rating': 3,
      'owner': {
        'firstname': 'John',
        'lastname': 'Doe',
        'city': 'Unknown City',
        'phonenumber': 'N/A',
        'email': 'N/A'
      },
      'comments': 'No comments available.',
    };
  }

  Future<void> handleBooking() async {
    if (loading) return; // Prevent multiple submissions

    setState(() {
      loading = true;
      errorMessage = '';
      successMessage = '';
    });

    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/bookings/new'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'turfId': turfData['id'], 'userId': '456'}), // Adjust as necessary
      );

      if (response.statusCode == 200) {
        setState(() {
          successMessage = 'Booking successful!';
        });
      } else {
        final data = json.decode(response.body);
        setState(() {
          errorMessage = data['message'] ?? 'Booking failed. Please try again.';
        });
      }
    } catch (error) {
      setState(() {
        errorMessage = 'Network error: ${error.toString()}';
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Turf Details'),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
          ),
          width: MediaQuery.of(context).size.width * 0.9,
          child: loading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10.0),
                        child: Image.network(
                          turfData['image'] ?? 'https://example.com/default-image.jpg',
                          height: 200,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Center(
                              child: CircularProgressIndicator(
                                value: loadingProgress.expectedTotalBytes != null
                                    ? loadingProgress.cumulativeBytesLoaded / (loadingProgress.expectedTotalBytes ?? 1)
                                    : null,
                              ),
                            );
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return const Center(child: Icon(Icons.error)); // Placeholder for image load error
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          const Icon(Icons.sports_cricket, color: Colors.black),
                          const SizedBox(width: 8),
                          Text(
                            '${turfData['event']} : ${turfData['team']}',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const Spacer(),
                          const Text('Live', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.location_on, color: Colors.black),
                          const SizedBox(width: 8),
                          Text(turfData['location'] ?? 'N/A'),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text('Start : ${turfData['startTime'] ?? 'N/A'}', style: const TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(width: 16),
                          Text('End : ${turfData['endTime'] ?? 'N/A'}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: List.generate(5, (index) {
                          return Icon(
                            index < (turfData['rating'] ?? 0) ? Icons.star : Icons.star_border,
                            color: Colors.yellow,
                          );
                        }),
                      ),
                      const SizedBox(height: 16),
                      const Text('Owner', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(
                        'Name: ${turfData['owner']['firstname']} ${turfData['owner']['lastname']}\n'
                        'City: ${turfData['owner']['city']}\n'
                        'Contact: ${turfData['owner']['phonenumber']}\n'
                        'Email: ${turfData['owner']['email']}',
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 16),
                      const Text('Comments', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(turfData['comments'] ?? 'No comments available.', style: const TextStyle(fontSize: 16)),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: handleBooking,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.purple,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Book Now'),
                      ),
                      const SizedBox(height: 10),
                      Text(errorMessage, style: const TextStyle(color: Colors.red)),
                      Text(successMessage, style: const TextStyle(color: Colors.green)),
                      const SizedBox(height: 10),
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: const Text('Back'),
                      ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }
}
