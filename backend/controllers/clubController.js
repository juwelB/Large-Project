//Controller for club-related routes

// import mongoose
const mongoose = require('mongoose');

// import axios
const axios = require('axios');

// import the club model
const Club = require('../models/club');

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

//Exports
module.exports = {
    createClub
};