import React, { useEffect, useState } from 'react'
import avatar from '../assets/profile_blank.png';
import home_icon from '../assets/home.png';
import info_icon from '../assets/info.png';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';
import { useNavigate } from 'react-router-dom';
import { updateRank, uploadPhoto, getUserDetails, setSection, setCourse } from '../helper/helper';
import convertToBase64 from '../helper/convert';
import { Toaster } from 'react-hot-toast';

export default function Dashboard() {

  const { username } = useAuthStore(state => state.auth);
  const [file, setFile] = useState();
  const [user, setUser] = useState({ section: '', course: '' });

  //Getting User Data
  const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);

  //storing username in local storage
  localStorage.setItem('username', apiData?.username);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await updateRank(apiData?.username);
      const userDetails = await getUserDetails(apiData.username);
      setUser(userDetails);
    }
    fetchData();
  }, [apiData]);

  // logout handler function
  function userLogout(){
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/')
  }

  const onUpload = async e => {
    try {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
        await uploadPhoto(apiData?.username, base64);
        
        // Reload the current page
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
  };

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

  if(isLoading) return <div className="flex justify-center items-center h-screen">
                         <h1 className="text-center text-2xl font-bold">Loading...</h1>
                       </div>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center">
        <div className={styles.glass}>

          <div className="flex flex-col items-center">
            <h4 className="title text-4xl font-bold text-center text-gray-700">Palta Questions</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">
                Let the learning journey begin!
            </span>
          </div>

          <div className="profile flex justify-center py-0">
            
            <label htmlFor="profile">
              <img src={ apiData?.profile || avatar } className={styles.profile_img} alt="avatar" />
            </label>

            <input onChange={(e) => onUpload(e)} type="file" id="profile" name="profile" />

          </div>

          <div className="textbox flex flex-col items-center gap-6">

            <div className="flex justify-center items-center pt-4 text-3xl w-2/3 text-center text-gray-500">
              <b>{ apiData?.username || "User Name" }</b>
            </div>
            
            <div className="flex flex-col justify-center items-center w-2/3 text-center">
              <p className="font-semibold text-sm text-gray-700">Score: { apiData?.score < 0 ? "Infinite" : apiData?.score }</p>
              <p className="font-semibold text-sm text-gray-700">Questions Asked: { apiData?.questions }</p>
              <p className="font-semibold text-md text-indigo-500">{ apiData?.rank }</p>
            </div>

            <div className='grid-cols-2 gap-4'>
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
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
            
            <div style={{border: '1px solid #d3d3d3', width: '100%'}}></div>

              <div className="w-[95%] md:w-[75%] flex flex-col gap-4 py-2">

                {/* <Link to="" className="relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-900 rounded-lg group">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative text-center text-gray-500">Your Questions</span>
                </Link> */}

                <div>
                  <Link to="/pre" className={`${styles.tooltip} w-full relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group`}>
                    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-3xl group-hover:w-full group-hover:h-80 block"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative text-center tooltip">Pre Questions</span>
                  </Link>
                  <span className={`${styles.tooltiptext}`}>Use pre-questions just before the class starts. Figure out today's
                  topic from the course outline or ask your faculty and write three pre-questions on that specific topic.</span>
                </div>

                <div>
                  <Link to="/post" className={`${styles.tooltip} w-full relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group`}>
                    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-3xl group-hover:w-full group-hover:h-80 block"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <div className="relative text-center">
                      Post Class Feedback
                    </div>
                  </Link>
                  <span className={`${styles.tooltiptext}`}>Use post-class feedbacks when your class ends
                  so that we get an idea about what your understanding of the lecture and interests</span>
                </div>

                <div>
                  <Link to="/repository" className={`${styles.tooltip} w-full relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group`}>
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-3xl group-hover:w-full group-hover:h-80 block"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative text-center">Question Repository</span>
                  </Link>
                  <span className={`${styles.tooltiptext}`}>Here you can ask palta questions and also see what questions and feedbacks everyone
                  is asking or giving.</span>
                </div>

                <div>
                  <Link to="/questionnaire" className={`${styles.tooltip} w-full relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group`}>
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-3xl group-hover:w-full group-hover:h-80 block"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative text-center">Questionnaire</span>
                  </Link>
                  <span className={`${styles.tooltiptext}`}>In order to understand the effectiveness of the app and the method, please fill out
                  the survey forms here.</span>
                </div>

                <Link to="/leaderboard" className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-indigo-500 rounded-lg group">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-[#ff6a6a] rounded-3xl group-hover:w-full group-hover:h-80 block"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-red-200"></span>
                  <span className="relative text-center">Leaderboard</span>
                </Link>

              </div>

            </div>

            <div className="profile flex justify-center py-0 my-4">

              <Link to="/">
                <img src={home_icon} className={styles.icon} alt="avatar" />
              </Link>
              <Link to="/rules">
                <img src={info_icon} className={styles.icon} alt="avatar" />
              </Link>

            </div>

          <div style={{border: '1px solid #d3d3d3', width: '100%', marginTop: '20px'}}></div>

          <div className="text-center py-4">
              <span className='text-gray-500'>Wanna take a break? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>
          </div>

          <div className='relative text-center py-2'>
            <span className='text-gray-500'>©IUB-QBAN Team 2023</span>
          </div>

        </div>
      </div>
    </div>
  )
}
