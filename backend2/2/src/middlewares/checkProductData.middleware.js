import productRepository from "../persistence/mongoDB/product.repository.js";

export const checkProductData = async (req, res, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };

    const products = await productRepository.getAll();

    const productExists = products.docs.find((p) => p.code === code);
    if (productExists) return res.status(400).json({ status: "Error", msg: `Product with code ${code} already exists` });

    const checkData = Object.values(newProduct).includes(undefined);
    if (checkData) return res.status(400).json({ status: "Error", msg: "All fields are mandatory" });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Internal server error" });
  }
};
