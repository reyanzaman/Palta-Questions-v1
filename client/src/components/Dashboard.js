import avatar from '../assets/profile_blank.png'

import styles from '../styles/Username.module.css'

export default function Dashboard() {

  return (
    <div className="container mx-auto">

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{width: "45%", height:"90%"}}>

          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Question Based Learning</h4>
          </div>
          <br></br>

          <div className="profile flex justify-center py-4">
            
            <label htmlFor="profile">
              <img src={ avatar } className={styles.profile_img} alt="avatar" />
            </label>
          </div>

          <div className="textbox flex flex-col items-center gap-6">
            <div className="flex justify-center items-center py-4 text-3xl w-2/3 text-center text-gray-500">
              User Name
            </div>
            
            <div style={{border: '1px solid #d3d3d3', width: '100%'}}></div>

              <div className="w-100 flex flex-col gap-6 py-2 pt-5">
                <div className="w-100 flex flex-row gap-6 py-2 pt-5">

                  <a href="#_" className="relative inline-flex items-center justify-center px-14 py-10 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-indigo-500 rounded-full group-hover:w-80 group-hover:h-80"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative">Pre-Questions</span>
                  </a>

                  <a href="#_" className="relative inline-flex items-center justify-center px-10 py-10 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-indigo-500 rounded-full group-hover:w-80 group-hover:h-80"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative">Post-Class Questions</span>
                  </a>

                </div>
                <div className="w-100 flex flex-row gap-6 py-2 pt-5">

                  <a href="#_" className="relative inline-flex items-center justify-center px-10 py-10 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-indigo-500 rounded-full group-hover:w-80 group-hover:h-80"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative">Pre-Questionnaire</span>
                  </a>

                  <a href="#_" className="relative inline-flex items-center justify-center px-12 py-10 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-indigo-500 rounded-full group-hover:w-80 group-hover:h-80"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative">Post-Questionnaire</span>
                  </a>

                </div>
              </div>

            </div>

          <div style={{border: '1px solid #d3d3d3', width: '100%', marginTop: '40px'}}></div>

          <div className='text-center py-5 pt-10'>
            <span className='text-gray-500'>© Independent University Bangladesh 2023</span>
          </div>

        </div>
      </div>
    </div>
  )
}
