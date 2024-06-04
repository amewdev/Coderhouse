import express from 'express';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';

const PORT = 8080;
const HOST = "localhost"; //same as 127.0.0.1
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
});
