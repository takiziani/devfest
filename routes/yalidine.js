import {Router} from "express";
import {Product} from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
import axios from 'axios';

const router = Router();

// Replace with your actual API credentials
const apiId = "08105243741699621342";
const apiToken = "j84qu7VADV07bCBQDAaytqE0ewcQdXpm6X1YNghUK2LerNjwcWulssIPrtRLypGi";

// Route to get parcel histories
router.get('/full-histories', async (req, res) => {
    try {
        const response = await axios.get('https://api.yalidine.app/v1/histories/', {
            headers: {
                'X-API-ID': apiId,
                'X-API-TOKEN': apiToken
            }
        });

        // Send the response data back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching parcel histories:', error);
        res.status(500).json({ error: 'Failed to fetch parcel histories' });
    }
});


router.get('/current-place/:s', async (request,response)=> {

    try{


        const {params : {s}} = request 
        
        const res = await axios.get(`https://api.yalidine.app/v1/histories/${encodeURIComponent(s)}`, {
            headers: {
                'X-API-ID': apiId,
                'X-API-TOKEN': apiToken
            }
        });

        // Extract the data array from the response
        const histories = res.data.data;

        // Check if there are any histories
        if (histories && histories.length > 0) {
            // Get the last history entry
            const lastHistory = histories[0];
            response.json(lastHistory);
       

    } else {
        response.status(404).json({ error: 'No history found for this parcel' });
    }
}
    catch (error) {
        console.error('Error fetching parcel histories:', error);
        response.status(500).json({ error: 'Failed to fetch parcel histories' })
    }

    
})
router.get('/full-histories/:s?', async (request, response) => {
    try {
        const { params: { s } } = request;

        if (!s) {
            // If no specific tracking number is provided, return all histories
            const res = await axios.get('https://api.yalidine.app/v1/histories', {
                headers: {
                    'X-API-ID': apiId,
                    'X-API-TOKEN': apiToken
                }
            });
            return response.json(res.data);
        }

        // Fetch history for a specific tracking number
        const res = await axios.get(`https://api.yalidine.app/v1/histories/${encodeURIComponent(s)}`, {
            headers: {
                'X-API-ID': apiId,
                'X-API-TOKEN': apiToken
            }
        });

        // Extract the data array from the response
        const histories = res.data.data;

        // Check if there are any histories
        if (histories && histories.length > 0) {
            // Get the last history entry
            const lastHistory = histories[0];
            return response.json(lastHistory);
        } else {
            return response.status(404).json({ error: 'No history found for this parcel' });
        }

        } catch (error) {
        console.error('Error fetching parcel histories:', error);
        response.status(500).json({ error: 'Failed to fetch parcel histories' });
    }
});

router.delete('/yalidine/:s', async (request, response) => {
    try {
        const { params: { s } } = request;

        // Make the DELETE request to Yalidine API
        const res = await axios.delete(`https://api.yalidine.app/v1/parcels/${encodeURIComponent(s)}`, {
            headers: {
                'X-API-ID': apiId,
                'X-API-TOKEN': apiToken
            }
        });

        // Extract the response data
        const deletionResult = res.data;

        // Check if the deletion was successful
        if (Array.isArray(deletionResult) && deletionResult.length > 0) {
            const result = deletionResult[0]; // Assume single parcel deletion (method 1)
            if (result.deleted) {
                response.json({ message: `Parcel ${result.tracking} deleted successfully` });
            } else {
                response.status(400).json({
                    error: `Parcel ${result.tracking} could not be deleted. Reason: Check tracking ID or parcel status.`
                });
            }
        } else {
            response.status(404).json({ error: 'No data returned from API for the given parcel.' });
        }
    } catch (error) {
        console.error('Error deleting parcel:', error.response?.data || error.message);
        response.status(500).json({
            error: 'Failed to delete parcel. Ensure the parcel exists and meets deletion criteria.'
        });
    }
});


export default router;