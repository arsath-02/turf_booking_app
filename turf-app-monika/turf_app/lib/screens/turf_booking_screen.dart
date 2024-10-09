import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../services/turf_service.dart';
import '../models/turf.dart';
import '../screens/TurfDetailsScreen.dart';

class TurfBookingScreen extends StatefulWidget {
  @override
  _TurfBookingScreenState createState() => _TurfBookingScreenState();
}

class _TurfBookingScreenState extends State<TurfBookingScreen> {
  String _selectedCategory = 'all'; // Initially fetch all categories
  String _currentCity = 'Choose Location'; // Default city name
  late Future<List<Turf>> _turfs; // Future to hold the fetched turfs
  // ignore: unused_field
  List<Turf> _filteredTurfs = []; // List to hold filtered turfs
  String _searchQuery = ''; // Variable to hold the search query

  @override
  void initState() {
    super.initState();
    _fetchTurfs(); // Fetch all turfs initially
  }

  void _fetchTurfs({String category = 'all'}) {
    TurfService turfService = TurfService();
    setState(() {
      _turfs = turfService.fetchAllTurfs(category: category); // Fetch turfs based on category
    });
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Location services are disabled.')));
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Location permissions are denied.')));
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Location permissions are permanently denied.')));
      return;
    }

    Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);

    // Get city name from the position (you might need to implement reverse geocoding)
    String currentCity = 'Erode'; // Replace with actual city name fetched from geocoding.

    setState(() {
      _currentCity = currentCity; // Update city and fetch new turfs
      _fetchTurfs(); // Refetch turfs after location is updated
    });
  }

  // Filter turfs based on the search query
  void _filterTurfs(String query) {
    setState(() {
      _searchQuery = query.toLowerCase();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_currentCity), // Display current city
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton(
              onPressed: _getCurrentLocation,
              child: Text('Choose Current Location'),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search',
                border: OutlineInputBorder(),
              ),
              onChanged: _filterTurfs, // Filter turfs based on input
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _selectedCategory = 'Coaching';
                    _fetchTurfs(category: _selectedCategory); // Fetch turfs for 'coaching' category
                  });
                },
                child: Text('Coaching'),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _selectedCategory = 'Turf';
                    _fetchTurfs(category: _selectedCategory); // Fetch turfs for 'turfs' category
                  });
                },
                child: Text('Turfs'),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _selectedCategory = 'Event';
                    _fetchTurfs(category: _selectedCategory); // Fetch turfs for 'events' category
                  });
                },
                child: Text('Events'),
              ),
            ],
          ),
          Expanded(
            child: FutureBuilder<List<Turf>>(
              future: _turfs,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  print('Error: ${snapshot.error}');
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No turfs found'));
                } else {
                  List<Turf> turfs = snapshot.data!;

                  // Filter turfs based on the search query
                  if (_searchQuery.isNotEmpty) {
                    turfs = turfs.where((turf) {
                      return turf.name.toLowerCase().contains(_searchQuery) ||
                          turf.city.toLowerCase().contains(_searchQuery);
                    }).toList();
                  }

                  return ListView.builder(
  itemCount: turfs.length,
  itemBuilder: (ctx, index) {
    final turf = turfs[index];
    return ListTile(
      leading: Image.network(turf.imageUrl),
      title: Text(turf.name),
      subtitle: Text('${turf.location} - ${turf.city}\nPrice: ${turf.price}\nRating: ${turf.rating}'),
      trailing: TextButton(
        onPressed: () {
          // Navigate to turf details screen with the selected turf ID
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TurfDetailsScreen(turfId: turf.id),
            ),
          );
        },
        child: Text('Review'),
      ),
    );
  },
);

                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
