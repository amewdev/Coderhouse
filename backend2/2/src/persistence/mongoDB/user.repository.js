import { userModel } from "./models/user.model.js";

const create = async (data) => {
    console.log(data);
    const user = await userModel.create(data);
    return user;
  };

const getByEmail = async (email) => {
    const user = await userModel.findOne({ email });
    return user;
};

export default {
  create,
  getByEmail,
};