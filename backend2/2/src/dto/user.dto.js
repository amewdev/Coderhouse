export const userDto = (user) => {
    return {
        greeting: `Welcome ${user.first_name} ${user.last_name} !`,
        info: `(Account with ${user.role.toUpperCase()} permissions)`,
        id: `ID : ${user._id} (puesto sólo para facilitar el testeo en postman)`,
    }
}