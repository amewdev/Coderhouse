import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

let serverSocket = null;

const config = (serverHTTP) => {
    serverSocket = new Server(serverHTTP);
    const pm = new ProductManager();

    serverSocket.on("connection", async (socket) => {
        console.log("Socket connected");
        let products = await pm.getProducts();

        socket.emit("listProducts", { products });

        socket.on("deleteProduct", async (data) => {
            await pm.deleteProduct(Number(data.id));
            let products = await pm.getProducts();
            serverSocket.emit("listProducts", { products } );
        });
    });
};

const updateProductsList = (products) => {
    // Envía la lista de productos actualizada
    serverSocket.emit("listProducts", { products });
};

export default {
    config,
    updateProductsList,
};