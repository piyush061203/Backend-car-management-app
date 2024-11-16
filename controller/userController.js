import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";

import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {

  const { username,password } = req.body;
  if (!username  || !password) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }
  let user = await User.findOne({ username });
  if (user) {
    return next(new ErrorHandler("User already exists!", 400));
  }
  
  user = await User.create({
    username,
    password,
  });
  sendToken("User Registered!", user, res, 200);
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorHandler("Please provide username and password!", 400));
  }
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid username  or password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid username  or password!", 400));
  }
 

   sendToken("User Logged In!", user, res, 200);
});



export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
    sameSite: "None",
    })
    .json({
      success: true,
      message: "User Logged Out!",
    });
});
export const myProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
