import ConnectToDB from "@/src/lib/dbconnection";
import { UserModel } from "../../model/usermodel";

export async function POST(request: Request): Promise<Response> {
  try {
    await ConnectToDB();
    const { email, code } = await request.json();
    if (!email || !code) {
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

    const user = await UserModel.findOne({
      email,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No such user exists. Please sign up.",
        },
        {
          status: 404,
        },
      );
    }

    if (user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User is already verified.",
        },
        {
          status: 409,
        },
      );
    }

    if (user.verificationCodeExpiry < new Date()) {
      return Response.json(
        {
          success: false,
          message:
            "The provided code is no longer available. Please signup again to get a new code.",
        },
        {
          status: 422,
        },
      );
    }

    if (user.verificationCode !== Number(code)) {
      return Response.json(
        {
          success: false,
          message: "The provided code doesn't match the verification code.",
        },
        {
          status: 422,
        },
      );
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "User verified successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in verifying the user.", error);
    return Response.json(
      {
        success: false,
        message: "Error occurred in verifying the user.",
      },
      {
        status: 500,
      },
    );
  }
}
