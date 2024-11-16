import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Car } from "../models/carSchema.js"; // Ensure the import matches the updated model name
import cloudinary from "cloudinary";

export const createTask = catchAsyncErrors(async (req, res, next) => {
  // Check if files are uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Image files required!", 400));
  }

  // Assuming 'images' is the key for the uploaded files
  const images = req.files.images; // Adjust this if you are using a different key
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  const uploadedImages = [];

  // Check if the uploaded files are allowed formats
  for (let i = 0; i < images.length; i++) {
    if (!allowedFormats.includes(images[i].mimetype)) {
      return next(
        new ErrorHandler("Invalid file type. Please upload PNG, JPEG, or WEBP files.", 400)
      );
    }

    // Upload the image to Cloudinary
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(images[i].tempFilePath);
      uploadedImages.push({
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      });
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }
  }

  // Destructure the body
  const { title, description, tags } = req.body;

  // Create a new task
  const task = await Car.create({
    title,
    description,
    tags: tags ? tags.split(',') : [],
    images: uploadedImages, // Store the array of uploaded images
    createdBy: req.user._id,
  });

  // Send response
  res.status(201).json({
    success: true,
    message: "Task created successfully!",
    task,
  });
});

export const deleteTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const task = await Car.findById(id);
  if (!task) {
    return next(new ErrorHandler("Car not found!", 400));
  }
  await task.deleteOne();
  res.status(200).json({
    success: true,
    message: "Car Deleted!",
  });
});

export const updateTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let task = await Car.findById(id);
  if (!task) {
    return next(new ErrorHandler("Car not found!", 400));
  }

  // Handle image uploads if present in the request
  if (req.files && req.files.images) {
    const images = req.files.images; // Adjust this if you are using a different key
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    const uploadedImages = [];

    for (let i = 0; i < images.length; i++) {
      if (!allowedFormats.includes(images[i].mimetype)) {
        return next(
          new ErrorHandler("Invalid file type. Please upload PNG, JPEG, or WEBP files.", 400)
        );
      }

      let cloudinaryResponse;
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(images[i].tempFilePath);
        uploadedImages.push({
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        });
      } catch (error) {
        console.error("Cloudinary Error:", error);
        return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
      }
    }

    // Update images in the task
    req.body.images = uploadedImages;
  }

  task = await Car.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Task Updated!",
    task,
  });
});

export const getMyTask = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const tasks = await Car.find({ createdBy: user });
  res.status(200). json({
    success: true,
    tasks,
  });
});

export const getSingleTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let task = await Car.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 400));
  }
  res.status(200).json({
    success: true,
    task,
  });
});