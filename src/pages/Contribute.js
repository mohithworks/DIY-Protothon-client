import { useEffect, useState } from 'react'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentElement from '../components/StripePaymentElement'
import axios from 'axios'
import { TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

function Contribute() {
  const [stripeCS, setstripeCS] = useState(null);

  const [amount, setAmount] = useState(0);
  const [btnLoading, setbtnLoading] = useState(false);

  const stripePKey = loadStripe(window.env.STRIPE_PUBLISHABLE_KEY);

  const handlePayment = async () => { 
    if(amount <= 0) {
        alert("Enter the amount to continue");
        return;
    }
    setbtnLoading(true)
    const options = {
        method: 'POST',
        url: 'https://x7n2z8-4000.csb.app/create-contribution',
        body: JSON.stringify({}),
        params: {
            amount: amount
        }
    }

    axios.request(options).then(function (response) { 
        const { clientSecret } = response.data;
        setstripeCS(clientSecret);
        setbtnLoading(false);
    }).catch(function (error) {
        console.error(error);
        setbtnLoading(false); 
    });

  }

  return (
    <div className='flex-1 justify-center items-center'>
        <h1>Contribute</h1>
        {
            !stripeCS && ( 
                <>
                <div className="mt-10 mb-5">
                    <TextField
                        required
                        label="Amount"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <LoadingButton className='mt-10' onClick={handlePayment} loading={btnLoading} variant="contained">Amount</LoadingButton>
                </>
            )
        }
        {
            stripePKey && stripeCS && ( 
                <Elements stripe={stripePKey} options={{ clientSecret: stripeCS }}>
                    <StripePaymentElement amount={amount} clientSecret={stripeCS} />
                </Elements>
            )
        }
    </div>
  )
}

export default Contribute