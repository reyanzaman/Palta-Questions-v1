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
      profile: '',
      questions: 0,
      score: 0,
      rank: 'Novice Questioneer',
      course: 'CIS101',
      section: ''
    },
    validate : registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: (response) => {
          console.log(response);
          return JSON.stringify(response);
        },
        error: (err) => {
          return <b>{String(err.error.response.data.error)}</b>;
        },
      });

      registerPromise.then(function () { navigate('/') });
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

      <div className="flex justify-center items-center">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold text-center">Let's Get You Registered!</h4>
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
                You can upload a picture here if you want!
              </span>
              <input {...formik.getFieldProps('id')} type="number" placeholder="IUB ID" className={styles.textbox} min="1000" max="9999999" onWheel={(e) => e.target.blur()}/>
              <input {...formik.getFieldProps('email')} type="number" placeholder="Confirm IUB ID" className={styles.textbox} min="1000" max="99999999" onWheel={(e) => e.target.blur()}/>
              <input {...formik.getFieldProps('username')} type="text" placeholder="Username" className={styles.textbox}/>
              <input {...formik.getFieldProps('password')} type="password" placeholder="Password" className={styles.textbox}/>
              
              <select {...formik.getFieldProps('course')} className={styles.textbox}>
                <option value="CIS101">CIS101</option>
                <option value="CSC101">CSC101</option>
                <option value="CSC203">CSC203</option>
                <option value="CSC401">CSC401</option>
              </select>
              <input {...formik.getFieldProps('section')} type="number" placeholder="Section" className={styles.textbox} min="1" max="30" onWheel={(e) => e.target.blur()}/>
            </div>

            <div className="textbox flex flex-col items-center gap-6 my-6">
            <button type="submit" className={styles.btn}>Register</button>
            </div>

            <div className='text-center'>
              <span className='text-gray-500'>Already Registed? <Link className='text-red-500' to="/login">Login Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
