import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], 
    default: [],
    index: true,
  },
  images: [{
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

export const Car = mongoose.model("Car", carSchema);