import React, { useEffect } from 'react'
import avatar from '../assets/profile_blank.png';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';
import { useNavigate } from 'react-router-dom';
import { updateRank } from '../helper/helper';

export default function Dashboard() {

  const { username } = useAuthStore(state => state.auth);

  useEffect(() => {
    async function fetchRank() {
      const rank = await updateRank(username);
      console.log("Rank: ", rank)
    }
    fetchRank();
  }, [username]);

  const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);
  const navigate = useNavigate();

  // logout handler function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <div className="flex justify-center items-center h-screen">
                         <h1 className="text-center text-2xl font-bold">Loading...</h1>
                       </div>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <div className="flex justify-center items-center">
        <div className={styles.glass}>

          <div className="flex flex-col items-center">
            <h4 className="title text-4xl font-bold text-center text-gray-700">Question Based Learning</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">
                Let the learning journey begin!
            </span>
          </div>
          <br></br>

          <div className="profile flex justify-center py-0">
            
            <label htmlFor="profile">
              <img src={ apiData?.profile || avatar } className={styles.profile_img} alt="avatar" />
            </label>
          </div>

          <div className="textbox flex flex-col items-center gap-6">
            <div className="flex justify-center items-center pt-4 text-3xl w-2/3 text-center text-gray-500">
              <b>{ apiData?.username || "User Name" }</b>
            </div>
            <div className="flex flex-col justify-center items-center text-md w-2/3 text-center text-indigo-500">
              <b>Score: { apiData?.questions}</b>
              <b>{ apiData?.rank || "Novice Questioneer" }</b>
            </div>
            
            <div style={{border: '1px solid #d3d3d3', width: '100%'}}></div>

              <div className="w-[70%] flex flex-col gap-6 py-2">

                <Link to="" className="relative inline-flex items-center justify-center px-10 py-6 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-900 rounded-lg group">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative text-center text-gray-500">Your Questions</span>
                </Link>

                <Link to="/pre" className="relative inline-flex items-center justify-center px-14 py-6 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-full group-hover:w-96 group-hover:h-80 block"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative text-center">Pre Questions</span>
                </Link>

                <Link to="/post" className="relative inline-flex items-center justify-center px-10 py-6 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-full group-hover:w-96 group-hover:h-80 block"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative text-center">Post Class Feedback</span>
                </Link>

                <Link to="/repository" className="relative inline-flex items-center justify-center px-10 py-6 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-900 rounded-lg group">
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-full group-hover:w-96 group-hover:h-80 block"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative text-center">Question Repository</span>
                </Link>

                <Link to="" className="relative inline-flex items-center justify-center px-10 py-6 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-900 rounded-lg group">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative text-center text-gray-500">Questionnaire</span>
                </Link>

                <Link to="/ask" className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-indigo-500 rounded-lg group">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-[#ff6a6a] rounded-full group-hover:w-96 group-hover:h-80 block"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-red-200"></span>
                  <span className="relative text-center">Ask a Question!</span>
                </Link>

              </div>

            </div>

          <div style={{border: '1px solid #d3d3d3', width: '100%', marginTop: '40px'}}></div>

          <div className="text-center py-4">
              <span className='text-gray-500'>Wanna take a break? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>
          </div>

          <div className='relative text-center py-2'>
            <span className='text-gray-500'>© Independent University Bangladesh 2023</span>
          </div>

        </div>
      </div>
    </div>
  )
}
