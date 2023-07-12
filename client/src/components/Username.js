import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

import styles from '../styles/Username.module.css'

export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername)

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username)
      navigate('/password')
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold text-center">Welcome to Palta-Q</h4>
            <span className="py-4 text-lg w-2/3 text-center text-gray-500">
              Kindle your brain through questioning
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
              <br></br><br></br>
            </div>
            <br></br>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} type="text" placeholder="Username" className={styles.textbox}/>
              <button type="submit" className={styles.btn}>Continue</button>
            </div>
            <br></br>
            <p className="text-xs text-center text-gray-500">User not found?<p>
              Check if you entered an extra space character</p></p>

            <div className='text-center py-4'>
              <span><Link className='text-red-500' to="/recoverUsername">Forgot Username?</Link></span>
            </div>
            <div className='text-center md:flex md:col-span-2 col-span-1 justify-center'>
              <div className='text-gray-500 font-bold bg-gray-100 py-2 px-8 md:px-12 mx-2 my-5 md:my-3 rounded-xl drop-shadow-md hover:bg-gray-200'>
                <Link to="/">Home </Link>
              </div>
              <div className='text-gray-500 font-bold bg-gray-100 py-2 px-8 md:px-12 mx-2 my-5 md:my-3 rounded-xl drop-shadow-md hover:bg-gray-200'>
                <Link to="/register">Register </Link>
              </div>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
