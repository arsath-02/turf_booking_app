import 'package:flutter/material.dart';
import 'auth/register.dart';  // Import the Register page
import 'auth/login.dart';     // Import the Login page
import 'turf/turf_details.dart'; // Import the TurfDetailsPage
import 'comminity/cm.dart'; // Import the Cm page
import 'find_match/find.dart'; // Import the FindMatch page
import 'ld/land.dart'; // Import the Land page

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Turf App',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      initialRoute: '/', // Set the initial route
      routes: {
        '/': (context) => const HomePage(),                // Home Page route
        '/auth/register': (context) => const Register(),   // Register route
        '/auth/login': (context) => const Login(),         // Login route
        '/find_match/find': (context) => const FindMatch(), 
        '/ld/land': (context) => const LandPage(),          // Route to the Land page (Offers)
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/turf/details') {
          final turfId = settings.arguments as String; // Cast the arguments to String
          return MaterialPageRoute(
            builder: (context) => TurfDetailsPage(turfId: turfId), // Pass turfId to TurfDetailsPage
          );
        }
        if (settings.name == '/comminity/cm') {
          // Define a list of communities to pass to Cm
          final List<Map<String, dynamic>> communities = [
            {'name': 'Team Champs', 'time': 'Sun, 12.40pm', 'newMessages': '+5 new messages'},
            {'name': 'Cric Freaks', 'time': 'Sun, 12.40pm', 'newMessages': '+2 new messages'},
            {'name': 'Badminton', 'time': 'Sun, 12.40pm', 'newMessages': '+2 new messages'},
            {'name': 'Tennis', 'time': 'Sun, 12.40pm', 'newMessages': '+2 new messages'},
            {'name': 'Volleyball', 'time': 'Sun, 12.40pm', 'newMessages': '+2 new messages'},
            {'name': 'Football', 'time': 'Sun, 12.40pm', 'newMessages': '+2 new messages'},
            {'name': 'Cricket', 'time': 'Sun, 12.40pm', 'newMessages': '+2 new messages'},
          ];

          return MaterialPageRoute(
            builder: (context) => Cm(communities: communities), // Pass the list to Cm
          );
        }
        return null; // Return null for unknown routes
      },
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            buildNavigationButton(context, '/auth/login', 'Go to Login'),
            const SizedBox(height: 10),
            buildNavigationButton(context, '/auth/register', 'Go to Register'),
            const SizedBox(height: 10),
            buildNavigationButton(context, '/turf/details', 'Go to Turf Details', arguments: 'someTurfId'),
            const SizedBox(height: 10),
            buildNavigationButton(context, '/community/cm', 'Go to Communities Page'),
            const SizedBox(height: 10),
            buildNavigationButton(context, '/find_match/find', 'Find Team'),
            const SizedBox(height: 10),
            buildNavigationButton(context, '/ld/land', 'landing page'), // Navigate to Offers (Land) Page
          ],
        ),
      ),
    );
  }

  // Helper function for building navigation buttons
  ElevatedButton buildNavigationButton(BuildContext context, String route, String text, {Object? arguments}) {
    return ElevatedButton(
      onPressed: () {
        Navigator.pushNamed(context, route, arguments: arguments); // Navigate to the provided route
      },
      child: Text(text),
    );
  }
}
