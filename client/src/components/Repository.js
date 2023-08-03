import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import styles from '../styles/Username.module.css';
import { getUserDetails } from '../helper/helper';
import { useAuthStore } from '../store/store';
import useFetch from '../hooks/fetch.hook';

export default function Repository() {

  const navigate = useNavigate();

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().getDate();

  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);
  const [user, setUser] = useState({ section: '', course: '' });

  const [topics] = useState({
    CIS101: ['All Topics','Thinking', 'Documentation', 'Data', 'Graphs', 'Research Question', 'Excel', 'Ideas', 'Presentation', 'G-Slides',
        'Questionnaire', 'Referencing', 'Computing Mechanism', 'Python Coding',
        'Final Project'],
    CSC101: ['All Topics', 'Coding Environment (IDE)', 'Trace Table', 'Flow Chart', 'Variables', 'Data Types', 'Operators', 'Print', 'Conditional Statements', 'Loops', 'Nested Conditions', 'Nested Loops', 'Lists', 'Tuples', 'Functions', 'File Handling'],
    CSC203: ['All Topics', 'Python Review', 'Stacks', 'Queues', 'Pointers', 'Nodes', 'Singly Linked List',
    'Doubly Linked List', 'Recursion', 'Binary Search Tree', 'Graph', 'Hashing'],
  });

  useEffect(() => {
    async function fetchData() {
      const userDetails = await getUserDetails(apiData?.username);
      setUser(userDetails);

      const defaultTopic = userDetails && userDetails.course ? topics[userDetails.course][0] : '';
      formik.setFieldValue('topic', defaultTopic);
    }
    fetchData();
  }, [apiData]);

  const [now_month] = useState(currentMonth);
  const monthIndex = new Date(`${now_month} 1, 2000`).getMonth();
  const [now_year] = useState(currentYear);
  const [now_date] = useState(currentDate);

  const handleSemester = event => {
    const selectedSemester = event.target.value;
    formik.setFieldValue('semester', selectedSemester);
  };

  const formik = useFormik({
    initialValues: {
      type: 'pre',
      course: '',
      topic: 'All Topics',
      section: '',
      semester: 'Spring',
      month: monthIndex,
      date: now_date,
      year: now_year
    },
    onSubmit: async (values) => {
      values.course = user?.course;
      values.section = user?.section;

      try {
        const { type, course, topic, section, semester, date, month, year } = values;
        if (type === "pre") {
          let data = { type, course, topic, section, date, month, year };
          navigate('/preQuestions', { state: { data } });
        } else if (type === "post") {
          let data = { type, course, topic, section, date, month, year };
          navigate('/postQuestions', { state: { data } });
        } else if (type === "general") {
          let data = { type, date, month, year };
          navigate('/generalQuestions', { state: { data } });
        } else if (type === "prequestionnaire" || type === "postquestionnaire") {
          let data = { type, course, section, semester, year };
          navigate('/viewQuestionnaire', { state: { data } });
        } else {
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
            <h4 className="text-4xl font-bold text-center">Palta Questions</h4>
            <span className="py-4 text-lg w-7/8 text-center text-gray-500">
              Learn deeper using palta questions!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <br></br>
            <div className="textbox flex flex-col items-center gap-6">

              <select {...formik.getFieldProps('type')} className={styles.textbox}>
                <option key="pre" value="pre">Pre-Questions</option>
                <option key="general" value="general">General-Questions</option>
                {/* <option key="post" value="post">Feedback</option> */}
                {/* <option key="prequestionnaire" value="prequestionnaire">Pre-Questionnaire</option> */}
                {/* <option key="postquestionnaire" value="postquestionnaire">Post-Questionnaire</option> */}
              </select>

              {formik.values.type === "prequestionnaire" || formik.values.type === "postquestionnaire" ? (
                <>
                  <select {...formik.getFieldProps('semester')} className={styles.textbox} onChange={handleSemester}>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                  </select>

                  <input
                    {...formik.getFieldProps('year')}
                    type="string"
                    placeholder="Year"
                    className={styles.textbox}
                  />
                </>
              ) :
                <>
                  {formik.values.type !== "general" ? (
                    <>
                      {formik.values.type === "pre" ? (
                        <>
                          <select {...formik.getFieldProps('topic')} className={styles.textbox}>
                            {topics[user?.course] && topics[user?.course].map(topic => (
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

                  <input {...formik.getFieldProps('date')} type="number" onWheel={(e) => e.target.blur()} placeholder="Date" className={styles.textbox} />

                  <input
                    {...formik.getFieldProps('year')}
                    type="string"
                    placeholder="Year"
                    className={styles.textbox}
                  />
                </>
              }
              <button type="submit" className={styles.btn}>Search</button>
            </div>
          </form>

          <div className='text-center mt-4'>
            <span><Link className='text-indigo-500' to="/dashboard">Dashboard</Link></span>
          </div>

        </div>
      </div>
    </div>
  )
}
