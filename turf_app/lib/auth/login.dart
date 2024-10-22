import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // Secure Storage

class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String userType = 'user'; // Default userType is 'user'
  bool loading = false;
  String errorMessage = '';
  String successMessage = '';
  final FlutterSecureStorage storage =
      FlutterSecureStorage(); // Secure storage for token

  // Submit function
  void handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        loading = true;
        errorMessage = '';
        successMessage = '';
      });

      // Prepare form data
      final formData = {
        'email': emailController.text.trim(), // Trim to avoid whitespace
        'password': passwordController.text.trim(),
        'userType': userType,
      };

      // Debugging: print form data to check what's being sent
      print('FormData: $formData');

      try {
        // Send POST request to backend
        final response = await http.post(
          Uri.parse(
              'https://turf-booking-app-e7rc.onrender.com/auth/login'), // Replace with your actual API endpoint
          headers: {'Content-Type': 'application/json'},
          body: json.encode(formData),
        );

        // Debugging: Log response status and body
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');

        // Check if response is JSON
        if (response.headers['content-type'] ==
            'application/json; charset=utf-8') {
          final data = json.decode(response.body);

          // Handle success and failure responses
          if (response.statusCode == 200) {
            setState(() {
              successMessage = 'Login successful!';
            });
            Navigator.pushReplacementNamed(context, '/ld/land');

            // Store token securely
            await storage.write(key: 'userToken', value: data['token']);
          } else {
            setState(() {
              errorMessage =
                  data['message'] ?? 'Login failed. Please try again.';
            });
          }
        } else {
          setState(() {
            errorMessage = 'Unexpected server response. Please try again.';
          });
        }
      } catch (error) {
        setState(() {
          errorMessage = 'Network error: $error';
        });
      } finally {
        setState(() {
          loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
          ),
          width: MediaQuery.of(context).size.width * 0.3,
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Sign In',
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(height: 15),
                // Dropdown for user type
                DropdownButtonFormField<String>(
                  value: userType,
                  onChanged: (newValue) {
                    setState(() {
                      userType = newValue!;
                      print('Selected userType: $userType'); // Debugging
                    });
                  },
                  items: const [
                    DropdownMenuItem(
                      value: 'user',
                      child: Text('User'),
                    ),
                    DropdownMenuItem(
                      value: 'turfOwner',
                      child: Text('Turf Owner'),
                    ),
                  ],
                  decoration: const InputDecoration(
                    labelText: 'Register As',
                  ),
                ),
                const SizedBox(height: 10),
                // Email input
                TextFormField(
                  controller: emailController,
                  decoration: const InputDecoration(labelText: 'Email'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Email is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 10),
                // Password input
                TextFormField(
                  controller: passwordController,
                  decoration: const InputDecoration(labelText: 'Password'),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Password is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 25),
                // Login button with loading state
                loading
                    ? const CircularProgressIndicator()
                    : ElevatedButton(
                        onPressed: handleSubmit,
                        child: const Text('Sign In'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                const SizedBox(height: 10),
                // Error message display
                if (errorMessage.isNotEmpty)
                  Text(
                    errorMessage,
                    style: const TextStyle(color: Colors.red),
                  ),
                if (successMessage.isNotEmpty)
                  Text(
                    successMessage,
                    style: const TextStyle(color: Colors.green),
                  ),
                const SizedBox(height: 10),
                // Redirect to registration page
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/auth/register');
                  },
                  child: const Text('Don\'t have an account? Sign Up'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
