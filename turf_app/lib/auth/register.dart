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

  // Focus nodes
  final FocusNode _lastNameFocusNode = FocusNode();
  final FocusNode _phoneFocusNode = FocusNode();
  final FocusNode _passwordFocusNode = FocusNode();
  final FocusNode _confirmPasswordFocusNode = FocusNode();
  final FocusNode _cityFocusNode = FocusNode();

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
        print('Sending request to server...'); // Debug log
        final response = await http.post(
          Uri.parse('https://turf-booking-app-e7rc.onrender.com/auth/register'), // Ensure this is correct
          headers: {'Content-Type': 'application/json'},
          body: requestBody,
        );

        print('Response status: ${response.statusCode}'); // Debug log
        print('Response content-type: ${response.headers['content-type']}'); // Debug log
        print('Response body: ${response.body}'); // Debug log

        final responseBody = json.decode(response.body);
        if (response.statusCode == 200 && responseBody['success'] == true) {
          // Registration successful
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
            errorMessage = responseBody['message'] ?? 'Registration failed';
          });
        }
      } catch (error) {
        print('Error occurred: $error'); // Debug log
        setState(() {
          errorMessage = 'Network error: ${error.toString()}';
        });
      } finally {
        // Always set loading to false after the operation
        setState(() {
          _isLoading = false;
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
                width: isMobile ? MediaQuery.of(context).size.width * 0.9 : MediaQuery.of(context).size.width * 0.25,
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
                          DropdownMenuItem(value: 'user', child: Text('User')),
                          DropdownMenuItem(value: 'turfOwner', child: Text('Turf Owner')),
                        ],
                        decoration: const InputDecoration(labelText: 'Register As'),
                      ),
                      const SizedBox(height: 15),

                      // Form Fields
                      _buildTextField('First Name', (value) => firstname = value ?? '', _lastNameFocusNode, (value) => value!.isEmpty ? 'Required field' : null),
                      _buildTextField('Last Name', (value) => lastname = value ?? '', _phoneFocusNode, (value) => value!.isEmpty ? 'Required field' : null, focusNode: _lastNameFocusNode),
                      _buildTextField('Email Address', (value) => email = value ?? '', _phoneFocusNode, _validateEmail, keyboardType: TextInputType.emailAddress),
                      _buildTextField('Phone Number', (value) => phonenumber = value ?? '', _passwordFocusNode, (value) => value!.isEmpty ? 'Required field' : null, focusNode: _phoneFocusNode, keyboardType: TextInputType.phone),
                      _buildTextField('Password', (value) => password = value ?? '', _confirmPasswordFocusNode, (value) => value!.isEmpty ? 'Required field' : null, focusNode: _passwordFocusNode, obscureText: true),
                      _buildTextField('Confirm Password', (value) => confirmPassword = value ?? '', _cityFocusNode, (value) => value!.isEmpty ? 'Required field' : null, focusNode: _confirmPasswordFocusNode, obscureText: true),
                      _buildTextField('City', (value) => city = value ?? '', null, (value) => value!.isEmpty ? 'Required field' : null, focusNode: _cityFocusNode),

                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _isLoading ? null : _handleSubmit,
                        child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Register'),
                      ),
                      const SizedBox(height: 10),
                      TextButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(context, '/auth/login');
                        },
                        child: const Text(
                          'Already have an account? Log In',
                          style: TextStyle(color: Colors.green),
                        ),
                      ),
                      if (errorMessage.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Text(errorMessage, style: TextStyle(color: Colors.red)),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Helper function for text fields
  TextFormField _buildTextField(String label, Function(String?) onSaved, FocusNode? nextFocus, String? Function(String?)? validator, {TextInputType? keyboardType, bool obscureText = false, FocusNode? focusNode}) {
    return TextFormField(
      focusNode: focusNode,
      decoration: InputDecoration(labelText: label),
      onSaved: onSaved,
      validator: validator,
      keyboardType: keyboardType,
      obscureText: obscureText,
      onFieldSubmitted: (_) {
        if (nextFocus != null) {
          FocusScope.of(context).requestFocus(nextFocus);
        } else {
          FocusScope.of(context).unfocus(); // Dismiss the keyboard if no next focus
        }
      },
    );
  }

  // Email validation helper
  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Required field';
    }
    const emailPattern = r'\w+@\w+\.\w+';
    if (!RegExp(emailPattern).hasMatch(value)) {
      return 'Enter a valid email address';
    }
    return null;
  }
}
