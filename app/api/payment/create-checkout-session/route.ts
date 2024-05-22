import { NextApiRequest, NextApiResponse } from "next";
 import { getProfile } from "@/app/action";
import { BASE_URL } from "@/env";

import Stripe from "stripe"


export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2024-04-10',
    typescript: true
})

export async function POST(
    req: Request,
    res: NextApiResponse
) {
    const userProfile = await getProfile()
    let formData = await req.formData()
    let userId = formData.get('user_id') as string
    let quantity = Number(formData.get('quantity') as string)
    // return Response.json({ message: 'Hellos from Next.js!' })
    const prices = await stripe.prices.list({
        lookup_keys: [formData.get('lookup_key') as string],
        expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
        customer: userProfile.stripe_customer_id || undefined,
        billing_address_collection: 'auto',
        line_items: [
            {
                price: prices.data[0].id,
                // For metered billing, do not pass quantity
                quantity: quantity || 1,
                
            },
        ],
        // metadata: {
        //     "user_id": userId ?? "test",
        // },
        payment_intent_data: {
            metadata: {
                "user_id": userId,
            }
        },
        mode: 'payment',
        success_url: `${BASE_URL}/dashboard`,
        cancel_url: `${BASE_URL}/pricing?canceled=true`,
    });

    return Response.redirect(session.url!);
}