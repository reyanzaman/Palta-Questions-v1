import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useAuthStore } from "../store/store";
import styles from "../styles/Username.module.css";
import { postQuestionnaire } from "../helper/helper";
import useFetch from "../hooks/fetch.hook";

export default function Questionnaire() {
	const { username } = useAuthStore((state) => state.auth);
	const [{ isLoading, apiData, serverError }] = useFetch(
		username ? `/user/${username}` : null
	);
	const navigate = useNavigate()

	const [sections] = useState({
		CIS101: ['10', '11'],
		CSC101: ['5'],
		CSC203: ['10']
	});

	const handleChange = event => {
	const selectedCourse = event.target.value;
	formik.setFieldValue('course', selectedCourse);
	formik.setFieldValue('section', sections[selectedCourse][0]);
	};

	const formik = useFormik({
		initialValues: {
			username: "",
            type: localStorage.getItem("selectedType") || "pre",
			course: "CIS101",
			section: "10",
			date: "",
			semester: "Summer",
			attitude: "",
			confidence: "",
			topic_motivation: "",
			teaching_method: "",
			new_method: "",
			learning_motivation: "",
			justification: "",
			whyChooseCourse: "It is mandatory",
			questionsAskedYoung: "",
			questionsAskDaily: "",
			questionsHelpLearn: "",
		},
		onSubmit: async (values) => {
			const currentDate = new Date();
			const options = {
				timeZone: "Asia/Dhaka",
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
			};
			const formattedDate = currentDate.toLocaleString("en-US", options);
			values.date = formattedDate;
			values.username = apiData.username;

			let postPromise = postQuestionnaire(values);
			toast.promise(postPromise, {
				loading: 'Posting...',
                success: (response) => <b>{response}</b>,
                error: (err) => {
                    return <b>{err.error.response.data.msg}</b>;
                },
			});
			postPromise.then(function () { navigate('/dashboard') });
		},
	});

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-center text-2xl font-bold">Loading...</h1>
			</div>
		);
	if (serverError)
		return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

	return (
		<div className="container mx-auto">
			<div className="container mx-auto">
				<Toaster position="top-center" reverseOrder={false}></Toaster>

				<div className="flex justify-center items-center text-center">
					<div className={styles.glass}>
						<div className="title flex flex-col items-center">
							<h4 className="text-4xl font-bold">Questionnaire</h4>
							<span className="py-4 text-lg w-4/5 text-center text-gray-500">
								Help us make learning better for you by giving us your feedback!
							</span>
						</div>

						<form className="py-1" onSubmit={formik.handleSubmit}>
							<br></br>
							<div className="textbox flex flex-col items-center gap-6">
								<select
									{...formik.getFieldProps("type")}
									className={styles.textbox}
									onChange={(e) => {
										const selectedType = e.target.value;
										formik.resetForm();
										localStorage.setItem("selectedType", selectedType);
										window.location.reload();
									}}>
									<option value="pre">Pre-Questionnaire</option>
									<option value="post">Post-Questionnaire</option>
								</select>

								{formik.values.type === "pre" ? (
									<>
										{/* Pre-Questionnaire */}
										<select
											{...formik.getFieldProps("course")}
											className={styles.textbox} onChange={handleChange}>
											<option value="CIS101">CIS101</option>
											<option value="CSC101">CSC101</option>
											<option value="CSC203">CSC203</option>
										</select>

										<select {...formik.getFieldProps('section')} className={styles.textbox}>
											{sections[formik.values.course].map(topic => (
											<option key={topic} value={topic}>
												Section-{topic}
											</option>
											))}
										</select>

										<select
											{...formik.getFieldProps("semester")}
											className={styles.textbox}>
											<option value="Spring">Spring</option>
											<option value="Summer">Summer</option>
											<option value="Autumn">Autumn</option>
										</select>

										<label className="pt-1 text-gray-600 font-bold w-5/6">
										What is your attitude towards study? For example, do you like studying? Do you have a study method?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("attitude")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										How confident are you with your learning when you study?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("confidence")} name="confidence" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("confidence")} name="confidence" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("confidence")} name="confidence" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("confidence")} name="confidence" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										How do you like subject of your course? Does it excite you?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("topic_motivation")} name="topic_motivation" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("topic_motivation")} name="topic_motivation" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("topic_motivation")} name="topic_motivation" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("topic_motivation")} name="topic_motivation" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very Much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Does the traditional teaching method in IUB help you learn? 
										Is there any better way to teach?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("teaching_method")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										If we implement a new teaching method, would you be interested to give it a try?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("new_method")} name="new_method" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("new_method")} name="new_method" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("new_method")} name="new_method" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("new_method")} name="new_method" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very Much</label>
													</div>
												</li>
											</ul>
										</div>
								
										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Do you look forward to learning in this course?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("learning_motivation")} name="learning_motivation" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("learning_motivation")} name="learning_motivation" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("learning_motivation")} name="learning_motivation" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("learning_motivation")} name="learning_motivation" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very Much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Can you please justify why? For example, is there anything you want to learn?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("justification")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											Why did you choose this course?
										</label>
										<select
											{...formik.getFieldProps("whyChooseCourse")}
											className={styles.textbox}>
											<option value="It is mandatory">It is mandatory</option>
											<option value="I took the course together with my friends">I took the course together with my friends</option>
											<option value="I like programming">I like programming</option>
											<option value="I want to learn programming">I want to learn programming</option>
											<option value="It is my last semester/year, I need to take it">It is my last semester/year, I need to take it</option>
											<option value="I like computers">I like computers</option>
											<option value="Technology scares me">Technology scares me</option>
										</select>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Approximately how many questions did you ask when you were young in a day?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r1" {...formik.getFieldProps("questionsAskedYoung")} name="questionsAskedYoung" value="0 to 10" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">0 to 10</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r2" {...formik.getFieldProps("questionsAskedYoung")} name="questionsAskedYoung" value="10 to 20" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">10 to 20</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r3" {...formik.getFieldProps("questionsAskedYoung")} name="questionsAskedYoung" value="20 to 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">20 to 50</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r4" {...formik.getFieldProps("questionsAskedYoung")} name="questionsAskedYoung" value="more than 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">More than 50</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Approximately how many questions do you ask now on a daily basis?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r1" {...formik.getFieldProps("questionsAskDaily")} name="questionsAskDaily" value="0 to 10" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">0 to 10</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r2" {...formik.getFieldProps("questionsAskDaily")} name="questionsAskDaily" value="10 to 20" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">10 to 20</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r3" {...formik.getFieldProps("questionsAskDaily")} name="questionsAskDaily" value="20 to 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">20 to 50</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r4" {...formik.getFieldProps("questionsAskDaily")} name="questionsAskDaily" value="more than 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">More than 50</label>
													</div>
												</li>
											</ul>
										</div>
										<br></br>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										In your opinion, does asking questions help learning? If yes, in what way does it help? If not, why not?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("questionsHelpLearn")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>
									</>
								) : (
									<>
										{/* Post-Questionnaire */}

										<label className="pt-1 my-4 text-gray-600 font-bold">
											Post-Questionnaire will be available at the end of your semester.
										</label>
										
										{/* <label className="pt-1 text-gray-600 font-bold">
											Do you wish to elect similar courses in the future? 
										</label>
										
										<label className="pt-2 text-gray-600 font-bold w-5/6">
											After doing this course, how much does programming excite you now?
										</label>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											How much would you like to pursue on the contents of this course further?
										</label>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											Can you please justify why?
										</label>

										<label className="pt-2 text-gray-600 font-bold">
											What else would you have liked to learn from this course?
										</label>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Approximately how many questions do you ask on a daily basis after completing this course?
										</label>
	
										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Would you recommend this course to others?
										</label> */}
									</>
								)}

								<button type="submit" className={styles.btn}>
									Post
								</button>
							</div>
						</form>

						<div className="text-center mt-4">
							<span>
								<Link className="text-indigo-500" to="/dashboard">
									Dashboard
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}