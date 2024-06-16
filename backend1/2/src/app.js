import express from "express";
import paths from "./utils/paths.js";
import handlebars from "./config/handlebars.config.js";
import serverSocket from "./config/socket.config.js";

import homeRouter from "./routes/home.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;
const HOST = "localhost";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template motor configuration
handlebars.config(app);

// Static route declaration http://localhost:8080/api/public
app.use("/api/public", express.static(paths.public));

app.use("/", homeRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/api/products", productsRouter);

// Non-existent routes controller
app.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Intern errors controller
app.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

const serverHTTP = app.listen(PORT, () => {
    console.log(`Running at http://${HOST}:${PORT}`);
});

// Websocket server configuration
serverSocket.config(serverHTTP);