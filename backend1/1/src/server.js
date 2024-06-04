import express from 'express';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';

const PORT = 8080;
const HOST = "localhost"; //same as 127.0.0.1
const server = express();

server.use(express.urlencoded({extended:true}));
server.use(express.json());

server.use('/api/carts', cartsRouter);
server.use('/api/products', productsRouter);

server.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
});