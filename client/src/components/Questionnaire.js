import React from "react";
import { Link } from "react-router-dom";
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

	const formik = useFormik({
		initialValues: {
			username: "",
            type: "pre",
			course: "CSC101",
			section: "",
			date: "",
			semester: "Summer",
			likeProgramming: "yes",
			scaredCourse: "yes",
			whyScared: "",
			confidence: "no",
			expectation: "",
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
		},
	});

	const handleChange = (event) => {
		const selectedOption = event.target.value;
		formik.setFieldValue("scaredCourse", selectedOption);
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
									className={styles.textbox}>
									<option value="pre">Pre-Questionnaire</option>
									<option value="post">Post-Questionnaire</option>
								</select>

								{formik.values.type === "pre" ? (
									<>
										<select
											{...formik.getFieldProps("course")}
											className={styles.textbox}>
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
											<option value="Spring">Spring</option>
											<option value="Summer">Summer</option>
											<option value="Autumn">Autumn</option>
										</select>

										<label className="pt-1 text-gray-600 font-bold">
											Do you like programming?
										</label>
										<select
											{...formik.getFieldProps("likeProgramming")}
											className={styles.textbox}>
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>

										<label className="pt-2 text-gray-600 font-bold">
											Are you scared of this course?
										</label>
										<select
											{...formik.getFieldProps("scaredCourse")}
											className={styles.textbox}
											onChange={handleChange}>
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>

										{formik.values.scaredCourse === "yes" ? (
											<>
												<label className="pt-2 text-gray-600 font-bold">
													Why are you scared of this course?
												</label>
												<textarea
													cols="30"
													rows="3"
													{...formik.getFieldProps("whyScared")}
													type="text"
													placeholder="Type your answer here..."
													className={styles.textbox}
												/>
											</>
										) : (
											<>
												<label className="pt-1 text-gray-600 font-bold">
													Are you confident in getting good grades in this
													course?
												</label>
												<select
													{...formik.getFieldProps("confidence")}
													className={styles.textbox}>
													<option value="yes">Yes</option>
													<option value="no">No</option>
												</select>
											</>
										)}

										<label className="pt-2 text-gray-600 font-bold">
											What do you expect to learn from this course?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("expectation")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>
									</>
								) : (
									<>
										<select
											{...formik.getFieldProps("course")}
											className={styles.textbox}>
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
											Did you enjoy programming in this course?
										</label>
										<select
											{...formik.getFieldProps("likeProgramming")}
											className={styles.textbox}>
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>

										<label className="pt-2 text-gray-600 font-bold">
											Are you still scared of this course?
										</label>
										<select
											{...formik.getFieldProps("scaredCourse")}
											className={styles.textbox}
											onChange={handleChange}>
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>

										{formik.values.scaredCourse === "yes" ? (
											<>
												<label className="pt-2 text-gray-600 font-bold">
													Which part of this course is the most scariest?
												</label>
												<textarea
													cols="30"
													rows="3"
													{...formik.getFieldProps("whyScared")}
													type="text"
													placeholder="Type your answer here..."
													className={styles.textbox}
												/>
											</>
										) : (
											<>
												<label className="pt-1 text-gray-600 font-bold">
													Are you confident in the course topics now?
												</label>
												<select
													{...formik.getFieldProps("confidence")}
													className={styles.textbox}>
													<option value="yes">Yes</option>
													<option value="no">No</option>
												</select>
											</>
										)}

										<label className="pt-2 text-gray-600 font-bold">
											Did you expect to learn something more from this course?
										</label>
										<textarea
											cols="30"
											rows="3"
											{...formik.getFieldProps("expectation")}
											type="text"
											placeholder="Type your answer here..."
											className={styles.textbox}
										/>
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