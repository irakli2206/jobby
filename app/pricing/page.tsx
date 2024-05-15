


import { getUser } from '../action';
import PricingView from './view';


const Pricing = async () => {
  const user = await getUser()
  // const router = useRouter()



  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.

  //   if (!user) router.push('signup?ask_auth=true')
  //   else router.push('api/payment/create-checkout-session')
  // }

  return (
   <>
    <PricingView user={user} />
   </>
  )
}

export default Pricing