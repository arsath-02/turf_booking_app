const express = require('express');
const router = express.Router();
const Community = require('../models/community'); // Community model
const authenticateJWT = require('../middleware/authenticateJWT'); // Your existing authentication middleware

// Create a new community
router.post('/create', authenticateJWT, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Community name is required' });
    }

    try {
        const newCommunity = new Community({
            name,
            admin: req.user.id, // Admin is the authenticated user
            members: [], // Initialize members array
            joinRequests: [] // Initialize join requests array
        });
        await newCommunity.save();
        return res.status(201).json({ message: 'Community created successfully', community: newCommunity });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Join a community
router.post('/:communityId/join', authenticateJWT, async (req, res) => {
    const { communityId } = req.params;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if user is already a member
        if (community.members.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are already a member of this community' });
        }

        // Add user to joinRequests if they are not already a member
        community.joinRequests.push(req.user.id);
        await community.save();
        return res.status(200).json({ message: 'Join request sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Approve join request
router.post('/:communityId/approve/:userId', authenticateJWT, async (req, res) => {
    const { communityId, userId } = req.params;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if the requester is the admin
        if (String(community.admin) !== req.user.id) {
            return res.status(403).json({ message: 'Only the admin can approve join requests' });
        }

        // Check if user is in joinRequests
        if (!community.joinRequests.includes(userId)) {
            return res.status(400).json({ message: 'User has not requested to join' });
        }

        // Approve user and remove from joinRequests
        community.members.push(userId);
        community.joinRequests = community.joinRequests.filter(requestId => requestId !== userId);
        await community.save();
        return res.status(200).json({ message: 'User approved successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Delete a community
router.delete('/:communityId', authenticateJWT, async (req, res) => {
    const { communityId } = req.params;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if the requester is the admin
        if (String(community.admin) !== req.user.id) {
            return res.status(403).json({ message: 'Only the admin can delete this community' });
        }

        await Community.findByIdAndDelete(communityId);
        return res.status(200).json({ message: 'Community deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
