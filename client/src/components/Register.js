import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper'


import styles from '../styles/Username.module.css';

export default function Register() {

  const navigate = useNavigate()
  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues : {
      email: '',
      username: '',
      password : '',
      id: '',
      profile: ''
    },
    validate : registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || ''})
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success : <b>Register Successfully...!</b>,
        error : <b>Could not Register.</b>
      });

      registerPromise.then(function(){ navigate('/')});
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Let's Get You Registered!</h4>
            <span className="py-4 text-lg w-auto text-center text-gray-500">
              Oh don't worry. It's completely Free!
            </span>
          </div>

          <form className="py-" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              
              <label htmlFor="profile">
                <img src={file || avatar } className={styles.profile_img} alt="avatar" />
              </label>

              <input onChange={onUpload} type="file" id='profile' name='profile'/>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <span className="py-4 text-sm w-auto h-auto text-center text-purple-500">
                Upload a cool picture. Let us see you!
              </span>
              <input {...formik.getFieldProps('email')} type="email" placeholder="Email" className={styles.textbox}/>
              <input {...formik.getFieldProps('id')} type="number" placeholder="IUB ID" className={styles.textbox}/>
              <input {...formik.getFieldProps('username')} type="text" placeholder="Username" className={styles.textbox}/>
              <input {...formik.getFieldProps('password')} type="password" placeholder="Password" className={styles.textbox}/>

              <span className="text-xs w-auto text-center text-red-500">
                Registration failed?<br></br>
                <span className="text-xs w-auto text-center text-indigo-500">
                Then you are probably too shy to upload a picture!
                </span>
              </span>
           
            </div>

            <div className="textbox flex flex-col items-center gap-6 my-6">
            <button type="submit" className={styles.btn}>Register</button>
            </div>

            <div className='text-center'>
              <span className='text-gray-500'>Already Registed? <Link className='text-red-500' to="/">Login Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
