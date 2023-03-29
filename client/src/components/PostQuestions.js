import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';

export default function PostQuestions() {

    const location = useLocation();
    const questions = location.state?.questions;
    console.log("Questions: ",questions)

    if (!questions) {
      return <div className="h-screen items-center">No questions found!</div>;
    }

    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen max-w-[80%] mx-auto">
          <div className={styles.glass}>

            <div className="title flex flex-col items-center">
              <h4 className="text-4xl font-bold text-center">Feedback Repository</h4>
              <span className="py-4 text-lg w-2/3 text-center text-gray-500">
                Take a peek at everyone's progress!
              </span>
            </div>

            <div className="w-[90%] bg-gray-200 rounded-lg max-h-[45rem] overflow-x-clip overflow-y-auto mx-auto p-6">
              <div className="w-[60em]"></div>
              
              {questions.slice().reverse().map((question, index) => (
                  <div key={index} className="pt-4">
                    <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                      <div>
                        <div className='lg:w-full text-left'>
                          <h1 className='text-md text-indigo-500 font-bold'>What I learned this class:</h1>
                          <p className='text-md'>{question['thisclass']}</p>
                          <h1 className='text-md text-indigo-500 font-bold'>What I want to learn next class:</h1>
                          <p className='text-md'>{question['nextclass']}</p>
                        </div>
                      </div>
                      <div>
                        <h1 className='w-fit text-sm lg:float-right sm:float-left'>{question['date']}</h1>
                      </div>
                      <p className='text-sm pt-2'>Posted by <b>{question['isAnonymous']==='true' ? 'Anonymous User' : question['username']}</b></p>
                    </div>
                    <hr className='h-px mt-4 border-0 dark:bg-gray-300'></hr>

                  </div>
                ))}

            </div>

            <div className='text-center mt-8'>
              <span><Link className='text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md' to="/repository">Go Back</Link></span>
            </div>

          </div>
        </div>
      </div>
    )
  }
  