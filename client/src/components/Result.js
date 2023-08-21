import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik} from 'formik'
import { useAuthStore } from '../store/store'
import styles from '../styles/Username.module.css'
import { searchBonusMarks, getUserDetails } from '../helper/helper';
import useFetch from '../hooks/fetch.hook';

export default function Result() {
    const { username } = useAuthStore(state => state.auth);
    const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);
    const [user, setUser] = useState({ section: '', course: '' });

    const navigate = useNavigate();

    useEffect(() => {
      async function fetchData() {
        const userDetails = await getUserDetails(apiData?.username);
        setUser(userDetails);
      }
      fetchData();
    }, [apiData]);

    const formik = useFormik({
      initialValues: {
        semester: 'Summer',
        year: '',
        schedule: '',
        type: ''
      },
      onSubmit: async values => {
        let prePromise = searchBonusMarks(values)
        toast.promise(prePromise, {
          loading: 'Searching...',
          success : (response) => <b>{response}</b>,
          error: (err) => {
            return <b>{err.error.response.data.error}</b>
          },
        });
        const { semester, year, schedule, type } = values;
        const course = user?.course;
        const section = user?.section;

        let data = { semester, year, schedule, type, course, section };
        navigate('/resultdisplay', { state: { data } });
      }
    })

    if(isLoading) return <div className="flex justify-center items-center h-screen">
      <h1 className="text-center text-2xl font-bold">Loading...</h1>
    </div>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
      <div className="container mx-auto">
        <div className="container mx-auto">

          <Toaster position='top-center' reverseOrder={false}></Toaster>

          <div className="flex justify-center items-center h-screen">
            <div className={styles.glass}>
              
              <div className="title flex flex-col items-center">
                <h4 className="lg:text-4xl text-2xl font-bold text-center">Student Bonus Marks</h4>
                <span className="py-4 lg:text-lg text-md lg:w-2/3 w-[90%] text-center text-gray-500">
                  This feature will automatically calculate the bonus marks of students (5 marks)
                </span>
              </div>
              
              <form className="py-1">

                <br></br>
                <div className="textbox flex flex-col items-center gap-6">
                  
                  <select {...formik.getFieldProps('semester')} className={styles.textbox}>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                  </select>

                  <input {...formik.getFieldProps('year')} type="number" placeholder="Year" className={styles.textbox} min="2000" max="2050" onWheel={(e) => e.target.blur()}/>
                  
                  <p>Select class schedule below</p>
                  <select {...formik.getFieldProps('schedule')} className={styles.textbox}>
                    <option value="ST">Sunday-Tuesday</option>
                    <option value="MW">Monday-Wednesday</option>
                    <option value="T">Thursday</option>
                    <option value="RA">Thursday-Saturday</option>
                  </select>

                  <select {...formik.getFieldProps('type')} className={styles.textbox}>
                    <option value="pre">Pre-Questions</option>
                    <option value="palta">Palta-Questions</option>
                  </select>

                  <button type="submit" className={styles.btn}>Search</button>
                </div>

              </form>

              <div className='text-center mt-4'>
                <span><Link className='text-indigo-500' to="/dashboard">Dashboard</Link></span>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }