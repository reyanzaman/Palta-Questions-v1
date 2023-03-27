import React, { useState, useEffect } from 'react';
import styles from '../styles/Username.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore, useAuthStore, useDetailStore } from '../store/store';
import { useFormik } from 'formik';
import useFetch from '../hooks/fetch.hook';
import { useLocation } from 'react-router-dom';
<<<<<<< HEAD
import toast, { Toaster } from 'react-hot-toast'
import { postAnswer, findAnswers } from '../helper/helper';
=======
>>>>>>> parent of d92bc0c (small changes)

export default function ViewPre() {

    const [data, setData] = useDataStore((state) => [state.data, state.setData]);
    const { username } = useAuthStore(state => state.auth);
    const [detail, setDetail] = useDetailStore(state => [state.detail, state.setDetail]);
    const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);
    // console.log("Data: ", data?.myData)
    // console.log("detail: ", detail)

    const location = useLocation();
<<<<<<< HEAD
    const index = location.pathname.split('/')[2];
    const id = location.pathname.split('/')[3];
    // console.log("Location: ",location)

    const navigate = useNavigate();
    const [answers, setAnswers] = useState(null);

    useEffect(() => {
      const storedData = localStorage.getItem('myData');
      const storedDetail = localStorage.getItem('detail');

      if(!storedData){
        localStorage.setItem('myData', JSON.stringify(data));
      }else if(!storedDetail){
        localStorage.setItem('detail', JSON.stringify(detail));
      }else if(storedData){
        const myData = JSON.parse(storedData);
        setData(myData);
      }else if(storedDetail){
        const myDetail = JSON.parse(storedDetail);
        setDetail(myDetail);
      }
      // console.log("Stored Data: ", JSON.parse(storedData));
      // console.log("Stored Detail: ", JSON.parse(storedDetail));

    }, []);

    useEffect(() => {
      async function fetchData() {
        // Add a check for data.myData here
        if (data?.myData && data?.myData[index] && data?.myData[index][id]) {
          const answer = await findAnswers(data.myData[index][id]);
          setAnswers(answer);
        }
      }
      fetchData();
    }, [data, index, id]); // Add data to the dependencies array

    // console.log("Answers: ", answers);
=======
    const index = location.state?.index;

    const question = data.myData[0];
>>>>>>> parent of d92bc0c (small changes)

    const formik = useFormik({
        initialValues: {
          username: '',
          date: '',
          answer: '',
          question: '',
          paltaQuestion: '',
          course: '',
          topic: '',
          isAnonymous: ''
        },
        onSubmit: async values => {
          const currentDate = new Date();
          const options = { timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
          const formattedDate = currentDate.toLocaleString('en-US', options);
          values.date = formattedDate;
          values.username = apiData?.username;
          values.course = detail[1];
          values.topic = detail[2];

          // Add a check for data.myData here
          if (data?.myData && data?.myData[index] && data?.myData[index][id]) {
            values.question = data.myData[index][id];
          }

          let prePromise = postAnswer(values)
          toast.promise(prePromise, {
            loading: 'Posting...',
            success : <b>Answer Posted</b>,
            error : <b>Oops something went wrong!</b>
          });

          prePromise.then(function(){ navigate(`/preQuestions/${index}/id`)});
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


    return (
        <div className="container mx-auto">

          <Toaster position='top-center' reverseOrder={false}></Toaster>

          <div className="flex justify-center items-center max-w-[70%] mx-auto">
            <div className={styles.glass}>

              <div className="title flex flex-col items-center p-4">
                <h4 className="text-2xl font-bold text-center">{data.myData[index][id]}</h4>
                <span className="py-4 w-2/3 text-center text-gray-900">
                    <p className='text-sm'>Posted by <b>{data.myData[index]['isAnonymous']==='true' ? 'Anonymous User' : data.myData[index]['username']}</b></p>
                    <p className='text-sm'>{data.myData[index]['date']}</p>
                </span>
              </div>
  
              <div className="w-[90%] bg-gray-200 rounded-lg max-h-[42rem] overflow-x-hidden overflow-y-auto mx-auto p-6">
                
                
                <div className="pt-4">
                    <h1 className="text-2xl text-slate-800 font-black text-center">Previous Answers</h1><br></br>
                    
                    {answers && answers.map(answer => (
                      <div key={answer._id} className="mb-6 flex flex-col items-center text-center rounded-2xl p-6 bg-slate-700 text-neutral-100">
                        <p>{answer.answer}</p>
                        <p className='text-sm pt-2 text-indigo-200'>Posted by {answer.isAnonymous==='true' ? 'Anonymous User' : answer.username}</p>
                        <p className='text-xs text-indigo-200'>{answer.date}</p>
                      </div>
                    ))}

                    <hr className='h-px my-6 border-0 dark:bg-gray-300'></hr>

                    <form className="py-1 flex flex-col items-center" onSubmit={formik.handleSubmit}>

                        <textarea style={{ width: '100%'}} cols="50" rows="2" {...formik.getFieldProps('answer')} type="text" placeholder="Write your answer here" className={styles.textbox}/>
                        <br></br>
                        <textarea style={{ width: '100%'}} cols="50" rows="2" {...formik.getFieldProps('paltaQuestion')} type="text" placeholder="*Ask another question here" className={styles.textbox}/>

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
  
              </div>
  
              <div className='text-center mt-8'>
                <span><Link className='text-slate-800 font-bold text-xl border-2 border-slate-400 hover:border-indigo-500 rounded-md py-1 px-6 hover:text-indigo-500' to="/repository">Go Back</Link></span>
              </div>
  
            </div>
          </div>
        </div>
    )
}