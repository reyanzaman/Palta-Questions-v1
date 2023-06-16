import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import { findQuestionnaire } from "../helper/helper";

export default function ViewQuestionnaire() {

    const location = useLocation();
    const [state, setState] = useState({
      questions: null,
      current_question: 1,
      current_page: 1
    })
  
    const { questions, current_question, current_page } = state;

    const data = location.state?.data;
  
    useEffect(() => {
      async function fetchData() {
        if (data) {
          const questions = await findQuestionnaire(
            data?.type,
            data?.course,
            data?.section,
            data?.semester,
            data?.year
          );
          setState((prevState) => ({ ...prevState, questions: questions }));
        }
      }
      fetchData();
      console.log(questions);
      console.log("Course: ", data?.course, "Semester: ", data?.semester);
  
      const intervalId = setInterval(fetchData, 15000); //every 15 seconds
  
      return () => {
        clearInterval(intervalId);
      };
    }, [data]);

    if (!questions) {
      return <div className="h-screen items-center">No questionnaire found!</div>;
    }

    const totalQuestions = questions.length;
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

    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className={styles.glass} style={{minWidth: '100%'}}>

            <div className="title flex flex-col items-center">
              <h4 className="text-4xl font-bold text-center">Questionnaire Repository</h4>
              <span className="py-4 text-lg w-2/3 text-center text-gray-500">
                Let's Analyze the Data!
              </span>
            </div>

            <div className="w-[100%] sm:w-[90%] bg-gray-200 rounded-lg max-h-[30rem] overflow-x-clip overflow-y-auto mx-auto p-6">
              <div className="w-[60em]"></div>

              {questions.slice().reverse().slice(current_question-1 , current_question + questionPerPage - 1).map((question, index) => (
                  <div key={index}>

                    {question['type']==="pre" ? <>

                    <div className='text-center'>
                      <p className='text-xl pt-6'>Posted by <b>{question['isAnonymous']==='true' ? 'Anonymous User' : question['username']}</b></p>
                      <p className='text-sm'>Semeter: <b>{question['semester']}</b></p>
                      <p className='text-sm mb-2'>{question['date']}</p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>If we implement a new teaching method, would you be interested to give it a try?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['teachingMethod']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>How much does programming excite you?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['programmingExcite']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>Do you look forward to this course?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['lookForward']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>Can you please justify why?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['justification']}</p></p>
                      <br></br>
                    
                      <h1 className='text-md text-gray-800 font-bold'>Have you thought about the contents of this course?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['contents']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>What do you expect to learn from this course?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['expectations']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>Why did you choose this course?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['whyChooseCourse']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>Approximately how many questions did you ask when you were small?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['questionsAskedSmall']}</p></p>
                      <br></br>

                      <h1 className='text-md text-gray-800 font-bold'>Approximately how many questions do you ask now on a daily basis?</h1>
                      <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['questionsAskedDaily']}</p></p>
                      <br></br>
                    </div>

                    </> : question['type']==="post" ? <>

                      <div className='text-center'>
                        <p className='text-xl pt-6'>Posted by <b>{question['isAnonymous']==='true' ? 'Anonymous User' : question['username']}</b></p>
                        <p className='text-sm'>Semeter: <b>{question['semester']}</b></p>
                        <p className='text-sm mb-2'>{question['date']}</p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>Do you wish to elect similar courses in the future?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['similarCourse']}</p></p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>After doing this course, how much does programming excite you now?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['programmingExcite']}</p></p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>How much would you like to pursue on the contents of this course further?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['pursueContents']}</p></p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>Can you please justify why?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['justification']}</p></p>
                        <br></br>
                      
                        <h1 className='text-md text-gray-800 font-bold'>Have you thought about the contents of this course?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['contents']}</p></p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>What else would you have liked to learn from this course?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['whatElseLearn']}</p></p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>Approximately how many questions do you ask on a daily basis after completing this course?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['questionsAskedDaily']}</p></p>
                        <br></br>

                        <h1 className='text-md text-gray-800 font-bold'>Would you recommend this course to others?</h1>
                        <p className='text-md'>Answer: <p className='inline text-gray-600'>{question['recommend']}</p></p>
                        <br></br>
                      </div>

                    </>: null}
                    
                    <hr className='h-px mt-4 border-0 dark:bg-gray-400'></hr>
                    <hr className='h-px mt-px border-0 dark:bg-gray-400'></hr>
                    <hr className='h-px mt-px border-0 dark:bg-gray-400'></hr>

                  </div>
                ))}

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

            <div className='text-center mt-8 flex flex-row justify-center gap-6'>
              <span><Link className='text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md' to="/repository">Go Back</Link></span>
              <span>
              <Link
                className="text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md"
                to="/dashboard"
              >
                Go Home
              </Link>
              </span>
            </div>

          </div>
        </div>
      </div>
    )
  }
  