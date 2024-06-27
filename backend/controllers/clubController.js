//Controller for club-related routes

// import mongoose
const mongoose = require('mongoose');

// import axios
const axios = require('axios');

// import the club model
const Club = require('../Model/Club');

// import express
const express = require('express');

// import dotenv for environment variables
require('dotenv').config();

// create a new club
const createClub = async (req, res) => {
    try {
        // create a new club
        const club = new Club({
            name: req.body.name,
            clubInfo: {
                industry: req.body.industry,
                description: req.body.description
            },
            adminId: req.body.adminId
        });

        // save the club
        const savedClub = await club.save();

        // return the saved club
        res.json(savedClub);
    }
    catch (err) {
        // return an error if there is one
        res.json({ message: err });
    }
}

const deleteClub = async(req, res) => {
    const {clubId} = req.body;
    try {
        const deletedClub = await Club.findByIdAndDelete(clubId);

        //Check if club was found
        if(!deletedClub)
        {
            return res.status(404).json({message:"Club not found"});
        }
        res.json ({message:"Club deleted"});
    }
    catch (err){
        res.json({message: err});
    }
}

const updateClub = async (req, res) => {
    const { clubId, name, industry, description } = req.body;
    try {
        // update bessed on Id
        const updatedClub = await Club.findByIdAndUpdate(
            clubId,
            {
                name: name,
                "clubInfo.industry": industry,
                "clubInfo.description": description
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
    const {clubId} = req.body;
    try{
        const club = await Club.findById(clubId).populate('memberList');

        if(!club)
        {
            return res.status(404).json({message : "Club not found"});
        }

        res.json(club.memberList);
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
};

const viewAllClubs = async (req, res) => {
    const {search} = req.body;
    try{
        let query = {};
        if(search)
        {
            query = {name : {$regex:search, $options: 'i'}};
        }

        const clubs = await Club.find(query);

        res.json(clubs);
    }
    catch (err){
        res.status(500).json({message: err.message});
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
    const {clubId} = req.body;
    try{
        const club = await Club.findById(clubId).populate('eventList');

        if(!club)
        {
            return res.status(404).json({message : "Club not found"});
        }

        res.json(club.eventList);
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
};

const joinClub = async (req, res) => {
    
};

const leaveClub = async (req, res) => {
    
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