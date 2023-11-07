import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ToastTemplate } from '../components/ToastTemplate'

export const InputCourses = ({ courseList, setCourseList,setDemoMode }) => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [inputLink, setInputLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [courseNotFound, setCourseNotFound] = useState(false);
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [isDuplicateCourse, setIsDuplicateCourse] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                //setShowSuggestion(false);
            }
        }

        // Add the event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const getCourseName = async () => {
        setLoading(true);
        try {
            const payload = {
                course_link: inputLink
            };

            const response = await fetch('http://127.0.0.1:8000/getCourseName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setFetchSuccess(true)
                const data = await response.json();

                const courseInfo = {
                    name: data.course_name,
                    course_link: inputLink
                }
                if (!duplicateCourse(courseInfo)) {
                    addCourseLink(courseInfo);
                } else {
                    setIsDuplicateCourse(true);
                }
            } else {
                setCourseNotFound(true);
                throw new Error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        } finally {
            // do something
            setLoading(false);
            setInputLink('');
        }
    }

    const duplicateCourse = (courseInfo) => {
        const existingCourse = [...courseList];

        // Check if any course in existingCourse has the same name as courseInfo
        const flag = existingCourse.some((course) => course.name === courseInfo.name);

        return flag;
    }

    const addCourseLink = (courseInfo) => {
        setCourseList([...courseList, courseInfo])
    }

    const handleInputChange = (event) => {
        setInputLink(event.target.value);
    };

    const handleSubmitCourse = (event) => {
        setFetchSuccess(false)
        setCourseNotFound(false);
        event.preventDefault();
        getCourseName(inputLink);
    }

    const handleRemoveCourse = (course_name_ref) => {
        const updatedCourseList = courseList.filter(course => course.name !== course_name_ref);
        setCourseList(updatedCourseList);
    }

    const handleConfirmCourses = (event) => {
        event.preventDefault();
        if (courseList.length >= 1) {
            return navigate("/setupCourses");
        }
    }

    const enableDemoMode = (event) => {
        event.preventDefault();
        setDemoMode(true);
        return navigate("/setupCourses");
    }

    return (
        <>
            {courseNotFound && (
                <ToastTemplate toastContext={'Course search'} toastMessage={'Could not find course with the given link. Please try again'} show={courseNotFound} setShow={setCourseNotFound} success={false} />
            )}
            {fetchSuccess && (
                <ToastTemplate toastContext={'Course search'} toastMessage={'Course fetch success'} show={fetchSuccess} setShow={setFetchSuccess} success={true} />
            )}
            {isDuplicateCourse && (
                <ToastTemplate toastContext={'Course search'} toastMessage={'You already added that course'} show={isDuplicateCourse} setShow={setIsDuplicateCourse} success={false} />
            )}
            <nav className="navbar bg-body-tertiary mt-4">
                <div className="container-fluid">
                    <form className="d-flex mx-auto" role="search">
                        <input ref={inputRef} value={inputLink} onChange={handleInputChange} className="form-control me-2" type="search" placeholder="paste course link here" aria-label="Search" />
                        <button onClick={(event) => handleSubmitCourse(event)} className="btn btn-outline-success">Add</button>
                        <button onClick={(event)=>enableDemoMode(event)} className="btn btn-outline-success ms-2">Demo</button>
                        {courseList.length >= 2 && (
                            <button onClick={(event) => handleConfirmCourses(event)} className="btn btn-outline-primary ms-3">confirm</button>
                        )}
                    </form>
                    {loading && (
                        <div className="spinner-grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                </div>
            </nav>

            <div className="row mt-4">
                {/** loop start from here */}
                {courseList.map((course) => (
                    <div key={course.name} className="col-sm-4 mb-3 mb-sm-2">
                        <div className="card text-bg-light mb-3" style={{opacity:0.5}}>
                            <div className="card-body">
                                <h5 className="card-title">{course.name}</h5>
                            </div>
                            <div className="card-footer bg-transparent border-secondary d-flex justify-content-between">
                                <div> {/* This div is for other footer content, if any */}
                                    {/* Add other footer content here */}
                                </div>
                                <button onClick={() => handleRemoveCourse(course.name)} className="btn btn-sm">
                                    <i style={{color:'black'}} className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
