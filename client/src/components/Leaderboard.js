import React, { useState, useEffect } from 'react';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import { findRanking } from "../helper/helper";
import first from '../assets/first.png';
import second from '../assets/second.png';
import third from '../assets/third.png';
import others from '../assets/others.png';
import { setSection, setCourse } from '../helper/helper';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';

export default function Leaderboard() {

  const [ranking, setRanking] = useState(null);
  const [user, setUser] = useState({ section: '', course: '' });
  const { username } = useAuthStore(state => state.auth);
  const [{ apiData }] = useFetch(username ? `/user/${username}` : null);

  useEffect(() => {
    const fetchData = async () => {
      const ranking = await findRanking();
      setRanking(ranking);
      console.log(ranking);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, []);

  const updateCourse = async e => {
    try{
      setUser(prevUser => ({
        ...prevUser,
        course: e.target.value
      }));
      await setCourse(apiData?.username, e.target.value);
    }catch(error){
      console.log(error);
    }
  }

  const updateSection = async e => {
    try{
      setUser(prevUser => ({
        ...prevUser,
        section: e.target.value
      }));
      await setSection(apiData?.username, e.target.value);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center">
        <div className={styles.glass} style={{minWidth: '100%'}}>

          <h1 className="text-center text-4xl font-bold text-gray-700 pt-3 pb-8">Leaderboard</h1>

          <div className='w-2/4 mx-auto mt-2 mb-10'>
            <div className="flex flex-row items-center">
              <label className='mr-3' htmlFor="course">Course:</label>
              <select
                id="course"
                className={`${styles.textbox2} rounded-t-lg`}
                value={user?.course}
                onChange={updateCourse}
              >
                <option value="CIS101">CIS101</option>
                <option value="CSC101">CSC101</option>
                <option value="CSC203">CSC203</option>
                <option value="CSC401">CSC401</option>
              </select>
            </div>
            
            <div className="flex flex-row items-center">
              <label className='mr-2' htmlFor="section">Section:</label>
              <input
                id="section"
                type="number"
                className={`${styles.textbox2} rounded-b-lg`}
                placeholder="Section"
                min={1}
                max={30}
                value={user?.section}
                onChange={updateSection}
              />
            </div>
          </div>

          <div className="md:mx-4 mx-0">
            {ranking ? (
              <>
              <div className="bg-gray-800 rounded-xl py-2 px-5 md:px-10">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-amber-500 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={first} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[0]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[0]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-300 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={second} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[1]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[1]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-[#ad7947] font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={third} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[2]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[2]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[3]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[3]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[4]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[4]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[5]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[5]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[6]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[6]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[7]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[7]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[8]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[8]?.score}</h1>
                </div>
              </div>
              
              <div className="bg-gray-300 rounded-xl py-2 px-5 md:px-10 mt-2">
                <div className='flex flex-row items-center justify-between md:text-2xl text-lg text-gray-800 font-bold'>
                  <div className='flex flex-row gap-4 items-center'>
                      <img src={others} className="w-[40px] h-auto" alt="rank-icon"></img>
                      <h1 className='pt-1'>{ranking[9]?.username}</h1>
                  </div>
                  <h1 className='pt-1'>{ranking[9]?.score}</h1>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-xl text-gray-700 font-bold p-4">Loading...</p>
          )}
          </div>

          <br></br>

          <div className='text-center my-6'>
            <span><Link className='text-indigo-200 bg-gray-800 rounded-xl p-4 drop-shadow-md hover:bg-gray-700 hover:text-gray-100' to="/dashboard">Back to Dashboard</Link></span>
          </div>

        </div>
      </div>
    </div>
  );
}
