import mongoose from 'mongoose';
import slugify from 'slugify';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of answer options
    required: true,
    validate: [arr => arr.length >= 2, 'At least two options are required'],
  },
  values: {
    type: Array, // Or use index (Number) for better validation
  },
});

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
   description: {
    type: String,
  },
  category: {
    type: String,
  },
  questions: [questionSchema], // Array of question objects
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug before saving
testSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('AllTest', testSchema);
