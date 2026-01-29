import ConnectToDB from "@/src/lib/dbconnection";
import { UserModel } from "../../model/usermodel";
import bcrypt from "bcryptjs";

export async function POST(request: Request): Promise<Response> { 

  try {
    await ConnectToDB();
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Some fields are missing.",
        },
        {
          status: 400,
        },
      );
    }
    const existingUserWithUsername = await UserModel.findOne({
      username,
    });
    if (existingUserWithUsername) {
        return Response.json(
          {
            success: false,
            message: "A user already exists with this username.",
          },
          {
            status: 409,
          },
        );
    }

    const securePassword = await bcrypt.hash(password, 10);
    const generateVerificationCode = Math.floor(
      100000 + Math.random() * 900000,
    );
    const codeExpirationDate = new Date(Date.now() + 60 * 60 * 1000);

    const existingUserWithEmail = await UserModel.findOne({
      email,
    });
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "A user already exists with this email.",
          },
          {
            status: 409,
          },
        );
      } else {
        existingUserWithEmail.hashedPassword = securePassword;
        existingUserWithEmail.verificationCode = generateVerificationCode;
        existingUserWithEmail.verificationCodeExpiry = codeExpirationDate;
        await existingUserWithEmail.save();
      }
    } else {
      
      const newUser = new UserModel({
        username,
        email,
        hashedPassword: securePassword,
        verificationCode: generateVerificationCode,
        verificationCodeExpiry: codeExpirationDate,
        isVerified: false
      });
      await newUser.save();
    }

    return Response.json(
      {
        success: true,
        message: "Successfully registered the user.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error in signing up the user.", error);
    return Response.json(
      {
        success: false,
        message: "Error occurred in the server.",
      },
      {
        status: 500,
      },
    );
  }
}
