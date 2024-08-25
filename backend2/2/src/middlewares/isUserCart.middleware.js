export const isUserCart = async(req, res, next) => {
    const { cid } = req.params;

    if (req.user.user.cart._id !== cid) return res.status(401).json({ status:"error", msg:"that's not that user's cart"});

    next();
}