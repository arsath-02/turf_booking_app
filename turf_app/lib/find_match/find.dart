import 'package:flutter/material.dart';

class FindMatch extends StatefulWidget {
  const FindMatch({Key? key}) : super(key: key);

  @override
  State<FindMatch> createState() => FindMatchState();
}

class FindMatchState extends State<FindMatch> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.lightGreen[200],
      appBar: AppBar(
        leading: const BackButton(
          color: Colors.black,
        ),
        backgroundColor: Colors.lightGreen[200],
        elevation: 0,
        title: const Text(
          'Find a match',
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            color: Colors.white,
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search teams',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
            ),
          ),
          const SizedBox(height: 10.0),
          Container(
            padding: const EdgeInsets.all(10.0),
            color: Colors.white,
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Location',
                prefixIcon: const Icon(Icons.compass_calibration),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20.0),
          Expanded(
            child: ListView.builder(
              itemCount: 8,
              itemBuilder: (context, index) {
                return TeamCard(
                  teamName: 'Team $index', // Display team name
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20.0),
        color: Colors.transparent,
        child: ElevatedButton(
          onPressed: () {
            Navigator.pop(context); // Navigate back to the previous page
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue[400],
            minimumSize: const Size.fromHeight(50),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
          ),
          child: const Text(
            'Back',
            style: TextStyle(fontSize: 20.0),
          ),
        ),
      ),
    );
  }
}

class TeamCard extends StatelessWidget {
  final String teamName;

  const TeamCard({
    Key? key,
    required this.teamName,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 15.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      color: Colors.white,
      child: ListTile(
        leading: const CircleAvatar(
          backgroundColor: Colors.grey,
          radius: 20.0,
          child: Icon(
            Icons.people,
            color: Colors.white,
          ),
        ),
        title: Text(teamName),
        trailing: ElevatedButton(
          onPressed: () {
            // Add functionality to join the team
          },
          child: const Text('Join'),
        ),
      ),
    );
  }
}
