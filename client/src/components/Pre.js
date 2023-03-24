import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { useAuthStore } from '../store/store'
import styles from '../styles/Username.module.css'
import { preQuestion } from '../helper/helper';

export default function Pre() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth);

    const [topics] = useState({
      CSC101: ['Print', 'If-Else', 'Loops'],
      CSC203: ['Objects & Classes', 'Stacks', 'Queues'],
      CSC401: ['SQL', 'ERD', 'XAMP']
    });

    const handleChange = event => {
      const selectedCourse = event.target.value;
      formik.setFieldValue('course', selectedCourse);
      formik.setFieldValue('topic', topics[selectedCourse][0]);
    };

    const formik = useFormik({
      initialValues: {
        course: 'CSC101',
        topic: 'Print',
        question1: '',
        question2: '',
        question3: '',
        isAnonymous: 'false',
      },
      onSubmit: async values => {
        const currentDate = new Date();
        const options = { timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = currentDate.toLocaleString('en-US', options);
        values.date = formattedDate;
        values.username = username;

        let prePromise = preQuestion(values)
        toast.promise(prePromise, {
          loading: 'Posting...',
          success : <b>Question Posted</b>,
          error : <b>Something seems wrong!</b>
        });

        prePromise.then(function(){ navigate('/dashboard')});
      }
    })

    return (
      <div className="container mx-auto">
        <div className="container mx-auto">

          <Toaster position='top-center' reverseOrder={false}></Toaster>

          <div className="flex justify-center items-center h-screen">
            <div className={styles.glass}>
              
              <div className="title flex flex-col items-center">
                <h4 className="text-4xl font-bold">Pre-Questions</h4>
                <span className="py-4 text-lg w-2/3 text-center text-gray-500">
                  Questions ignite the neurons in your brain
                </span>
              </div>
              
              <form className="py-1" onSubmit={formik.handleSubmit}>

                <br></br>
                <div className="textbox flex flex-col items-center gap-6">
                  
                  <select {...formik.getFieldProps('course')} className={styles.textbox} onChange={handleChange}>
                    <option value="CSC101">CSC101</option>
                    <option value="CSC203">CSC203</option>
                    <option value="CSC401">CSC401</option>
                  </select>
                  <select {...formik.getFieldProps('topic')} className={styles.textbox}>
                    {topics[formik.values.course].map(topic => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>

                  <input {...formik.getFieldProps('question1')} type="text" placeholder="Question 1" className={styles.textbox}/>
                  <input {...formik.getFieldProps('question2')} type="text" placeholder="Question 2" className={styles.textbox}/>
                  <input {...formik.getFieldProps('question3')} type="text" placeholder="Question 3" className={styles.textbox}/>

                  <label className="relative inline-flex items-center mr-5 cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" {...formik.getFieldProps('isAnonymous')}></input>
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                    dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-md font-bold text-gray-900 dark:text-gray-700">Anonymous</span>
                  </label>

                  <button type="submit" className={styles.btn}>Post</button>
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
  