import mongoose from 'mongoose';
import slugify from 'slugify';

// Define the schema
const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true, // Ensure slugs are unique
    },
    description: {
        type: String,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
        required: true,
    },
});

// Middleware to generate slug from title before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Export the model
export default mongoose.model('category', categorySchema);