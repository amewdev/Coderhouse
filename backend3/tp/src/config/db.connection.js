import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        const URI = "mongodb+srv://amecodea:1234@cluster0.cgbwks8.mongodb.net/b3?retryWrites=true&w=majority&appName=Cluster0"; // Cambia 'tu_base_de_datos' por el nombre de tu base de datos
        await mongoose.connect(
            URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("✅ Conexión exitosa a MongoDB");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error.message);
        process.exit(1); // Termina el proceso en caso de error
    }
};
