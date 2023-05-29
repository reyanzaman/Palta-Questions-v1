import React from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { recoverUsername } from '../helper/helper'

import styles from '../styles/Username.module.css'

export default function RecoverUsername() {

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values, { resetForm }) => {
        let prePromise = recoverUsername(values)
        toast.promise(prePromise, {
          loading: 'Posting...',
          success : (response) => <b>{response}</b>,
          error: (err) => {
            return <b>{err}</b>
          },
        });
        resetForm();
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Username Recovery</h4>
            <span className="py-4 text-lg w-9/10 text-center text-gray-500">
              Type your email to get your username
            </span>
          </div>

          <br></br>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} type="email" placeholder="Email" className={styles.textbox}/>
              <button type="submit" className={styles.btn}>Submit</button>
            </div>

            <div className='text-center mt-8 mb-4'>
              <span className='text-gray-500'><Link className='text-gray-500 font-bold bg-gray-100 py-2 px-12 mx-2 rounded-xl drop-shadow-md hover:bg-gray-200' to="/">Home </Link></span>
              <span className='text-gray-500'><Link className='text-gray-500 font-bold bg-gray-100 py-2 px-12 mx-2 rounded-xl drop-shadow-md hover:bg-gray-200' to="/login">Login </Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
