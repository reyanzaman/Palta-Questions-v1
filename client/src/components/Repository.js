import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik} from 'formik';
import styles from '../styles/Username.module.css';
import { findQuestions } from '../helper/helper';
import { useDetailStore } from '../store/store';

export default function Repository() {

    const navigate = useNavigate();
    const setDetail = useDetailStore((state) => state.setDetail);

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
        type: 'pre',
        course: 'CSC101',
        topic: 'Print'
      },
      onSubmit: async (values) => {
        try {
          const { type, course, topic } = values;
          let questions = await findQuestions(type, course, topic)
          const detail = [type, course, topic];
          localStorage.setItem('detail', '');
          console.log("Setting details to: ", detail)
          setDetail(detail);
          if(type==="pre"){
            navigate('/preQuestions', { state: { questions } });
          }else if(type==="post"){
            navigate('/postQuestions', { state: { questions } });
          }else if(type==="prequestionnaire"){
            navigate()
          }else if(type==="postquestionnaire"){
            navigate()
          }else{
            return toast.error('Some Random Error has occured!')
          }
        } catch (error) {
          console.error(error);
        }
      },
    })

    return (
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
                  <option key="pre" value="pre">Pre-Questions</option>
                  <option key="post" value="post">Post-Questions</option>
                  <option key="general" value="general">General-Questions</option>
                  <option disabled key="prequestionnaire" value="prequestionnaire" className="text-gray-200">Pre-Questionnaire</option>
                  <option disabled key="postquestionnaire" value="postquestionnaire" className="text-gray-200">Post-Questionnaire</option>
                </select>
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
                
                <button type="submit" className={styles.btn}>Search</button>
              </div>

            </form>

            <div className='text-center mt-4'>
              <span><Link className='text-indigo-500' to="/dashboard">Back to Dashboard</Link></span>
            </div>

          </div>
        </div>
      </div>
    )
  }
  