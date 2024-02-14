import mongoose from "mongoose";

async function connectDB(MANGO_URL) {
    try {
        // Koneksi ke MongoDB menggunakan mongoose.connect
        await mongoose.connect(MANGO_URL);
        console.log('MongoDB terhubung');
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error.message);
        // Keluar dari proses Node.js jika koneksi gagal
        process.exit(1);
    }
};

export default connectDB;