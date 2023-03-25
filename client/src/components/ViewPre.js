import React from 'react';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import { useDataStore, useAuthStore } from '../store/store';
import { useFormik } from 'formik';
import useFetch from '../hooks/fetch.hook';

export default function ViewPre(props) {

    const data = useDataStore((state) => state.data);
    const { username } = useAuthStore(state => state.auth);
    const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);
    console.log(data.myData)

    const index = props.index;
    console.log(index);

    const formik = useFormik({
        initialValues: {
          username: '',
          date: '',
          answer: '',
          paltaQuestion: ''
        },
        onSubmit: async values => {
          const currentDate = new Date();
          const options = { timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
          const formattedDate = currentDate.toLocaleString('en-US', options);
          values.date = formattedDate;
          values.username = username;

        }
    });

    if (!data) {
        return <div className="h-screen items-center text-red-500 font-bold">No questions found!</div>;
    }

    if(isLoading) return <div className="flex justify-center items-center h-screen">
        <h1 className="text-center text-2xl font-bold">Loading...</h1>
      </div>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
        <div className="container mx-auto">
          <div className="flex justify-center items-center max-w-[70%] mx-auto">
            <div className={styles.glass}>

              <p>Username: {apiData?.username || "Undefined"}</p>
              <p>Index: {index || "Undefined"}</p>

              <div className="title flex flex-col items-center p-4">
                <h4 className="text-2xl font-bold text-center">{data.myData[2]['question1']}</h4>
                <span className="py-4 w-2/3 text-center text-gray-900">
                    <p className='text-sm'>Posted by <b>{data.myData[2]['username']}</b></p>
                    <p className='text-sm'>{data.myData[2]['date']}</p>
                </span>
              </div>
  
              <div className="w-[90%] bg-gray-200 rounded-lg max-h-[42rem] overflow-x-hidden overflow-y-auto mx-auto p-6">
                
                
                <div className="pt-4">
                    <h1 className="text-2xl text-slate-800 font-black text-center">Previous Answers</h1><br></br>

                    <div className="flex flex-col items-center text-center rounded-2xl p-6 bg-slate-700 text-neutral-100">
                        <p>Here lies an answer. This answer is going to be long lorem ipsum very very long text something longer.</p>
                        <p className='text-sm pt-4 text-indigo-200'>Answered by username</p>
                        <p className='text-xs text-indigo-200'>Friday, March 24, 2023 at 2:39 PM</p>
                    </div>

                    <hr className='h-px my-6 border-0 dark:bg-gray-300'></hr>

                    <form className="py-1 flex flex-col items-center" onSubmit={formik.handleSubmit}>

                        <textarea style={{ width: '100%'}} cols="50" rows="2" {...formik.getFieldProps('answer')} type="text" placeholder="Write your answer here" className={styles.textbox}/>
                        <br></br>
                        <textarea style={{ width: '100%'}} cols="50" rows="2" {...formik.getFieldProps('paltaQuestion')} type="text" placeholder="*Ask another question here" className={styles.textbox}/>

                        <button type="submit" style={{ width: '100%', margin: '1.5rem 0 0 0'}} className={styles.btn}>Post</button>

                    </form>

                </div>
  
              </div>
  
              <div className='text-center mt-8'>
                <span><Link className='text-slate-800 font-bold text-xl border-2 border-slate-400 hover:border-indigo-500 rounded-md py-1 px-6 hover:text-indigo-500' to="/repository">Go Back</Link></span>
              </div>
  
            </div>
          </div>
        </div>
    )
}