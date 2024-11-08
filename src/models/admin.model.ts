import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Hash Password
const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};


// Admin Schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Add password hashing middleware
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await hashPassword(this.password);
    next();
});

// Add comparePassword method
adminSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Admin Model
export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
