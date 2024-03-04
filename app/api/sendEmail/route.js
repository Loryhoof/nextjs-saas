import { Resend } from 'resend';

export const maxDuration = 100;

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {

const body = await request.json();
const {email} = body;

  try {

    const data = await resend.emails.send({
        from: 'NextJS SaaS <hello@nextjssaassite.com>',
        to: email,
        subject: "Your order has been processed!",
        react: (
            <div>
                <h1>Hi, your order has been delivered!</h1>
            </div>
        )
    })

    return new Response(JSON.stringify({ status: 200 }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}