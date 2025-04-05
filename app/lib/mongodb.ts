import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
console.log("MongoDB URI:", MONGODB_URI);
// Connect to MongoDB
const connectToDB= ()=>{
  mongoose.connect(MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
}

export default connectToDB;