export const cookieExtractor = (req) => {
    return req?.cookies ? req.cookies.token : null;
}