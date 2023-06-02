import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Username.module.css';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/store';
import { findGeneral, findAllComments } from "../helper/helper";

export default function PreQuestions() {
  const location = useLocation();
  const [state, setState] = useState({
    questions: null,
    comments: null,
    current_question: 1,
    current_page: 1
  })

  const { questions, comments, current_question, current_page } = state;

  const data = location.state?.data;

  useEffect(() => {
    async function fetchData() {
      if (data) {
        const questions = await findGeneral(
          data?.type,
          data?.date,
          data?.month,
          data?.year
        );
        setState((prevState) => ({ ...prevState, questions: questions }));
      }
    }

    async function fetchComments() {
      if (data) {
        const comments = await findAllComments(
          data?.course
        );
        setState((prevState) => ({ ...prevState, comments: comments }));
      }
    }

    fetchData();
    fetchComments();

    const intervalId = setInterval(fetchData, 15000); //every 15 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [data]);

  const setData = useDataStore((state) => state.setData);

  const handleClick = () => {
    localStorage.setItem('myData', '');
    setData({ myData: questions });
  };

  const [sortBy, setSortBy] = useState('time'); // State to track the active sorting option

  const handleSortByTime = () => {
    setSortBy('time');
  };

  const handleSortByScore = () => {
    setSortBy('score');
  };

  if (!questions) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 text-2xl">Loading Questions...</div>
    );
  }

  const questionSort = (questions) => {
    let mergedQuestions = [];
    let index = questions.length - 1;
    for (let i = 0; i < questions.length; i++) {
      mergedQuestions.push({
        username: questions[i].username,
        type: questions[i].type,
        course: questions[i].course,
        topic: questions[i].topic,
        date: questions[i].date,
        question: questions[i].question1,
        qscore: questions[i].q1Score,
        isAnonymous: questions[i].isAnonymous,
        section: questions[i].section,
        semester: questions[i].semester,
        month: questions[i].month,
        year: questions[i].year,
        qnum: 'question1',
        index: index
      });
      index--;
    }

    const sortedQuestions = mergedQuestions.sort((a, b) => a.qscore - b.qscore);

    return sortedQuestions;
  };

  const questionMerge = (questions) => {
    let mergedQuestions = [];
    let index = questions.length - 1;
    for (let i = 0; i < questions.length; i++) {
      mergedQuestions.push({
        username: questions[i].username,
        type: questions[i].type,
        course: questions[i].course,
        topic: questions[i].topic,
        date: questions[i].date,
        question: questions[i].question1,
        qscore: questions[i].q1Score,
        isAnonymous: questions[i].isAnonymous,
        section: questions[i].section,
        semester: questions[i].semester,
        month: questions[i].month,
        year: questions[i].year,
        qnum: 'question1',
        index: index
      });
      index--;
    }
    return mergedQuestions;
  }

  const mergedQuestions = questionMerge(questions);
  const sortedQuestions = questionSort(questions);

  const totalQuestions = sortedQuestions.length;
  const questionPerPage = 15;
  const totalPages = Math.ceil(totalQuestions / questionPerPage);

  const nextPage = () => {
      if (current_page + 1 > totalPages) {
        return current_page;
      } else {
        return current_page + 1;
      }
  };
  
  const prevPage = () => {
      if (current_page - 1 < 1) {
        return current_page;
      } else {
        return current_page - 1;
      }
  };

  const handlePaginate = (value) => {
    let new_question = 0;
    if (value === "next") {
      const new_page = nextPage();
      if (current_question + questionPerPage <= totalQuestions) {
        new_question = current_question + questionPerPage;
      } else {
        new_question = current_question;
      }
      setState({ ...state, current_page: new_page, current_question: new_question });
    } else if (value === "prev") {
      const new_page = prevPage();
      if(current_question - questionPerPage >= 1){
        new_question = current_question - questionPerPage;
      } else {
        new_question = current_question;
      }
      setState({ ...state, current_page: new_page, current_question: new_question });
    }
  };  

  console.log(comments);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center">
        <div className={styles.glass} style={{minWidth: '100%'}}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold text-center">General-Questions Repository</h4>
            <span className="py-4 text-lg w-2/3 text-center text-gray-500">Take your pick!</span>
          </div>

          <div className="flex justify-center items-center">
            <button
              className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold mb-4 mx-2 py-2 px-4 rounded-xl shadow ${sortBy === 'time' ? 'bg-gray-100 border-2 border-gray-400' : ''}`}
              onClick={handleSortByTime}
            >
              Sort by Time
            </button>
            <button
              className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold mb-4 mx-2 py-2 px-4 rounded-xl shadow ${sortBy === 'score' ? 'bg-gray-100 border-2 border-gray-400' : ''}`}
              onClick={handleSortByScore}
            >
              Sort by Score
            </button>
          </div>

          <div id="timeSorted" className={`${sortBy === 'time' ? '' : 'hidden'}`}>
            <div className="w-[100%] sm:w-[90%] bg-gray-200 rounded-lg max-h-[30rem] overflow-x-clip overflow-y-auto mx-auto p-6">
              {mergedQuestions.slice().reverse().slice(current_question-1 , current_question + questionPerPage - 1).map((question, index) => {
                let commentCount = 0;
                if(comments){
                  for (let i = 0; i < comments.length; i++) {
                    if (comments[i].question === question.question) {
                      commentCount = comments[i].comments.length;
                    }
                }
                }
                return (
                <div key={index}>
                  <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                    <div>
                      <h1 className="lg:w-full text-left text-md font-bold hover:text-indigo-500">
                        <Link
                          to={`/generalQuestions/${questions.length - question['index'] - 1}/${question['qnum']}`}
                          onClick={handleClick}
                        >
                          <div className={styles.truncateLines}>{question['question']}</div>
                        </Link>
                      </h1>
                    </div>
                    <div>
                      <h1 className="w-fit text-sm lg:float-right sm:float-left">{question['date'] + " " + question['year']}</h1>
                      <br />
                      <h1 className="w-fit text-sm lg:float-right sm:float-left font-bold text-indigo-800">
                        {'Question Score: ' + question['qscore']}
                      </h1>
                      <br />
                      <h1 className={`w-fit text-sm lg:float-right sm:float-left font-bold ${commentCount > 0 ? 'text-red-500' : 'hidden'}`}>
                        {'Palta Questions: ' + commentCount}
                      </h1>
                    </div>
                    <p className="text-sm pt-2">
                      Posted by <b>{question['isAnonymous'] === 'true' ? 'Anonymous User' : question['username']}</b>
                    </p>
                  </div>
                  <hr className="h-px my-8 border-0 dark:bg-gray-300" />
                </div>
                );
              })}
            </div>
          </div>

          <div id="scoreSorted" className={`${sortBy === 'score' ? '' : 'hidden'}`}>
            <div className="w-[100%] sm:w-[90%] bg-gray-200 rounded-lg max-h-[30rem] overflow-x-clip overflow-y-auto mx-auto p-6">
              {sortedQuestions.reverse().slice(current_question - 1, current_question + questionPerPage - 1).map((question, index) => {
                let commentCount = 0;
                if(comments){
                  for (let i = 0; i < comments.length; i++) {
                    if (comments[i].question === question.question) {
                      commentCount = comments[i].comments.length;
                    }
                }
                }
                return (
                  <div key={index}>
                    <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                    <div>
                      <h1 className="lg:w-full text-left text-md font-bold hover:text-indigo-500">
                        <Link
                          to={`/generalQuestions/${questions.length - question['index'] - 1}/${question['qnum']}`}
                          onClick={handleClick}
                        >
                          <div className={styles.truncateLines}>{question.question}</div>
                        </Link>
                      </h1>
                    </div>
                    <div>
					<h1 className="w-fit text-sm lg:float-right sm:float-left">{question['date'] + " " + question['year']}</h1>
                      <br />
                      <h1 className="w-fit text-sm lg:float-right sm:float-left font-bold text-indigo-800">
                        {'Question Score: ' + question.qscore}
                      </h1>
                      <br />
                      <h1 className={`w-fit text-sm lg:float-right sm:float-left font-bold ${commentCount > 0 ? 'text-red-500' : 'hidden'}`}>
                        {'Palta Questions: ' + commentCount}
                      </h1>
                    </div>
                    <p className="text-sm pt-2">
                      Posted by <b>{question.isAnonymous === 'true' ? 'Anonymous User' : question.username}</b>
                    </p>
                  </div>
                  <hr className="h-px my-8 border-0 dark:bg-gray-300" />
                </div>
                );
              })}
            </div>
          </div>
          
          <div className='flex flex-col items-center justify-center pt-4'>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold text-indigo-500">{current_question}</span> to <span className="font-semibold text-indigo-500">{(current_question + questionPerPage - 1) > totalQuestions ? totalQuestions : (current_question + questionPerPage - 1)}</span> of <span className="font-semibold text-indigo-500">{totalQuestions}</span> Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => handlePaginate("prev")}>
                  <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                  Prev
                </button>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => handlePaginate("next")}>
                  Next
                  <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            </div>

          </div>

          <div className="text-center mt-8 flex flex-row justify-center gap-6">
            <span>
              <Link
                className="text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md"
                to="/repository"
              >
                Go Back
              </Link>
            </span>
            <span>
              <Link
                className="text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md"
                to="/dashboard"
              >
                Go Home
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}









// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import styles from "../styles/Username.module.css";
// import { Link } from "react-router-dom";
// import { useDataStore } from "../store/store";
// import { findGeneral, findAllComments } from "../helper/helper";

// export default function GeneralQuestions() {
// 	const location = useLocation();
// 	const [state, setState] = useState({
// 		questions: null,
// 		comments: null,
// 		current_question: 1,
// 		current_page: 1
// 	})

// 	const { questions, comments, current_question, current_page } = state;

// 	const data = location.state?.data;

// 	useEffect(() => {
// 		async function fetchData() {
// 			if (data) {
// 				const questions = await findGeneral(
// 					data?.type,
// 					data?.course,
// 					data?.topic,
// 					data?.month,
// 					data?.year
// 				);
// 				setState((prevState) => ({ ...prevState, questions: questions }));
// 			}
// 		}

// 		async function fetchComments() {
// 			if (data) {
// 				const comments = await findAllComments(
// 					data?.course
// 				);
// 				setState((prevState) => ({ ...prevState, comments: comments }));
// 			}
// 		}

// 		fetchData();
// 		fetchComments();

// 		const intervalId = setInterval(fetchData, 15000); //every 15 seconds

// 		return () => {
// 			clearInterval(intervalId);
// 		};
// 	}, [data]);

// 	const setData = useDataStore((state) => state.setData);

// 	const handleClick = () => {
// 		localStorage.setItem("myData", "");
// 		setData({ myData: questions });
// 	};

// 	const [sortBy, setSortBy] = useState("time"); // State to track the active sorting option

// 	const handleSortByTime = () => {
// 		setSortBy("time");
// 	};

// 	const handleSortByScore = () => {
// 		setSortBy("score");
// 	};

// 	if (!questions) {
// 		return (
// 			<div className="flex flex-col items-center justify-center text-gray-500 text-2xl">Loading Questions...</div>
// 		);
// 	}

// 	console.log(comments);

// 	const questionSort = (questions) => {
// 		let mergedQuestions = [];
// 		let index = questions.length - 1;
// 		for (let i = 0; i < questions.length; i++) {
// 			mergedQuestions.push({
// 				username: questions[i].username,
// 				type: questions[i].type,
// 				course: questions[i].course,
// 				topic: questions[i].topic,
// 				date: questions[i].date,
// 				question: questions[i].question1,
// 				qscore: questions[i].q1Score,
// 				isAnonymous: questions[i].isAnonymous,
// 				section: questions[i].section,
// 				semester: questions[i].semester,
// 				month: questions[i].month,
// 				year: questions[i].year,
// 				qnum: 'question1',
// 				index: index
// 			});
// 			index--;
// 		}

// 		const sortedQuestions = mergedQuestions.sort((a, b) => a.qscore - b.qscore);

// 		return sortedQuestions;
// 	};

// 	const sortedQuestions = questionSort(questions);

// 	const totalQuestions = sortedQuestions.length;
// 	const questionPerPage = 15;
// 	const totalPages = Math.ceil(totalQuestions / questionPerPage);

// 	const nextPage = () => {
// 		if (current_page + 1 > totalPages) {
// 			return current_page;
// 		} else {
// 			return current_page + 1;
// 		}
// 	};

// 	const prevPage = () => {
// 		if (current_page - 1 < 1) {
// 			return current_page;
// 		} else {
// 			return current_page - 1;
// 		}
// 	};

// 	const handlePaginate = (value) => {
// 		let new_question = 0;
// 		if (value === "next") {
// 			const new_page = nextPage();
// 			if (current_question + questionPerPage <= totalQuestions) {
// 				new_question = current_question + questionPerPage;
// 			} else {
// 				new_question = current_question;
// 			}
// 			setState({ ...state, current_page: new_page, current_question: new_question });
// 		} else if (value === "prev") {
// 			const new_page = prevPage();
// 			if (current_question - questionPerPage >= 1) {
// 				new_question = current_question - questionPerPage;
// 			} else {
// 				new_question = current_question;
// 			}
// 			setState({ ...state, current_page: new_page, current_question: new_question });
// 		}
// 	};

// 	return (
// 		<div className="container mx-auto">
// 			<div className="flex justify-center items-center">
// 				<div className={styles.glass} style={{minWidth: '70%'}}>
// 					<div className="title flex flex-col items-center">
// 						<h4 className="text-4xl font-bold text-center">
// 							General-Questions Repository
// 						</h4>
// 						<span className="py-4 text-lg w-2/3 text-center text-gray-500">
// 							Take your pick!
// 						</span>
// 					</div>

// 					<div className="flex justify-center items-center">
// 						<button
// 							className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold mb-4 mx-2 py-2 px-4 rounded-xl shadow ${sortBy === "time" ? "bg-gray-100 border-2 border-gray-400" : ""
// 								}`}
// 							onClick={handleSortByTime}>
// 							Sort by Time
// 						</button>
// 						<button
// 							className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold mb-4 mx-2 py-2 px-4 rounded-xl shadow ${sortBy === "score" ? "bg-gray-100 border-2 border-gray-400" : ""
// 								}`}
// 							onClick={handleSortByScore}>
// 							Sort by Score
// 						</button>
// 					</div>

// 					<div
// 						id="timeSorted"
// 						className={`${sortBy === "time" ? "" : "hidden"}`}>
// 						<div className="w-[100%] sm:w-[90%] bg-gray-200 rounded-lg max-h-[30rem] overflow-x-clip overflow-y-auto mx-auto p-6">
// 							{questions
// 								.slice()
// 								.reverse().slice(current_question - 1, current_question + questionPerPage - 1)
// 								.map((question, index) => {
// 									let commentCount = 0;
// 									for (let i = 0; i < comments.length; i++) {
// 										if (comments[i].question === question['question']) {
// 											commentCount = comments[i].comments.length;
// 										}
// 									}
// 									return (
// 									<div key={index}>
// 										<div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
// 											<div>
// 												<h1 className="lg:w-full text-left text-md font-bold hover:text-indigo-500">
// 													<Link
// 														to={`/generalQuestions/${questions.length - index - 1
// 															}/question1`}
// 														onClick={handleClick}>
// 														<div className={styles.truncateLines}>
// 															{question["question1"]}
// 														</div>
// 													</Link>
// 												</h1>
// 											</div>
// 											<div>
// 												<h1 className="w-fit text-sm lg:float-right sm:float-left">
// 													{question["date"]} {question["year"]}
// 												</h1>
// 												<br />
// 												<h1 className="w-fit text-sm lg:float-right sm:float-left font-bold text-indigo-800">
// 													{"Question Score: " + question["q1Score"]}
// 												</h1>
// 												<br />
// 												<h1 className={`w-fit text-sm lg:float-right sm:float-left font-bold ${commentCount > 0 ? 'text-red-500' : 'hidde'}`}>
// 													{'Palta Questions: ' + commentCount}
// 												</h1>
// 											</div>
// 											<p className="text-sm pt-2">
// 												Posted by{" "}
// 												<b>
// 													{question["isAnonymous"] === "true"
// 														? "Anonymous User"
// 														: question["username"]}
// 												</b>
// 											</p>
// 										</div>
// 										<hr className="h-px my-8 border-0 dark:bg-gray-300" />
// 									</div>
// 									);
// 								})}
// 						</div>
// 					</div>

// 					<div
// 						id="scoreSorted"
// 						className={`${sortBy === "score" ? "" : "hidden"}`}>
// 						<div className="w-[100%] sm:w-[90%] bg-gray-200 rounded-lg max-h-[30rem] overflow-x-clip overflow-y-auto mx-auto p-6">
// 							{sortedQuestions.slice(current_question - 1, current_question + questionPerPage - 1).map((question, index) => {
// 								let commentCount = 0;
// 								for (let i = 0; i < comments.length; i++) {
// 									if (comments[i].question === question.question) {
// 										commentCount = comments[i].comments.length;
// 									}
// 								}
// 								return (
// 								<div key={index}>
// 									<div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
// 										<div>
// 											<h1 className="lg:w-full text-left text-md font-bold hover:text-indigo-500">
// 												<Link
// 													to={`/generalQuestions/${questions.length - index - 1
// 														}/question1`}
// 													onClick={handleClick}>
// 													<div className={styles.truncateLines}>
// 														{question.question}
// 													</div>
// 												</Link>
// 											</h1>
// 										</div>
// 										<div>
// 											<h1 className="w-fit text-sm lg:float-right sm:float-left">
// 												{question.date} {question.year}
// 											</h1>
// 											<br />
// 											<h1 className="w-fit text-sm lg:float-right sm:float-left font-bold text-indigo-800">
// 												{"Question Score: " + question.score}
// 											</h1>
// 											<br />
// 											<h1 className={`w-fit text-sm lg:float-right sm:float-left font-bold ${commentCount > 0 ? 'text-red-500' : 'hidde'}`}>
// 												{'Palta Questions: ' + commentCount}
// 											</h1>
// 										</div>
// 										<p className="text-sm pt-2">
// 											Posted by{" "}
// 											<b>
// 												{question.isAnonymous === "true"
// 													? "Anonymous User"
// 													: question.username}
// 											</b>
// 										</p>
// 									</div>
// 									<hr className="h-px my-8 border-0 dark:bg-gray-300" />
// 								</div>
// 								);
// 							})}
// 						</div>
// 					</div>

// 					<div className='flex flex-col items-center justify-center pt-4'>

// 						<div className="flex flex-col items-center">
// 							<span className="text-sm text-gray-700">
// 								Showing <span className="font-semibold text-indigo-500">{current_question}</span> to <span className="font-semibold text-indigo-500">{(current_question + questionPerPage - 1) > totalQuestions ? totalQuestions : (current_question + questionPerPage - 1)}</span> of <span className="font-semibold text-indigo-500">{totalQuestions}</span> Entries
// 							</span>
// 							<div className="inline-flex mt-2 xs:mt-0">
// 								<button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
// 									onClick={() => handlePaginate("prev")}>
// 									<svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
// 									Prev
// 								</button>
// 								<button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
// 									onClick={() => handlePaginate("next")}>
// 									Next
// 									<svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
// 								</button>
// 							</div>
// 						</div>

// 					</div>

// 					<div className="text-center mt-8">
// 						<span>
// 							<Link
// 								className="text-neutral-50 font-bold hover:bg-indigo-700 bg-indigo-500 py-3 px-10 rounded-md"
// 								to="/repository">
// 								Go Back
// 							</Link>
// 						</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }