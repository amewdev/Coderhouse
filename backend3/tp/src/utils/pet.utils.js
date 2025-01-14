import { faker } from "@faker-js/faker";

export const generatePet = () => {
  return {
    name: faker.animal.petName(),
    owner: "none",
    adopted: false,
  };
}
