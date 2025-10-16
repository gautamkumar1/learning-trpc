import mongoose from 'mongoose';
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://gautamraaz936_db_user:RjkGpocWHpENq6bV@cluster0.hp4avao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}
