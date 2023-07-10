import React, { useState, useEffect } from 'react';
import styles from '../styles/Username.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik, resetForm } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { postGeneral, findGeneralAll } from '../helper/helper';
import avatar from '../assets/profile_blank.png';
import useFetch from '../hooks/fetch.hook';

export default function Homepage() {
  const navigate = useNavigate();

  const username = localStorage.getItem('token') ? localStorage.getItem('username') : "guest";
  const [questions, setQuestions] = useState(null);
  
  if(username===undefined || username==="undefined"){
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  }
  
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  // logout handler function
  function logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  }

  const currentDate = new Date();
  const options = {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const formattedDate = currentDate.toLocaleString('en-US', options);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  //Getting questions
  useEffect(() => {
    const fetchData = async () => {
      const questions = await findGeneralAll('general', month, year);
      setQuestions(questions);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [month, year]);

  const formik = useFormik({
    initialValues: {
      username: 'guest',
      type: 'general',
      course: 'General',
      date: '',
      question1: '',
      q1Score: '',
      isAnonymous: 'false',
      month: '',
      year: '',
    },
    onSubmit: async (values, { resetForm }) => {
      values.date = formattedDate.replace(/,\s\d{4}/, '');
      values.year = year.toString();
      values.month = month.toString();
      values.username = apiData?.username;
      values.type = 'general';
      values.course = 'General';
      values.isAnonymous = false;

      let prePromise = postGeneral(values);
      toast.promise(prePromise, {
        loading: 'Posting...',
        success: (response) => <b>{response}</b>,
        error: (err) => {
          return <b>{err.error.response.data.error}</b>;
        },
      });

      const updatedQuestions = await findGeneralAll('general', month, year);
      setQuestions(updatedQuestions);
      resetForm();
    },
  });

  if (!questions) {
    return <div className="h-screen flex items-center justify-center text-2xl">Loading...</div>;
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-screen flex items-center justify-center text-2xl">Loading...</div>
      </div>
    );
  if (serverError) {
    window.location.reload();
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center">
        <div className={styles.glass}>
          <div className="flex flex-row justify-between items-center mb-12">
            <div className="flex flex-row gap-4 mx-6 mt-5">
              {apiData.username!=="guest" ? (<>
              <ul className="flex flex-row gap-4">
                <li className="text-lg text-gray-500 mb-1 hover:text-indigo-400">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="text-lg text-gray-500 mb-1 hover:text-indigo-400">
                  <Link onClick={logout}>Logout</Link>
                </li>
              </ul>
              </>) : (<>
                <ul className="flex flex-row gap-4">
                <li className="text-lg text-gray-500 mb-1 hover:text-indigo-400">
                  <Link to="/login">Login</Link>
                </li>
                <li className="text-lg text-gray-500 hover:text-indigo-400">
                  <Link to="/register">Register</Link>
                </li>
              </ul>
              </>)}
            </div>
            <img src={apiData?.username? apiData?.profile ? apiData?.profile : avatar : avatar} className={styles.profile_img_small} alt="avatar" />
          </div>

          <h1 className={styles.logo}>Palta Question</h1>

          <div className="w-[100%] mx-auto drop-shadow-sm rounded-lg p-1 py-5 md:p-6">
            <form className="py-1 flex flex-col items-center" onSubmit={formik.handleSubmit}>
              <textarea
                style={{ width: '100%' }}
                cols="50"
                rows="2"
                {...formik.getFieldProps('question1')}
                type="text"
                placeholder="Try asking a question!"
                className={styles.textbox}
              />

              <button type="submit" style={{ width: '100%', margin: '1rem 0 0 0', padding: '.8rem' }} className={styles.btn}>
                Post
              </button>
            </form>
          </div>

          <hr className='md:mb-4 md:mt-4 mb-2 mt-2'></hr>

          <div className="pt-4">
            {questions
              .slice()
              .reverse()
              .slice(0,4) //Only displays 4 latest questions
              .map((question, questionIndex) => (
                <div key={questionIndex} className="mb-6 drop-shadow-sm border border-stone-200 flex flex-col rounded-2xl py-4 px-4 bg-gray-100 text-gray-700">
                  <p className="w-full text-center md:text-justify mb-2">{question.question1}</p>
                  <div className="grid lg:grid-cols-2 sm:grid-cols-1">
                    <div className="md:text-left text-center md:w-max">
                      <p className="text-xs pt-2 text-gray-700">Posted by {question.isAnonymous==="true" ? 'Anonymous User' : question.username}</p>
                      <p className="text-xs text-gray-700">
                        {question.date} {question.year}
                      </p>
                    </div>
                    <div className="md:text-right text-center">
                      <p className="text-md text-gray-500 mt-6">Question Score: {question.q1Score}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <hr></hr>
          <br></br>

          <div className="flex justify-center items-center">
            <Link className="text-center text-neutral-50 font-bold hover:bg-red-400 bg-indigo-500 py-3 px-16 rounded-md" to="/rules">
              Rules & Usage Guidelines
            </Link>
          </div>

          <br></br>

          <hr className="border-t-2 border-gray-300"></hr>
          <div className='relative text-center py-2'>
            <span className='text-gray-500'>©IUB-QuBAN Team 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
}
