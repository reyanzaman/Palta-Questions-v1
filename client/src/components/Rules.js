import React from 'react';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import home_icon from '../assets/home.png';
import dashboard_icon from '../assets/dashboard.png';
import bloom_table from '../assets/blooms.png';

export default function Rules() {
    return (
        <div className="container mx-auto">

          <div className="flex justify-center items-center">
            <div className={styles.glass}>

              <div className="flex flex-col items-center">
                <h4 className="title text-4xl font-bold text-center text-gray-700">Query Based Access to Neurons (QBAN)</h4>
                <span className="py-4 text-xl w-7/8 text-center text-gray-500">
                  Let's learn how to use this web app first!
                </span>
              </div>

              <hr></hr><br></br>

              <div className="py-2 text-xl w-7/8 text-center text-gray-500">
                  Rules & Guidelines
              </div>

              <div className="flex flex-col items-center my-4 text-gray-600 text-sm text-justify">
                <p>Questions are the foundation of learning.
                  The more you ask questions the better your brain develops!
                  <br></br><br></br>
                  You can start asking questions on the <a className={styles.hyper} href="/">homepage</a> right away or you can
                  <a className={styles.hyper} href="/regsiter"> create a free account</a> and ask questions through your dashboard too.
                  <br></br><br></br>
                  Why ask questions? Can you get scores! Your questions will be appraised and will be given a score based on the level of question.
                  <br></br>
                  The system uses a sophisticated algorithm based on Bloom's Taxonomy to rank your questions. The Scores are provided as follows:
                </p>

                <br></br>

                <ul className='grid lg:grid-cols-6 gap-4 p-4 text-center'>
                  <li>
                    <p className="text-pink-500">Knowledge-based Questions</p>  (Remembering): <br></br> <b className='text-indigo-500'>5 points</b>
                  </li>
                  <li>
                    <p className="text-blue-700">Comprehensive Questions</p> (Understanding): <br></br> <b className='text-indigo-500'>10 points</b>
                  </li>
                  <li>
                    <p className="text-green-700">Application-based Questions</p>(Applying): <br></br> <b className='text-indigo-500'>15 points</b>
                  </li>
                  <li>
                    <p className="text-yellow-500">Analytical Questions</p> (Analyzing): <br></br> <b className='text-indigo-500'>20 points</b>
                  </li>
                  <li>
                    <p className="text-amber-600">Evaluative Questions</p> (Evaluating): <br></br> <b className='text-indigo-500'>20 points</b>
                  </li>
                  <li>
                    <p className="text-red-700">Synthetic Questions</p> (Creating): <br></br> <b className='text-indigo-500'>30 points</b>
                  </li>
                </ul>

                <br></br>

                <p>Bloom's taxonomy uses verbs to determine the type of question which is used to
                  grade and assign scores to your questions. You can refer to the chart below to
                  see the verbs and formulate better questions.
                </p>

                <br></br>

                <a href="https://www.teachthought.com/storage/2017/09/PostCopyDigitalBloomsVerbs-2-1.png">
                  <img src={bloom_table} alt="bloom's taxonomy" ></img>
                </a>

                <br></br>

                <p>These are just some of the verbs for each category of questions according to bloom's taxonomy.
                  You can research online to find out more of the verbs associated with each category.<br></br>
                  <br></br>Now that you know how things work, you should have probably realized that you
                  can get a maximum of 100 scores per questions! <br></br>
                  Another fun fact is you will be given a title/ranking based on your score to
                  show off your querying skills to your friends and teachers! 
                  <br></br><br></br>
                  The rankings are given as below:
                  <br></br>
                </p>

                <br></br>

                <ul className='grid lg:grid-cols-6 gap-6 p-4 text-center'>
                  <li>
                    <b className='text-indigo-500'>(0-550)</b> <br></br> Novice <br></br> Questioneer
                    <div className='bg-lime-500 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(551-1500)</b> <br></br> Apprentice <br></br> Questioneer
                    <div className='bg-emerald-500 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(1501-3000)</b> <br></br> Adept <br></br> Questioneer
                    <div className='bg-yellow-400 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(3001-5000)</b> <br></br> Expert <br></br> Questioneer
                    <div className='bg-amber-500 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(5001-7000)</b> <br></br> Master <br></br> Questioneer
                    <div className='bg-rose-500 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(7001-15000)</b> <br></br> Legendary <br></br> Questioneer
                    <div className='bg-red-700 w-full h-[4px] my-2'></div>
                  </li>
                </ul>

                <div class="bg-amber-400 h-[4px] w-3/5 mt-6 mb-4 relative hidden md:block">
                  <span class="absolute top-1/2 left-0 transform translate-y-[-50%] w-4 h-4 bg-lime-500 rotate-45"></span>
                  <span class="absolute top-1/2 right-0 transform translate-y-[-50%] w-4 h-4 bg-red-800 rotate-45"></span>
                </div>

                <br></br>

                <ul className='grid lg:grid-cols-4 gap-6 p-4 text-center'>
                  <li>
                    <b className='text-indigo-500'>(15001-25000)</b> <br></br> Mthical <br></br> Questioneer
                    <div className='bg-cyan-600 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(25001-35000)</b> <br></br> Outstanding <br></br> Questioneer
                    <div className='bg-indigo-600 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(35001-50000)</b> <br></br> Master of <br></br> Questions
                    <div className='bg-fuchsia-800 w-full h-[4px] my-2'></div>
                  </li>
                  <li>
                    <b className='text-indigo-500'>(&gt; 50000)</b> <br></br> Beyond <br></br> Comparison
                    <div className='bg-zinc-600 w-full h-[4px] my-2'></div>
                  </li>
                </ul>

                <div class="bg-indigo-600 h-[4px] w-2/5 mt-6 mb-4 relative hidden md:block">
                  <span class="absolute top-1/2 left-0 transform translate-y-[-50%] w-4 h-4 bg-cyan-600 rotate-45"></span>
                  <span class="absolute top-1/2 right-0 transform translate-y-[-50%] w-4 h-4 bg-zinc-600 rotate-45"></span>
                </div>

                <br></br><br></br>

                <p>The system has 5 main functionality:</p>

                <br></br>

                <ul className='grid lg:grid-cols-5 gap-4 p-4 md:text-center text-justify'>
                  <li>
                    <h1 className='text-lg md:mb-4 mb-2 text-center'>Pre Questions</h1>
                    <p>Through this functionality, students will ask questions before their class starts on the
                      topic they will study on that day. This will help them plan out the questions
                      on their mind which they can reflect back to later on and check if the lecture
                      has answered their questions. 
                    </p>
                  </li>
                  <li>
                    <h1 className='text-lg md:mb-4 mb-2 text-center'>Post Questions</h1>
                    <p>Using post questions, students will provide feedback on the class about what they learned in that
                      class and what they want to learn further in their next class. This will provide
                      insights for the teachers helping them to plan out their future lectures accordingly.
                    </p>
                  </li>
                  <li>
                    <h1 className='text-lg md:mb-4 mb-2 text-center'>General Questions</h1>
                    <p>Students have the freedom to ask questions generally on any topic to improve their question
                      formulating skills. The questions are scored same as pre-questions however, as a warning, please
                      refrain from asking inappropriate questions.
                    </p>
                  </li>
                  <li>
                    <h1 className='text-lg md:mb-4 mb-2 text-center'>Palta Questions</h1>
                    <p>Questions develops your brain and by asking more questions on top of another question, it is
                      said that you will ultimately reach the answer. So, this functionality lets you ask more questions on 
                      top of previous questions, similar to how comments work.
                    </p>
                  </li>
                  <li>
                    <h1 className='text-lg md:mb-4 mb-2 text-center'>Questionnaire</h1>
                    <p>In order to judge the effectiveness of this method. You will be required to fill up a questionnaire
                      when your couse starts and also just after your final exams end. This survey will provide us with insights
                      about if this method of learning should be implemented or not. 
                    </p>
                  </li>
                </ul>

                <br></br>

                <p>This web app's purpose is to implement the Query Based Access to Neurons method and 
                  test out its effectiveness to get a better view of how learning methods should 
                  improve in the future. We hope you enjoy Palta Questions. Best of Luck!
                </p>
                <br></br>
                
                <p>If you find any bugs or if you have any queries, you can reach out to your
                  respective course faculties or SODs or email us at 
                  <a className={styles.hyper} href="mailto:iubsets.coursehelp@gmail.com"> iubsets.coursehelp@gmail.com</a>
                </p>
                <br></br>
              </div>

              <div className="profile flex justify-center py-0 mt-4 mb-8">

                <Link to="/">
                  <img src={home_icon} className={styles.icon} alt="avatar" />
                </Link>
                {localStorage.getItem('token') ? (
                    <Link to="/dashboard">
                      <img src={dashboard_icon} className={styles.icon} alt="avatar" />
                    </Link>
                ) : (
                  <Link to="/login">
                    <img src={dashboard_icon} className={styles.icon} alt="avatar" />
                  </Link>
                )}

              </div>
  
              <div style={{border: '1px solid #d3d3d3', width: '100%', marginTop: '20px'}}></div>

              <div className='relative text-center py-2'>
                <span className='text-gray-500'>©IUB-QBAN Team 2023</span>
              </div>
  
            </div>
          </div>
        </div>
    )
}