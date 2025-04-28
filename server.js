import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const BmiEntrySchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    height: {
      unit: { type: String, required: true },
      feet: { type: Number },
      inches: { type: Number },
      inchesOnly: { type: Number },
      cm: { type: Number },
    },
    weight: {
      unit: { type: String, required: true },
      value: { type: Number, required: true },
    },
    bmi: { type: Number, required: true },
    bmiCategory: {
      category: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BmiEntry = mongoose.model("BmiEntry", BmiEntrySchema);

app.post("/api/bmi", async (req, res) => {
  try {
    const { gender, age, height, weight, bmi, bmiCategory } = req.body;

    const newEntry = new BmiEntry({
      gender,
      age,
      height,
      weight,
      bmi,
      bmiCategory,
    });

    await newEntry.save();

    res.status(201).json({ message: " BMI entry saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const port = process.env.PORT;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(` The port is running on http://localhost:${port}`);
  });
});
