export const authorization = (role) => {
    return async(req, res, next) => {
        if (!req.user) return res.status(401).json({ status: "error", msg: "unauthorized" });
        if (req.user.user.role !== role) return res.status(403).json({ status: "error", msg: "no permission" });

        next();
    }
}