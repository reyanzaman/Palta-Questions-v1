import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Username.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/store';

export default function PreQuestions() {

    const setData = useDataStore((state) => state.setData);
    const navigate = useNavigate();

    const handleClick = () => {
      setData({ myData: questions });
      navigate('/viewPre');
    };

    const location = useLocation();
    const questions = location.state?.questions;
    console.log(location.state)

    if (!questions) {
      return <div className="h-screen items-center">No questions found!</div>;
    }

    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen max-w-[80%] mx-auto">
          <div className={styles.glass}>

            <div className="title flex flex-col items-center">
              <h4 className="text-4xl font-bold text-center">Question Repository</h4>
              <span className="py-4 text-lg w-2/3 text-center text-gray-500">
                Take your pick!
              </span>
            </div>

            <div className="w-[90%] bg-gray-200 rounded-lg max-h-[45rem] overflow-x-clip overflow-y-auto mx-auto p-6">
              <div className="w-[60em]"></div>
              
              <div className="pt-4">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <h1 className='truncate lg:w-full w-[13rem] text-justify text-md font-bold hover:text-indigo-500'>
                    <Link to='/viewPre' onClick={handleClick}>{questions[2]['question1']}</Link></h1>
                  </div>
                  <div>
                    <h1 className='truncate-elipsis w-fit text-sm lg:float-right sm:float-left'>{questions[2]['date']}</h1>
                  </div>
                  <p className='text-sm pt-2'>Posted by <b>{questions[2]['username']}</b></p>
                </div>
                <hr className='h-px my-8 border-0 dark:bg-gray-300'></hr>
              </div>

            </div>

            <div className='text-center mt-8'>
              <span><Link className='text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md' to="/repository">Go Back</Link></span>
            </div>

          </div>
        </div>
      </div>
    )
  }
  