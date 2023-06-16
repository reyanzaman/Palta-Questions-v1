import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik, resetForm } from "formik";
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

	const formik = useFormik({
		initialValues: {
			username: "",
            type: localStorage.getItem("selectedType") || "pre",
			course: "CIS101",
			section: "",
			date: "",
			semester: "Summer",
			similarCourse: "",
			teachingMethod: "",
			programmingExcite: "",
			lookForward: "",
			pursueContents: "",
			justification: "",
			contents: "no",
			whatElseLearn: "",
			expectations: "",
			whyChooseCourse: "",
			questionsAskedSmall: "",
			questionsAskedDaily: "",
			recommend: ""
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

	const handleChange = (event) => {
		const selectedOption = event.target.value;
		formik.setFieldValue("contents", selectedOption);
	};

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
										<select
											{...formik.getFieldProps("course")}
											className={styles.textbox}>
											<option value="CIS101">CIS101</option>
											<option value="CSC101">CSC101</option>
											<option value="CSC203">CSC203</option>
											<option value="CSC401">CSC401</option>
										</select>

										<input
											{...formik.getFieldProps("section")}
											type="number"
											placeholder="Section"
											className={styles.textbox}
											min={1}
											max={30}
											onKeyDown={(e) => {
												const { key } = e;

												if (key === "-" || key === "+" || key === "e") {
													e.preventDefault();
												}
											}}
											onWheel={(e) => e.target.blur()}
											onChange={(e) => {
												const { value, min, max } = e.target;
												const numValue = parseInt(value);

												if (numValue < min) {
													formik.setFieldValue("section", min);
												} else if (numValue > max) {
													formik.setFieldValue("section", max);
												} else {
													formik.setFieldValue("section", numValue);
												}
											}}
										/>

										<select
											{...formik.getFieldProps("semester")}
											className={styles.textbox}>
											<option value="Spring">Spring</option>
											<option value="Summer">Summer</option>
											<option value="Autumn">Autumn</option>
										</select>

										<label className="pt-1 text-gray-600 font-bold w-5/6">
											If we implement a new teaching method, would you be interested to give it a try?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("teachingMethod")} name="teachingMethod" value="never" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Never</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("teachingMethod")} name="teachingMethod" value="not very interested" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not very interested</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("teachingMethod")} name="teachingMethod" value="somewhat interested" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat Interested</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("teachingMethod")} name="teachingMethod" value="very interested" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very Interested</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											How much does programming excite you?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											Do you look forward to this course?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("lookForward")} name="lookForward" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("lookForward")} name="lookForward" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("lookForward")} name="lookForward" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("lookForward")} name="lookForward" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very Much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											Can you please justify why?
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
											Have you thought about the contents of this course?
										</label>
										<select
											{...formik.getFieldProps("contents")}
											className={styles.textbox}
											onChange={handleChange}>
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											What do you expect to learn from this course?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("expectations")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											Why did you choose this course?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("whyChooseCourse")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Approximately how many questions did you ask when you were small?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r1" {...formik.getFieldProps("questionsAskedSmall")} name="questionsAskedSmall" value="0 to 10" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">0 to 10</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r2" {...formik.getFieldProps("questionsAskedSmall")} name="questionsAskedSmall" value="10 to 20" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">10 to 20</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q4r3" {...formik.getFieldProps("questionsAskedSmall")} name="questionsAskedSmall" value="20 to 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">20 to 50</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q4r4" {...formik.getFieldProps("questionsAskedSmall")} name="questionsAskedSmall" value="more than 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">More than 50</label>
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
														<input type="radio" id="q5r1" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="0 to 10" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">0 to 10</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r2" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="10 to 20" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">10 to 20</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r3" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="20 to 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">20 to 50</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q5r4" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="more than 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">More than 50</label>
													</div>
												</li>
											</ul>
										</div>
										<br></br>
									</>
								) : (
									<>
										<select
											{...formik.getFieldProps("course")}
											className={styles.textbox}>
											<option value="CIS101">CIS101</option>
											<option value="CSC101">CSC101</option>
											<option value="CSC203">CSC203</option>
											<option value="CSC401">CSC401</option>
										</select>

										<input
											{...formik.getFieldProps("section")}
											type="number"
											placeholder="Section"
											className={styles.textbox}
											min={1}
											max={30}
											onKeyDown={(e) => {
												const { key } = e;

												if (key === "-" || key === "+" || key === "e") {
													e.preventDefault();
												}
											}}
											onChange={(e) => {
												const { value, min, max } = e.target;
												const numValue = parseInt(value);

												if (numValue < min) {
													formik.setFieldValue("section", min);
												} else if (numValue > max) {
													formik.setFieldValue("section", max);
												} else {
													formik.setFieldValue("section", numValue);
												}
											}}
										/>

										<select
											{...formik.getFieldProps("semester")}
											className={styles.textbox}>
											<option value="Spring">
												Spring
											</option>
											<option value="Summer">
												Summer
											</option>
											<option value="Autumn">
												Autumn
											</option>
										</select>

										<label className="pt-1 text-gray-600 font-bold">
											Do you wish to elect similar courses in the future? 
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("similarCourse")} name="similarCourse" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("similarCourse")} name="similarCourse" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("similarCourse")} name="similarCourse" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("similarCourse")} name="similarCourse" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very Much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											After doing this course, how much does programming excite you now?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("programmingExcite")} name="programmingExcite" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											How much would you like to pursue on the contents of this course further?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r1" {...formik.getFieldProps("pursueContents")} name="pursueContents" value="not at all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not at all</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r2" {...formik.getFieldProps("pursueContents")} name="pursueContents" value="not much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not much</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q1r3" {...formik.getFieldProps("pursueContents")} name="pursueContents" value="somewhat" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Somewhat</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q1r4" {...formik.getFieldProps("pursueContents")} name="pursueContents" value="very much" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
															<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Very much</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
											Can you please justify why?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("justification")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold">
											What else would you have liked to learn from this course?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("whatElseLearn")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Approximately how many questions do you ask on a daily basis after completing this course?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r1" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="0 to 10" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">0 to 10</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r2" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="10 to 20" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">10 to 20</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r3" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="20 to 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">20 to 50</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q5r4" {...formik.getFieldProps("questionsAskedDaily")} name="questionsAskedDaily" value="more than 50" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">More than 50</label>
													</div>
												</li>
											</ul>
										</div>

										<label className="pt-2 text-gray-600 font-bold w-5/6">
										Would you recommend this course to others?
										</label>
										<div className="w-4/5">
											<ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r1" {...formik.getFieldProps("recommend")} name="recommend" value="never" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r1" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Never</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r2" {...formik.getFieldProps("recommend")} name="recommend" value="probably not" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r2" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Probably Not</label>
													</div>
												</li>
												<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
													<div className="flex items-center pl-3">
														<input type="radio" id="q5r3" {...formik.getFieldProps("recommend")} name="recommend" value="maybe" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r3" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Maybe</label>
													</div>
												</li>
												<li className="w-full dark:border-gray-600">
													<div class="flex items-center pl-3">
														<input type="radio" id="q5r4" {...formik.getFieldProps("recommend")} name="recommend" value="definitely" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
														<label for="q1r4" className="text-left w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Definitely</label>
													</div>
												</li>
											</ul>
										</div>
										<br></br>
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
									Back to Dashboard
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}