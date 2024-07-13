import { Server } from "socket.io";
import ProductManager from "../managers/ProductsManager.js";
import CartsManager from "../managers/CartsManager.js";

let serverSocket = null;

const config = (serverHTTP) => {
    serverSocket = new Server(serverHTTP);
    const pm = new ProductManager();
    const cm = new CartsManager();

    serverSocket.on("connection", async (socket) => {
        console.log("Socket connected");

        socket.on("getCarts", async () => {
            const carts = await cm.getAllCartIds();
            socket.emit("socketCarts", carts);
        });

        socket.on("getProduct", async (data) => {
            const { pid } = data;
            const product = await pm.getOne(pid);
            socket.emit("socketProduct", { product });
        });

        socket.on("getProducts", async (filters) => {
            //filters come in with empty keys that messes getAll up
            //the function below fixes it (moduling was not worth it)
            const cleanedFilters = {};
            for (const key in filters) {
                if (filters[key] !== "") {
                    cleanedFilters[key] = filters[key];
                }
            }
            console.log(cleanedFilters);
            const products = await pm.getAll(cleanedFilters);
            socket.emit("socketProducts", { products });
        });

        socket.on("productAddedToCart", async (data) => {
            const { pid, cid } = data;
            await cm.addProductToCart(cid, pid);
            const product = await pm.getOne(pid);
            socket.emit("socketProduct", { product });
        });

        socket.on("deleteProduct", async (data) => {
            await pm.deleteProduct(Number(data.id));
            const products = await pm.getAll();
            socket.emit("listProducts", { products });
        });

        socket.on("getCategories", async() => {
            const categories = await pm.getCategories();
            socket.emit("socketCategories", { categories });
        });
    });
};

const updateProducts = async (filters) => {
    if (serverSocket) {
        const pm = new ProductManager();
        const products = await pm.getAll(filters);
        serverSocket.emit("socketProducts", { products });
    }
};

const updateProduct = async (product) => {
    if (serverSocket) serverSocket.emit("socketProduct", { product });
};

const updateCarts = async () => {
    if (serverSocket) {
        const cm = new CartsManager();
        const carts = await cm.getAllCartIds({ new: true });
        serverSocket.emit("socketCarts", carts);
    }
};

const updateCategories = async () => {
    if (serverSocket) {
        const pm = new ProductManager();
        const categories = await pm.getCategories();
        serverSocket.emit("socketCategories", { categories });
    }
};

export default {
    config,
    updateCarts,
    updateProduct,
    updateProducts,
    updateCategories,
};