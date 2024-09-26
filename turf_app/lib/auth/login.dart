import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool loading = false;
  String errorMessage = '';
  String successMessage = '';

  void handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        loading = true;
        errorMessage = '';
        successMessage = '';
      });

      final formData = {
        'email': emailController.text,
        'password': passwordController.text,
      };

      try {
        final response = await http.post(
          Uri.parse('http://localhost:3000/auth/login'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(formData),
        );

        final data = json.decode(response.body);
        print('API Response: $data');

        if (response.statusCode == 200) {
          setState(() {
            successMessage = 'Login successful!';
            // Store token and role in local storage (if using shared_preferences)
            // Navigate based on user role
            // Example: if (user.role == 'admin') { navigate to admin page }
            // else { navigate to home page }
          });
        } else {
          setState(() {
            errorMessage = data['message'] ?? 'Login failed. Please try again.';
          });
        }
      } catch (error) {
        print('Error: $error');
        setState(() {
          errorMessage = 'An error occurred. Please try again.';
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
          width: MediaQuery.of(context).size.width * 0.25,
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
                TextFormField(
                  controller: emailController,
                  decoration: const InputDecoration(labelText: 'Email'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'All fields are required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: passwordController,
                  decoration: const InputDecoration(labelText: 'Password'),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'All fields are required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                loading
                    ? const CircularProgressIndicator()
                    : ElevatedButton(
                        onPressed: handleSubmit,
                        child: const Text('Sign In'),
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
                Text(
                  errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
                Text(
                  successMessage,
                  style: const TextStyle(color: Colors.green),
                ),
                const SizedBox(height: 10),
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
