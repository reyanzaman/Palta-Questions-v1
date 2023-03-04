import React from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { resetPasswordValidation } from '../helper/validate'

import styles from '../styles/Username.module.css'

export default function Reset() {

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: '',
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      console.log(values)
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset Password</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter a new password you defintely won't forget! It better not be password123!
            </span>
          </div>

          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} type="password" placeholder="New Password" className={styles.textbox}/>
              <input {...formik.getFieldProps('confirm_pwd')} type="password" placeholder="Cofirm Your Password" className={styles.textbox}/>
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

