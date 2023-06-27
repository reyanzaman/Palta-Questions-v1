import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik} from 'formik';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { postQuestion } from '../helper/helper';
import useFetch from '../hooks/fetch.hook';

export default function Post() {

    const { username } = useAuthStore(state => state.auth);
    const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);

    const [topics] = useState({
      CIS101: [' Thinking', 'Documentation', 'Data', 'Graphs', 'Excel', 'Ideas', 'G-Slides',
        'Questionnaire', 'Referencing', 'Computing Mechanism', 'Python Coding',
        'Final Project'],
      CSC101: ['Coding Environment (IDE)', 'Variables', 'Data Types', 'Operators', 'Print', 'Conditional Statements', 'Loops', 'Nested Conditions', 'Nested Loops', 'Lists', 'Tuples', 'Functions', 'File Handling'],
      CSC203: ['Python Review', 'Stacks', 'Queues', 'Pointers', 'Nodes', 'Singly Linked List',
      'Doubly Linked List', 'Recursion', 'Recursion', 'Binary Search Tree', 'Graph', 'Hashing'],
    });

    const [sections] = useState({
      CIS101: ['10', '11'],
      CSC101: ['5'],
      CSC203: ['10']
    });

    const handleChange = event => {
      const selectedCourse = event.target.value;
      formik.setFieldValue('course', selectedCourse);
      formik.setFieldValue('topic', topics[selectedCourse][0]);
      formik.setFieldValue('section', sections[selectedCourse][0]);
    };

    const formik = useFormik({
      initialValues: {
        username: '',
        course: 'CIS101',
        topic: 'Thinking',
        thisclass: '',
        nextclass: '',
        date: '',
        isAnonymous: 'false',
        section: '',
        semester: 'Summer',
        month: '',
        year: ''
      },
      onSubmit: async values => {
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

        let postPromise = postQuestion(values)
        toast.promise(postPromise, {
          loading: 'Posting...',
          success : (response) => <b>{response}</b>,
          error: (err) => {
            return <b>{err.error.response.data.error}</b>
          }
        });
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

          <div className="flex justify-center items-center">
            <div className={styles.glass}>

              <div className="title flex flex-col items-center">
                <h4 className="text-4xl font-bold">Post-Class Feedback</h4>
                <span className="py-4 text-lg w-4/5 text-center text-gray-500">
                  Let us help you learn better. Share your thoughts!
                </span>
              </div>

              <form className="py-1" onSubmit={formik.handleSubmit}>

                <br></br>
                <div className="textbox flex flex-col items-center gap-6">
                  
                  <select {...formik.getFieldProps('course')} className={styles.textbox} onChange={handleChange}>
                    <option value="CIS101">CIS101</option>
                    <option value="CSC101">CSC101</option>
                    <option value="CSC203">CSC203</option>
                  </select>
                  <select {...formik.getFieldProps('topic')} className={styles.textbox}>
                    {topics[formik.values.course].map(topic => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>

                  <select {...formik.getFieldProps('section')} className={styles.textbox}>
                    {sections[formik.values.course].map(topic => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                    ))}
                  </select>
                  
                  <select {...formik.getFieldProps('semester')} className={styles.textbox}>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                  </select>

                  <textarea cols="30" rows="3" {...formik.getFieldProps('thisclass')} type="text" placeholder="What did you learn today?" className={styles.textbox}/>
                  <textarea cols="30" rows="3" {...formik.getFieldProps('nextclass')} type="text" placeholder="What do you want to learn tomorrow?" className={styles.textbox}/>
                  
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
  