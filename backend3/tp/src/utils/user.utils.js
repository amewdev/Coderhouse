import { Faker, es_MX, pt_BR } from "@faker-js/faker";

const faker = new Faker({ locale: [Math.random()>0.99 ? pt_BR : es_MX]});

export const generateUser = () => {
    const fn = faker.person.firstName();
    const ln = faker.person.lastName();

    return {
        firstName: fn,
        lastName: ln,
        email: faker.internet.email({firstName: fn, lastName: ln}),
        password: "coder123",
        role: Math.random() > 0.95 ? "admin" : "user",
        pets: [],
    };
}
