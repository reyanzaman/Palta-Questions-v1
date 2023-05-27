import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik} from 'formik';
import styles from '../styles/Username.module.css';

export default function Repository() {

    const navigate = useNavigate();

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const [topics] = useState({
      CSC101: ['All Topics','Print', 'If-Else', 'Loops'],
      CSC203: ['All Topics','Objects & Classes', 'Stacks', 'Queues'],
      CSC401: ['All Topics','SQL', 'ERD', 'XAMP'],
      General: ['All Topics','Print', 'If-Else', 'Loops']
    });

    const [now_month] = useState(currentMonth);
    const monthIndex = new Date(`${now_month} 1, 2000`).getMonth();
    const [now_year] = useState(currentYear);

    const handleChange = event => {
      const selectedCourse = event.target.value;
      formik.setFieldValue('course', selectedCourse);
      formik.setFieldValue('topic', topics[selectedCourse][0]);
    };

    const formik = useFormik({
      initialValues: {
        type: 'pre',
        course: 'CSC101',
        topic: 'All Topics',
        section: '',
        month: monthIndex,
        year: now_year
      },
      onSubmit: async (values) => {
        try {
          const { type, course, topic, section, month, year} = values;
          if(type==="pre"){
            let data = {type, course, topic, section, month, year};
            navigate('/preQuestions', { state: { data } });
          }else if(type==="post"){
            let data = {type, course, topic, section, month, year};
            navigate('/postQuestions', { state: { data } });
          }else if(type==="general"){
            let data = {type, course, topic, month, year};
            navigate('/generalQuestions', { state: { data } });
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

        <div className="flex justify-center items-center">
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
                  <option key="post" value="post">Feedback</option>
                  <option key="general" value="general">General-Questions</option>
                  <option disabled key="prequestionnaire" value="prequestionnaire" className="text-gray-200">Pre-Questionnaire</option>
                  <option disabled key="postquestionnaire" value="postquestionnaire" className="text-gray-200">Post-Questionnaire</option>
                </select>

                {formik.values.type !== "general" ? (
                  <>
                    <input {...formik.getFieldProps('section')} type="number" placeholder="Section" className={styles.textbox}/>
                  
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
                  </>
                ) : null}
                {formik.values.type === "general" ? (
                  <>
                    <select {...formik.getFieldProps('course')} className={styles.textbox} onChange={handleChange}>
                      <option value="CSC101">CSC101</option>
                      <option value="CSC203">CSC203</option>
                      <option value="CSC401">CSC401</option>
                      <option value="General">General</option>
                    </select>
                    
                    {formik.values.course !== "General" ? (
                    <>
                      <select {...formik.getFieldProps('topic')} className={styles.textbox}>
                        {topics[formik.values.course].map(topic => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </>
                    ) : null}
                  </>
                ) : null}

                <select {...formik.getFieldProps('month')} className={styles.textbox}>
                  <option value="All">Whole Year</option>
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>

                <input
                  {...formik.getFieldProps('year')}
                  type="string"
                  placeholder="Year"
                  className={styles.textbox}
                />
                
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
  