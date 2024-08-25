import userRepository from "../persistence/mongoDB/user.repository.js";

const createUser = async (user) => {
    return await userRepository.create(user);
};

const getUser = async (email) => {
    return await userRepository.getByEmail(email);
};

export default {
    createUser,
    getUser,
};
