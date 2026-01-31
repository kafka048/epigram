import { MessageModel, UserModel } from "@/src/app/model/usermodel";
import ConnectToDB from "@/src/lib/dbconnection";

export async function POST(request: Request): Promise<Response> {
  try {
    await ConnectToDB();
    const { username, message } = await request.json();
    if (!username || !message) {
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
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const idOfRecipient = user._id;

    const newMessage = new MessageModel({
      recipientId: idOfRecipient,
      content: message,
    });
    await newMessage.save();

    return Response.json(
      {
        success: true,
        message: "Message delivered successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error in delivering the message.", error);
    return Response.json(
      {
        success: false,
        message:
          "Error occurred in the server. The message couldn't be delivered",
      },
      {
        status: 500,
      },
    );
  }
}
