import 'package:flutter/material.dart';
import '../models/turf.dart';
import '../services/turf_service.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class TurfDetailsScreen extends StatefulWidget {
  final String turfId; // Turf ID to fetch details

  TurfDetailsScreen({required this.turfId});

  @override
  _TurfDetailsScreenState createState() => _TurfDetailsScreenState();
}

class _TurfDetailsScreenState extends State<TurfDetailsScreen> {
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _startTimeController = TextEditingController();
  final TextEditingController _endTimeController = TextEditingController();
  bool _isHovered = false;

  late Future<Turf> _turfFuture; // Store the future to avoid multiple fetching

  @override
  void initState() {
    super.initState();
    // Fetch turf details once and store the Future
    _turfFuture = TurfService().fetchTurfDetails(widget.turfId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Book Your Slot'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context), // Back button
        ),
      ),
      body: FutureBuilder<Turf>(
        future: _turfFuture, // Use the stored Future
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return Center(child: Text('No turf details found.'));
          } else {
            Turf turf = snapshot.data!; // Get turf data

            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Image.network(
                      turf.imageUrl,
                      width: double.infinity,
                      height: 200,
                      fit: BoxFit.cover,
                    ),
                    SizedBox(height: 16),
                    Text('Turf Details', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    _buildDetailBox(turf), // Combined detail box
                    SizedBox(height: 16),
                    Text('Book Your slots here:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    // Date input field
                    TextFormField(
                      controller: _dateController,
                      decoration: InputDecoration(
                        labelText: 'Date of Booking',
                        prefixIcon: FaIcon(FontAwesomeIcons.calendarAlt),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      readOnly: true,
                      onTap: () async {
                        DateTime? pickedDate = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime(2020),
                          lastDate: DateTime(2100),
                        );
                        if (pickedDate != null) {
                          setState(() {
                            _dateController.text = "${pickedDate.day}-${pickedDate.month}-${pickedDate.year}";
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 10),

                    // Starting time input field
                    TextFormField(
                      controller: _startTimeController,
                      decoration: InputDecoration(
                        labelText: 'Starting Time',
                        prefixIcon: FaIcon(FontAwesomeIcons.clock),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      readOnly: true,
                      onTap: () async {
                        TimeOfDay? pickedTime = await showTimePicker(
                          context: context,
                          initialTime: TimeOfDay.now(),
                        );
                        if (pickedTime != null) {
                          setState(() {
                            _startTimeController.text = pickedTime.format(context);
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 10),

                    // Ending time input field
                    TextFormField(
                      controller: _endTimeController,
                      decoration: InputDecoration(
                        labelText: 'Ending Time',
                        prefixIcon: FaIcon(FontAwesomeIcons.clock),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      readOnly: true,
                      onTap: () async {
                        TimeOfDay? pickedTime = await showTimePicker(
                          context: context,
                          initialTime: TimeOfDay.now(),
                        );
                        if (pickedTime != null) {
                          setState(() {
                            _endTimeController.text = pickedTime.format(context);
                          });
                        }
                      },
                    ),
                    _buildWeatherInfo('Weather', 'cloudy'), // Replace with dynamic weather data if available
                    SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // Handle payment process here
                      },
                      child: Text('Proceed To Payment'),
                    ),
                  ],
                ),
              ),
            );
          }
        },
      ),
    );
  }

  Widget _buildDetailBox(Turf turf) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8.0), // Space around the box
        padding: const EdgeInsets.all(16.0), // Padding inside the box
        decoration: BoxDecoration(
          color: _isHovered ? Colors.grey[200] : Colors.white, // Change color on hover
          borderRadius: BorderRadius.circular(12.0), // Rounded corners
          boxShadow: [
            BoxShadow(
              color: Colors.black26, // Shadow color
              blurRadius: 6.0, // Shadow blur radius
              offset: Offset(0, 2), // Shadow position
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Turf name:', turf.name),
            _buildDetailRow('Location:', turf.location),
            _buildDetailRow('Price:', 'INR ${turf.price.toStringAsFixed(2)}'),
            SizedBox(height: 8),
            _buildDetailRow('Rating:', ''),
          _buildStarRating(turf.rating),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0), // Space between rows
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
          Text(value),
        ],
      ),
    );
  }

  Widget _buildStarRating(double rating) {
    return Row(
      children: List.generate(5, (index) {
        return Icon(
          index < rating.round() ? Icons.star : Icons.star_border,
          color: Colors.yellow,
        );
      }),
    );
  }

  Widget _buildWeatherInfo(String label, String weather) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[700])),
          SizedBox(width: 8),
          Chip(
            label: Text(weather, style: TextStyle(color: Colors.white)),
            backgroundColor: Colors.black,
          ),
        ],
      ),
    );
  }
}
