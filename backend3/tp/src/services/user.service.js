import { UserModel } from '../models/user.model.js';
import { generateUser } from '../utils/user.utils.js';

export const createUsers = async (cant = 50) => {
    const usersArray = []
    for (let i = 0; i < cant; i++) {
        const user = generateUser();
        usersArray.push(user);
    }
    const users = await UserModel.create(usersArray)
    return users;
};

export const getUsers = async(cant = 50) => {
    try {
        const users = await UserModel.find({}).limit(cant);
        return users;
    } catch (error) {
        console.log(error);
    }
};

