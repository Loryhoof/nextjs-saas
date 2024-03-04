import axios from 'axios';
import prisma from '../../libs/prismadb';

export const maxDuration = 100;

export async function POST(request) {

  //const { params } = await request.json();

  const body = await request.json();
  const jobData = body;

  
  try {
    // temp
    console.log(jobData.imageType, jobData.images, jobData.orderId);
    
    //return new Response(JSON.stringify({jobData}))

    const selectedInstancePrompt = jobData.imageType == "Couple" ? "photo of ukj couple" : "photo of ukj person";
    const selectedSteps = jobData.images.length * 100;
    const testMode = true;

    const response = await axios.post('https://api.dreamlook.ai/dreambooth', {
        image_urls: [],
        steps: selectedSteps,
        learning_rate: 0.000001,
        instance_prompt: selectedInstancePrompt,
        model_type: 'sd-v1',
        base_model: 'stable-diffusion-v1-5',
        crop_method: 'center',
        saved_model_format: 'original',
        saved_model_weights_format: 'safetensors',
        extract_lora: 'original',
        callback: "https://www.nextjssaassite.com/api/webhooks/dreamlook",
        image_urls: jobData.images,
        dry_run: testMode,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DREAMLOOK_API_KEY}`
        }
    });

    const updatedOrder = await prisma.order.update({
        where: { id: jobData.orderId },
        data: {
            dreamlook_job_id: response.data.job_id
          },
      });


    return new Response(JSON.stringify({status:200}));

    //const responseData = await response.data;
    //console.log(responseData)

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}