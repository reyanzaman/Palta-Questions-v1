import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik, resetForm } from 'formik';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { postGeneral } from '../helper/helper';
import useFetch from '../hooks/fetch.hook';

export default function Ask() {

    const { username } = useAuthStore(state => state.auth);
    const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);

    const [topics] = useState({
      CIS101: ['Thinking', 'Documentation', 'Data', 'Graphs', 'Ideas', 'G-Slides',
       'Questionnaire', 'Referencing', 'Computing Mechanism', 'Python Coding',
       'Final Project'],
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
        course: 'General',
        question1: '',
        isAnonymous: 'false',
        topic: '',
        month: '',
        year: ''
      },
      onSubmit: async (values, { resetForm }) => {
        const currentDate = new Date();
        const options = { 
          timeZone: 'Asia/Dhaka', 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric' 
        };
        const formattedDate = currentDate.toLocaleString('en-US', options);
        const year = currentDate.getFullYear(); // Get the current year
        const month = currentDate.getMonth();
        values.date = formattedDate.replace(/,\s\d{4}/, ''); // Remove the year from the formatted date
        values.year = year.toString(); // Set the year in the year variable
        values.month = month.toString();
        
        values.username = apiData.username;

        let prePromise = postGeneral(values)
        toast.promise(prePromise, {
          loading: 'Posting...',
          success : (response) => <b>{response}</b>,
          error: (err) => {
            return <b>{err.error.response.data.error}</b>
          },
        });

        resetForm();
      }
    })

    if(isLoading) return <div className="flex justify-center items-center h-screen">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
      <div className="container mx-auto">
        <div className="container mx-auto">

          <Toaster position='top-center' reverseOrder={false}></Toaster>

          <div className="flex justify-center items-center h-screen">
            <div className={styles.glass}>

              <div className="title flex flex-col items-center">
                <h4 className="text-4xl font-bold text-center">Ask a Question!</h4>
                <span className="py-4 text-lg w-5/6 text-center text-gray-500">
                  Don't hold it in. Ask away!
                </span>
              </div>

              <form className="py-1" onSubmit={formik.handleSubmit}>
                <br />
                <div className="textbox flex flex-col items-center gap-6">
                  <select
                    {...formik.getFieldProps('course')}
                    className={styles.textbox}
                    onChange={handleChange}
                  >
                    <option value="CIS101">CIS101</option>
                    <option value="CSC101">CSC101</option>
                    <option value="CSC203">CSC203</option>
                    <option value="CSC401">CSC401</option>
                    <option value="General">General</option>
                  </select>

                  {formik.values.course !== 'General' && (
                    <select {...formik.getFieldProps('topic')} className={styles.textbox}>
                      {topics[formik.values.course].map(topic => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  )}

                  <textarea
                    cols="30"
                    rows="3"
                    {...formik.getFieldProps('question1')}
                    type="text"
                    placeholder="Write your question here..."
                    className={styles.textbox}
                  />

                  <label className="relative inline-flex items-center mr-5 cursor-pointer">
                    {/* Rest of the code */}
                  </label>

                  <button type="submit" className={styles.btn}>
                    Post
                  </button>
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
  