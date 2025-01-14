import { PetModel } from '../models/pet.model.js';
import { generatePet } from '../utils/pet.utils.js';

export const createPets = async (cant = 50) => {
    const petsArray = []
    for (let i = 0; i < cant; i++) {
        const pet = generatePet();
        petsArray.push(pet);
    }
    const pets = await PetModel.create(petsArray)
    return pets;
};

export const getPets = async(cant = 50) => {
    try {
        const pets = await PetModel.find({}).limit(cant);
        return pets;
    } catch (error) {
        console.log(error);
    }
};

