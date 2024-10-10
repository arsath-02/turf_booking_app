import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  _RegisterState createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String errorMessage = '';

  // Form fields
  String firstname = '';
  String lastname = '';
  String email = '';
  String password = '';
  String confirmPassword = '';
  String phonenumber = '';
  String userType = 'user'; 
  String city = ''; 

  // Handle form submission
  Future<void> _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      if (password != confirmPassword) {
        setState(() {
          errorMessage = 'Passwords do not match';
        });
        return;
      }

      setState(() {
        _isLoading = true; // Show loading indicator
        errorMessage = ''; // Reset error message
      });

      final requestBody = json.encode({
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'password': password,
        'phonenumber': phonenumber,
        'userType': userType,
        'city': city,
      });

      try {
        final response = await http.post(
          Uri.parse('http://localhost:3000/auth/register'),
          headers: {'Content-Type': 'application/json'},
          body: requestBody,
        );
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');

        if (response.headers['content-type'] == 'application/json') {
          final responseBody = json.decode(response.body);
          if (response.statusCode == 200 && responseBody['success'] == true) {
            // Registration successful
            setState(() {
              _isLoading = false;
              errorMessage = '';
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Registration successful!'),
                backgroundColor: Colors.green,
              ),
            );
            // Navigate to login page after successful registration
            Navigator.pushReplacementNamed(context, '/auth/login');
          } else {
            // If registration fails, show the error message
            setState(() {
              _isLoading = false;
              errorMessage = responseBody['message'] ?? 'Registration failed';
            });
          }
        } 
      } catch (error) {
        setState(() {
          _isLoading = false;
          errorMessage = 'Network error: ${error.toString()}';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Stack(
        children: [
          Center(
            child: SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(15),
                ),
                width: isMobile
                    ? MediaQuery.of(context).size.width * 0.9
                    : MediaQuery.of(context).size.width * 0.25,
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Create An Account',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      const SizedBox(height: 15),
                      // UserType Dropdown
                      DropdownButtonFormField<String>(
                        value: userType,
                        onChanged: (newValue) {
                          setState(() {
                            userType = newValue!;
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
                      const SizedBox(height: 15),
                      TextFormField(
                        decoration:
                            const InputDecoration(labelText: 'First Name'),
                        onSaved: (value) => firstname = value ?? '',
                        validator: (value) =>
                            value!.isEmpty ? 'Required field' : null,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        decoration:
                            const InputDecoration(labelText: 'Last Name'),
                        onSaved: (value) => lastname = value ?? '',
                        validator: (value) =>
                            value!.isEmpty ? 'Required field' : null,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        decoration:
                            const InputDecoration(labelText: 'Email Address'),
                        onSaved: (value) => email = value ?? '',
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Required field';
                          }
                          const emailPattern = r'\w+@\w+\.\w+';
                          if (!RegExp(emailPattern).hasMatch(value)) {
                            return 'Enter a valid email address';
                          }
                          return null;
                        },
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        decoration:
                            const InputDecoration(labelText: 'Phone Number'),
                        onSaved: (value) => phonenumber = value ?? '',
                        validator: (value) =>
                            value!.isEmpty ? 'Required field' : null,
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        decoration:
                            const InputDecoration(labelText: 'Password'),
                        onSaved: (value) => password = value ?? '',
                        validator: (value) =>
                            value!.isEmpty ? 'Required field' : null,
                        obscureText: true,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        decoration: const InputDecoration(
                            labelText: 'Confirm Password'),
                        onSaved: (value) => confirmPassword = value ?? '',
                        validator: (value) =>
                            value!.isEmpty ? 'Required field' : null,
                        obscureText: true,
                      ),
                      const SizedBox(height: 10),
                      if (userType == 'turfOwner')
                        TextFormField(
                          decoration: const InputDecoration(labelText: 'City'),
                          onSaved: (value) => city = value ?? '',
                          validator: (value) =>
                              value!.isEmpty ? 'Required field' : null,
                        ),
                      const SizedBox(height: 20),
                      if (errorMessage.isNotEmpty)
                        Text(
                          errorMessage,
                          style: const TextStyle(color: Colors.red),
                        ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _isLoading ? null : _handleSubmit,
                        child: _isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : const Text('Sign Up'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(
                              context, '/auth/login');
                        },
                        child: const Text('Already have an account? Sign In'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (_isLoading)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: const Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
