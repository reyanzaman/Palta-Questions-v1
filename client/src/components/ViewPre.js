import React, { useState, useEffect } from 'react';
import styles from '../styles/Username.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore, useAuthStore } from '../store/store';
import { useFormik, resetForm } from 'formik';
import useFetch from '../hooks/fetch.hook';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'
import { postComments, findComments } from '../helper/helper';

export default function ViewPre() {

    const [data, setData] = useDataStore((state) => [state.data, state.setData]);
    const { username } = useAuthStore(state => state.auth);
    const navigate = useNavigate();

    const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);

    let questions = data?.myData;

    const location = useLocation();
    const index = location.pathname.split('/')[2];
    const id = location.pathname.split('/')[3];

    var quesScore = 0;
    if(id==="question1"){
      quesScore = data?.myData[index]['q1Score'];
    }else if(id==="question2"){
      quesScore = data?.myData[index]['q2Score'];
    }else{
      quesScore = data?.myData[index]['q3Score'];
    }

    const [state, setState] = useState({
      comments: null,
      current_question: 1,
      current_page: 1,
      totalQuestions: null,
    })
  
    const { comments, current_question, current_page, totalQuestions } = state;

    //Keeping local storage updated
    useEffect(() => {
      const storedData = localStorage.getItem('myData');
      if(!storedData){
        localStorage.setItem('myData', JSON.stringify(data));
      }else if(storedData){
        const myData = JSON.parse(storedData);
        setData(myData);
      }
    }, []);

    //Getting previous comments
    useEffect(() => {
      async function fetchData() {
        if (questions && questions[index] && questions[index][id]) {
          const comments = await findComments(data.myData[index][id]);
          setState({ ...state, comments: comments, totalQuestions: comments[0].comments.length });
        }
      }
      fetchData();

      const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds

      return () => {
        clearInterval(intervalId); // Clean up the interval on component unmount
      };
    }, [data, index, id]);

    const formik = useFormik({
      initialValues: {
        author: '',
        usernames: '',
        date: '',
        question: '',
        qScore: '',
        comments: '',
        course: '',
        topic: '',
        isAnonymous: '',
        section: '',
        semester: '',
        month: '',
        year: '',
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
        values.date = formattedDate;
        values.author = data.myData[index]['username'];
        values.usernames = apiData?.username;
        values.course = data.myData[index]['course'];
        values.topic = data.myData[index]['topic'];
        values.section = data.myData[index]['section'];
        values.semester = data.myData[index]['semester'];
        values.month = data.myData[index]['month'];
        values.year = data.myData[index]['year'];
    
        if (questions && questions[index] && questions[index][id]) {
          values.question = data.myData[index][id];
          values.qScore = quesScore;
        }
    
        let prePromise = postComments(values);
        await toast.promise(prePromise, {
          loading: 'Posting...',
          success: (response) => <b>{response}</b>,
          error: (err) => {
            return <b>{err.error.response.data.error}</b>;
          },
        });
    
        const comments = await findComments(data.myData[index][id]);
        setState({ ...state, comments: comments });

        resetForm();
      }
    });      

    // Add a check for data here
    if (!data || !data.myData) {
        return <div className="h-screen items-center text-red-500 text-2xl">No questions found!</div>;
    }

    if(isLoading) return <div className="flex justify-center items-center h-screen">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    const questionPerPage = 15;
    const totalPages = Math.ceil(totalQuestions / questionPerPage);

    const nextPage = () => {
      if (current_page + 1 > totalPages) {
        return current_page;
      } else {
        return current_page + 1;
      }
    };

    const prevPage = () => {
      if (current_page - 1 < 1) {
        return current_page;
      } else {
        return current_page - 1;
      }
    };

    const handlePaginate = (value) => {
      let new_question = 0;
      if (value === "next") {
        const new_page = nextPage();
        if (current_question + questionPerPage <= totalQuestions) {
          new_question = current_question + questionPerPage;
        } else {
          new_question = current_question;
        }
        setState({ ...state, current_page: new_page, current_question: new_question });
      } else if (value === "prev") {
        const new_page = prevPage();
        if (current_question - questionPerPage >= 1) {
          new_question = current_question - questionPerPage;
        } else {
          new_question = current_question;
        }
        setState({ ...state, current_page: new_page, current_question: new_question });
      }
    };  

    const goPrevious = () => {
      navigate(-1);
    }

    return (
        <div className="container mx-auto">

          <Toaster position='top-center' reverseOrder={false}></Toaster>

          <div className="flex justify-center items-center">
            <div className={styles.glass}>

              <div className="title flex flex-col items-center p-4">
                <h4 className="text-lg font-bold w-[90%] text-center">{data.myData[index][id]}</h4>
                <span className="py-4 w-5/6 text-center text-gray-900">
                    <p className='text-md text-indigo-500'>Posted by <b>{data.myData[index]['isAnonymous']==='true' ? 'Anonymous User' : data.myData[index]['username']}</b></p>
                    <p className='text-sm'>{data.myData[index]['date']}</p>
                    <p className='text-sm'>{data.myData[index]['semester'] + " " + data.myData[index]['year'] + " " + "Section: " + data.myData[index]['section']}</p>
                    <p className='text-md pt-2 text-indigo-500 font-bold'>Question Score: {quesScore}</p>
                </span>
              </div>
  
              <div className="w-[100%] sm:w-[90%] bg-gray-200 drop-shadow-sm rounded-lg max-h-[32rem] md:max-h-[26rem] overflow-x-hidden overflow-y-auto mx-auto p-6">
                
                
                <div className="pt-4">
                    <h1 className="text-xl text-slate-800 font-black text-center">Palta Questions</h1><br></br>
                    
                    {comments && comments.map((comment, index) => {
                      const reversedComments = [...comment.comments].reverse();
                      const reversedCScores = [...comment.cScore].reverse();
                      const reversedIsAnonymous = [...comment.isAnonymous].reverse();
                      const reversedUsernames = [...comment.usernames].reverse();
                      const reversedDates = [...comment.date].reverse();

                      return reversedComments.slice(current_question - 1, current_question + questionPerPage - 1).map((commentText, commentIndex) => (
                        <div key={commentIndex} className="mb-6 flex flex-col items-center text-center rounded-2xl p-6 bg-slate-700 text-neutral-100">
                          <p className={styles.truncateLines2}>{commentText}</p>
                          <p className='text-xs pt-2 text-indigo-100'>Posted by {reversedIsAnonymous[commentIndex] ? 'Anonymous User' : reversedUsernames[commentIndex]}</p>
                          <p className='text-xs text-indigo-100'>{reversedDates[commentIndex]}</p>
                          <p className='text-sm pt-2 font-bold text-indigo-200'>Comment Score: {reversedCScores[commentIndex]}</p>
                        </div>
                      ));
                    })}

                </div>
  
              </div>

              <div className='flex flex-col items-center justify-center pt-4'>

                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-semibold text-indigo-500">{current_question}</span> to <span className="font-semibold text-indigo-500">{(current_question + questionPerPage - 1) > totalQuestions ? totalQuestions : (current_question + questionPerPage - 1)}</span> of <span className="font-semibold text-indigo-500">{totalQuestions}</span> Entries
                  </span>
                  <div className="inline-flex mt-2 xs:mt-0">
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => handlePaginate("prev")}>
                      <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                      Prev
                    </button>
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => handlePaginate("next")}>
                      Next
                      <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                </div>

              </div>

              <div className="w-[100%] sm:w-[90%] bg-gray-200 mx-auto drop-shadow-sm rounded-lg p-6 mt-8">

                  <form className="py-1 flex flex-col items-center" onSubmit={formik.handleSubmit}>

                      <textarea style={{ width: '100%'}} cols="50" rows="2" {...formik.getFieldProps('comments')} type="text" placeholder="Type another question here" className={styles.textbox}/>

                      <div className='pt-6'>
                        <label className="relative inline-flex items-center mr-5 cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" {...formik.getFieldProps('isAnonymous')}></input>
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                          peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                          dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                          <span className="ml-3 text-md font-bold text-gray-900 dark:text-gray-700">Anonymous</span>
                        </label>
                      </div>

                      <button type="submit" style={{ width: '100%', margin: '1.5rem 0 0 0'}} className={styles.btn}>Post</button>

                  </form>

              </div>
  
              <div className='text-center mt-8 flex flex-row justify-center gap-4'>
                <span><Link className='text-slate-800 font-bold text-xl border-2 border-slate-400 hover:border-indigo-500 rounded-md py-1 px-6 hover:text-indigo-500' onClick={goPrevious}>Go Back</Link></span>
                <span><Link className='text-slate-800 font-bold text-xl border-2 border-slate-400 hover:border-indigo-500 rounded-md py-1 px-6 hover:text-indigo-500' to="/dashboard">Go Home</Link></span>
              </div>
  
            </div>
          </div>
        </div>
    )
}