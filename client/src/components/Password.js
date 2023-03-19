import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
import styles from '../styles/Username.module.css';

export default function Password() {

  const navigate = useNavigate()
  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)
  // console.log(apiData?.profile)

  const formik = useFormik({
    initialValues : {
      password : ''
    },
    validate : passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      
      let loginPromise = verifyPassword({ username, password : values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success : <b>Login Successful</b>,
        error : <b>Password Incorrect!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/Dashboard')
      })
    }
  })

  if(isLoading) return
    <div class="flex justify-center items-center h-screen">
      <h1 class="text-center text-2xl font-bold text-red-500">Page Not Found!</h1>
    </div>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Welcome back!</h4>
            <span className="py-4 text-lg w-2/3 text-center text-gray-500">
              Please allow me to verify your credentials
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
            </div>
            <br></br>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} type="password" placeholder="Password" className={styles.textbox}/>
              <button type="submit" className={styles.btn}>Sign In</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Password</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
