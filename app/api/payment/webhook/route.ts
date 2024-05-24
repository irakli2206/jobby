import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { buffer } from 'micro'
import Stripe from "stripe"
import { createClient } from "@/utils/supabase/server";
import { getProfileByID } from "@/app/action";



export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2024-04-10',
    typescript: true
})

const secret = process.env.STRIPE_WEBHOOK_SECRET!;


export async function POST(
    req: Request,
) {
    const supabase = createClient()

    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    // try {
    //     const webhookEndpoint = await stripe.webhookEndpoints.create({
    //         enabled_events: ['checkout.session.completed'],
    //         url: 'https://jobby.ge/api/payment/webhook',
    //     });
    // } catch(error: any) {
    //     return new Response(`Webhook Endpoint Error: ${error.message}`, { status: 400 })
    // }


    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            secret
        )
    } catch (error: any) {
        return new Response(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session
    if (event.type === "checkout.session.completed") {
        // Retrieve the subscription details from Stripe.
        const fullSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] })
        // Metadata comes on payment not on session
        const payment: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string, { expand: ['line_items'] }
        )
        const quantityPurchased = fullSession.line_items?.data[0].quantity
        const userId = payment.metadata.user_id

        const { data: profile, error: profileError } = await supabase.from('profiles').select().eq('id', userId).single()
        const { data, error }: { data: any | null, error: any } = await supabase.from('profiles').update({
            stripe_customer_id: fullSession.customer as string,
            job_limit: profile.job_limit + quantityPurchased
        }).eq('id', userId)

        if (error) {
            return new Response(`Supabase user subscription update error:${error.message}`, { status: 400 })
        }

    }


    return new Response(null, { status: 200 })
}
