import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:turf_app/models/turf.dart';
import 'auth/register.dart';
import 'auth/login.dart';
import 'screens/turf_booking_screen.dart';
import 'booking/book.dart';
//import 'screens/TurfDetailsScreen.dart';

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
        textTheme: GoogleFonts.poppinsTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomePage(),
        '/auth/register': (context) => const Register(),
        '/auth/login': (context) => const Login(),
        '/turfs/register': (context) => const TurfRegisterPage(),
        '/success': (context) => const SuccessPage(),
        '/profile': (context) => const ProfilePage(),
        '/turfs': (context) => TurfBookingScreen(),
        '/bookings': (context) => const BookingsPage(),
//        'Turf/details': (context) =>  TurfDetailScreen(turf: Turf,),
        '/bookings/new/:turfId': (context) => const BookingFormPage(),
        '/bookings/details': (context) => const BookingDetailsPage(),
        '/update-booking': (context) => const BookingsUpdatePage(),
        '/payments': (context) => const BookingsPaymentsPage(),
        '/bookings/screen': (context) =>
            BookingScreen(), // New route for BookingScreen
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
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/auth/register');
              },
              child: const Text('Go to Register'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/turfs');
              },
              child: const Text('Go to Turf Booking Screen'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context,
                    '/bookings/screen'); // Button to navigate to BookingScreen
              },
              child: const Text('Go to Booking Screen'),
            ),
          ],
        ),
      ),
    );
  }
}

// Turf Register Page
class TurfRegisterPage extends StatelessWidget {
  const TurfRegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Turf Register')),
      body: const Center(child: Text('Turf Register Page')),
    );
  }
}

// Success Page
class SuccessPage extends StatelessWidget {
  const SuccessPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Success')),
      body: const Center(child: Text('Success Page')),
    );
  }
}

// Profile Page
class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: const Center(child: Text('Profile Page')),
    );
  }
}

// Bookings Page
class BookingsPage extends StatelessWidget {
  const BookingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bookings')),
      body: const Center(child: Text('Bookings Page')),
    );
  }
}

// Booking Form Page
class BookingFormPage extends StatelessWidget {
  const BookingFormPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Booking Form')),
      body: const Center(child: Text('Booking Form Page')),
    );
  }
}

// Booking Details Page
class BookingDetailsPage extends StatelessWidget {
  const BookingDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Booking Details')),
      body: const Center(child: Text('Booking Details Page')),
    );
  }
}

// Booking Update Page
class BookingsUpdatePage extends StatelessWidget {
  const BookingsUpdatePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Update Booking')),
      body: const Center(child: Text('Update Booking Page')),
    );
  }
}

// Payments Page
class BookingsPaymentsPage extends StatelessWidget {
  const BookingsPaymentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payments')),
      body: const Center(child: Text('Payments Page')),
    );
  }
}

// Booking Screen

