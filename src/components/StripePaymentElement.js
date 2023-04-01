import { useState } from 'react'
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { dbInsert } from '../services/DatabaseServices';
import { useAuth } from "../utils/context/AuthContext";
import { useNavigate } from 'react-router-dom';

function StripePaymentElement({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [btnLoading, setbtnLoading] = useState(false);

  const { user } = useAuth()
  const navigate = useNavigate();
  const { user_metadata } = user;


  const submitPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setbtnLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect:"if_required"
    });

    if (error && (error.type === "card_error" || error.type === "validation_error")) {
      alert(error.message);
    } else if(paymentIntent && paymentIntent.status === "succeeded") {
        const insertData = [
            {id: paymentIntent.id, amount: amount, areaid: user_metadata.area, userid: user.id}
        ]
        dbInsert('transactions', insertData).then(({ error, data }) => {
            if (error) {
                alert(error.message)
            } 
            if(data) {
                alert("Payment successful. Money added to area wallet");
                navigate('/');
            }
        })
        console.log(paymentIntent)
    } else {
      alert("An unexpected error occured.");
    }

    setbtnLoading(false);
  };

  return (
    <div>
        <Box width={'100%'} className="px-5 lg:px-20 md:px-20" mt={10} alignItems={'center'} justifyContent={'center'}>
            <PaymentElement className='mb-10' />
            <LoadingButton className='mt-10' onClick={submitPayment} loading={btnLoading} variant="contained">Pay</LoadingButton>

        </Box>
    </div>
  )
}

export default StripePaymentElement