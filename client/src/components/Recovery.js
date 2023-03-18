import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if(OTP) return toast.success('OTP has been sent to your Email')
      return toast.error('Problem while generating OTP')
    })
  }, [username]);

  async function onSubmit(e){
    e.preventDefault();
    try{
      let { status } = await verifyOTP({ username, code : OTP })
    if(status === 201){
      toast.success('Verified Successfully')
      return navigate('/reset')
    }
    }catch(error){
      return toast.error('Wrong OTP! Seems like you messed up!')
    }
  }

  // Handler function of resend OTP
  function resendOTP(){
    let sendPromise = generateOTP(username);

    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been sent to your email.</b>,
      error: <b>OTP has been hijacked during transimission!</b>
    })

    sendPromise.then(OTP => {
      // console.log(OTP)
    })
  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Password Recovery</h4>
            <span className="py-4 text-lg w-2/3 text-center text-gray-500">
              Let's not forget the password next time!
            </span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>

            <div className="textbox flex flex-col items-center gap-6"> 

              <span className='text-sm text-left text-gray-500'>
                  Enter the 6 digit OTP sent to your email address.
              </span>
                
              <input onChange={(e) => setOTP(e.target.value) } type="text" placeholder="OTP" className={styles.textbox}/>

              <button type="submit" className={styles.btn}>Continue</button>
            </div>

          </form>

          <div className='text-center py-4'>
              <span className='text-gray-500'>Did not Recieve OTP? <button onClick={resendOTP} className='text-red-500'>Resend OTP</button></span>
          </div>

        </div>
      </div>
    </div>
  )
}