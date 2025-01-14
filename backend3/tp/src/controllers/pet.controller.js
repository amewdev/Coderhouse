import * as petService from "../services/pet.service.js";

export const createPets = async (req, res) => {
    const { cant } = req.query;
    try {
        const response = await petService.createPets(cant);
        res.status(200).json({ pets: response });
    } catch (error) {
        console.log(error);
    }
};

export const getPets = async (req, res) => {
    const { cant } = req.query;
    try {
        const response = await petService.getPets(cant);
        res.status(200).json({ pets: response, pid: process.pid });
    } catch (error) {
        console.log(error);
    }
};


