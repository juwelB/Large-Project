//Controller for club-related routes


// import the club & User model
const Club = require('../Model/Club');
const User = require('../Model/User');


// create a new club
const createClub = async (req, res) => {
    try {
        console.log('Received club data:', req.body); // Debug log
        const { name, clubInfo, adminId } = req.body;

        const club = new Club({
            name,
            clubInfo,
            adminId: adminId || null, // Make adminId optional
            eventList: [],
            memberList: adminId ? [adminId] : [] // Only add admin to memberList if provided
        });

        const savedClub = await club.save();

        if (adminId) {
            // Update the user to be an admin of this club only if adminId is provided
            await User.findByIdAndUpdate(adminId, {
                $push: { adminOf: savedClub._id }
            });
        }

        res.status(201).json(savedClub);
    }
    catch (err) {
        console.error('Error creating club:', err);
        res.status(500).json({ message: err.message });
    }
}

const deleteClub = async (req, res) => {
    const { clubId } = req.body;
    try {
        const deletedClub = await Club.findByIdAndDelete(clubId);

        //Check if club was found
        if (!deletedClub) {
            return res.status(404).json({ message: "Club not found" });
        }
        res.json({ message: "Club deleted" });
    }
    catch (err) {
        res.json({ message: err });
    }
}

const updateClub = async (req, res) => {
    const { clubId, name, industry, description, logo } = req.body;
    try {
        // update based on Id
        const updatedClub = await Club.findByIdAndUpdate(
            clubId,
            {
                name: name,
                "clubInfo.industry": industry,
                "clubInfo.description": description,
                "clubInfo.logo": logo
            },
            { new: true, runValidators: true } // This option returns the updated document
        );

        // see if club was found
        if (!updatedClub) {
            return res.status(404).json({ message: "Club not found" });
        }

        // Return the updated club
        res.json(updatedClub);
    } catch (err) {
        // Return an error message if something goes wrong
        res.status(500).json({ message: err.message });
    }
};

const viewClubMembers = async (req, res) => {
    const { clubId } = req.body;
    try {
        const club = await Club.findById(clubId).populate('memberList');

        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        res.json(club.memberList);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const viewAllClubs = async (req, res) => {
    const { search } = req.body;
    try {
        let query = {};
        if (search) {
            query = { name: { $regex: search, $options: 'i' } };
        }

        const clubs = await Club.find(query);

        res.json(clubs);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const viewMyClubs = async (req, res) => {
    const { userId, search } = req.body;
    try {
        let query = {
            $or: [
                { adminId: userId }, // Find clubs where user is admin
                { memberList: userId } // Find clubs where user is a member
            ]
        };

        // If search parameter is provided, filter by club name
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Find clubs that match the userId and optional search criteria
        const clubs = await Club.find(query);

        // Return the array of clubs
        res.json(clubs);
    } catch (err) {
        // Return an error message if something goes wrong
        res.status(500).json({ message: err.message });
    }
};

const viewClubEvents = async (req, res) => {
    const { clubId } = req.params;
    try {
        const club = await Club.findById(clubId).populate('eventList');

        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        res.json(club.eventList);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const joinClub = async (req, res) => {
    const { userId, clubId } = req.body;

    try {
        console.log('Joining club with userId:', userId, 'and clubId:', clubId);

        // Find the user and club
        const user = await User.findById(userId);
        const club = await Club.findById(clubId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Add the club to the user's clubList if not already there
        if (!user.clubList.includes(clubId)) {
            user.clubList.push(clubId);
        }

        // Add the user to the club's memberList if not already there
        if (!club.memberList.includes(userId)) {
            club.memberList.push(userId);
        }

        // Save the updated user and club
        await user.save();
        await club.save();

        res.status(200).json({ message: 'Successfully joined the club' });
    } catch (err) {
        console.error('Error joining club:', err);
        res.status(500).json({ message: err.message, stack: err.stack });
    }
};

const leaveClub = async (req, res) => {
    const { userObjId, clubObjId } = req.body;

    try {
        // Check if both user and club exist
        const user = await User.findById(userObjId);
        const club = await Club.findById(clubObjId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Check if user is in club's memberList
        if (!club.memberList.includes(userObjId)) {
            return res.status(400).json({ error: 'User not in the club' });
        }

        // Check if club is in user's clubList
        if (!user.clubList.includes(clubObjId)) {
            return res.status(400).json({ error: 'Club not in user\'s list' });
        }

        // Update user to remove club from clubList
        const updateUser = await User.findByIdAndUpdate(
            userObjId,
            { $pull: { clubList: clubObjId } },
            { new: true } // To return the updated document
        );

        // Update club to remove user from memberList
        const updateClub = await Club.findByIdAndUpdate(
            clubObjId,
            { $pull: { memberList: userObjId } },
            { new: true } // To return the updated document
        );

        // Return successful response
        return res.status(200).json({
            user: updateUser,
            club: updateClub
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const manageClub = async (req, res) => {

};



//Exports
module.exports = {
    createClub,
    deleteClub,
    updateClub,
    viewClubMembers,
    viewAllClubs,
    viewClubEvents,
    joinClub,
    leaveClub,
    manageClub,
    viewMyClubs
};