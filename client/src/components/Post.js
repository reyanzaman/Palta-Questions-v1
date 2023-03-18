import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { useAuthStore } from '../store/store'
import styles from '../styles/Username.module.css'

export default function Post() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth);

    const formik = useFormik({
      initialValues: {
        course: '',
        topic: '',
        question1: '',
        question2: '',
        question3: ''
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
                <h4 className="text-4xl font-bold">Post-Questions</h4>
                <span className="py-4 text-lg w-2/3 text-center text-gray-500">
                  Let us help you learn better. Share your thoughts!
                </span>
              </div>

              <form className="py-1" onSubmit={formik.handleSubmit}>

                <br></br>
                <div className="textbox flex flex-col items-center gap-6">
                  
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
                  <textarea cols="30" rows="3" {...formik.getFieldProps('thisclass')} type="text" placeholder="What did you learn today?" className={styles.textbox}/>
                  <textarea cols="30" rows="3" {...formik.getFieldProps('nextclass')} type="text" placeholder="What do you want to learn tomorrow?" className={styles.textbox}/>
                  
                  <button type="submit" className={styles.btn}>Post</button>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }
  