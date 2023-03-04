import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/profile_blank.png'
import { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'

import styles from '../styles/Username.module.css'

export default function Dashboard() {

  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues: {
      email: '',
      id: '',
      username: '',
      password: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || ''})
      console.log(values)
    }
  })

  /** formit doesn't support file upload so we need to create this handler*/
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{width: "45%", height:"90%"}}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Question Based Learning</h4>
          </div>
          <br></br>

          <form className="py-" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              
              <label htmlFor="profile">
                <img src={file || avatar } className={styles.profile_img} alt="avatar" />
              </label>

              <input onChange={onUpload} type="file" id='profile' name='profile'/>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="flex justify-center items-center py-4 text-3xl w-2/3 text-center text-gray-500">
                User Name
              </div>
            </div>

            

            <div className='text-center py-4'>
              <span className='text-gray-500'>© Independent University Bangladesh 2023</span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
