import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { useAuthStore } from '../store/store'
import styles from '../styles/Username.module.css'

export default function Repository() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth);

    const formik = useFormik({
      initialValues: {
        course: '',
        topic: '',
        type: ''
      },
      onSubmit: async values => {
        navigate('/dashboard')
      }
    })

    return (
      <div className="container mx-auto">
        <div className="container mx-auto">

          <Toaster position='top-center' reverseOrder={false}></Toaster>

          <div className="flex justify-center items-center h-screen">
            <div className={styles.glass}>

              <div className="title flex flex-col items-center">
                <h4 className="text-4xl font-bold text-center">Question Repository</h4>
                <span className="py-4 text-lg w-2/3 text-center text-gray-500">
                  Explore the vast bank of questions!
                </span>
              </div>

              <form className="py-1" onSubmit={formik.handleSubmit}>

                <br></br>
                <div className="textbox flex flex-col items-center gap-6">
                  
                  <select {...formik.getFieldProps('type')} className={styles.textbox}>
                    <option value="CSC101">Pre-Questions</option>
                    <option value="CSC203">Post-Questions</option>
                    <option disabled value="CSC401" className="text-gray-200">Pre-Questionnaire</option>
                    <option disabled value="CSC401" className="text-gray-200">Post-Questionnaire</option>
                  </select>
                  <select {...formik.getFieldProps('course')} className={styles.textbox}>
                    <option value="CSC101">CSC101</option>
                    <option value="CSC203">CSC203</option>
                    <option value="CSC401">CSC401</option>
                  </select>
                  <select {...formik.getFieldProps('topic')} className={styles.textbox}>
                    <option value="CSC101">Python Basic</option>
                    <option value="CSC203">Loops</option>
                    <option value="CSC401">If-Else</option>
                  </select>
                  
                  <button type="submit" className={styles.btn}>Search</button>
                </div>

              </form>

              <div className='text-center mt-4'>
                <span><Link className='text-indigo-500' to="/dashboard">Back to Dashboard</Link></span>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
  