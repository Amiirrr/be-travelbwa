import mongoose from "mongoose";

async function connectDB(MANGO_URL, dbName) {
    try {
        await mongoose.connect(MANGO_URL, {
            dbName: dbName,
        });
        console.log('MongoDB terhubung');
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error.message);
        // Keluar dari proses Node.js jika koneksi gagal
        process.exit(1);
    }
};

export default connectDB;

