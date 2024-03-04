import { headers } from "next/dist/client/components/headers";
import prisma from "../../../libs/prismadb";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    const loraCheckpointUrl = requestBody.dreambooth_result.checkpoints.find(checkpoint => checkpoint.is_extracted_lora)?.url;

    const updatedOrder = await prisma.order.update({
        where: { dreamlook_job_id: requestBody.job_id },
        data: {
            lora_url: loraCheckpointUrl
          },
      });

      // WE GOT LORA URL, now do the image gen on mage
      // Unfinished

    return new Response(JSON.stringify({ message: "Request handled successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);

    // If an error occurs, return a response with status 500 Internal Server Error
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
