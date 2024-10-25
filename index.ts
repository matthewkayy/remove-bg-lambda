import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from "aws-lambda";
import { removeBackground } from "@imgly/background-removal-node";

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> =>  {
  try {
    if (!event.body || !event.isBase64Encoded) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No image found in the request" }),
      };
    }

    const imageBuffer = Buffer.from(event.body, "base64");

    const blob = await removeBackground(imageBuffer);
    const buffer = Buffer.from(await blob.arrayBuffer());

    const base64ProcessedImage = `data:image/png;base64,${buffer.toString("base64")}`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "inline",
      },
      body: base64ProcessedImage,
      isBase64Encoded: true,
    };
  }
  catch (error) {
    console.error("Error processing image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
  