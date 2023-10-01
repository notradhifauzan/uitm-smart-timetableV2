import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export const SelectCourses = ({ facultyCode,setFacultyCode,campusCode, courseList, setCourseList }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (campusCode.length === 0) {
            console.log('campus code is empty')
            return navigate("/selectCampus", { replace: true })
        } else {

        }
    }, [])


    // handling ui
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [duplicateCourse, setDuplicateCourse] = useState(false);
    const [invalidCourse, setInvalidCourse] = useState(false);
    const inputRef = useRef(null);

    const handleConfirmCourses = (event) => {
        event.preventDefault();
        if (courseList.length >= 1 && campusCode) {
            return navigate("/setupCourses");
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestion(false);
            }
        }

        // Add the event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const [value, setValue] = useState('')

    let suggestions = [];

    // handling the response
    let url = '';
    if(facultyCode == ''){
        url = "http://127.0.0.1:8000/get_course_code/" + campusCode;
    } else {
        url = "http://127.0.0.1:8000/get_course_code/" + campusCode + '?faculty_code=' + facultyCode;
    }

    const { data: course_codes, loading, error } = useFetch(url);

    if (!loading && !error && course_codes && Array.isArray(course_codes.course_codes)) {
        const allCourseCodes = course_codes.course_codes.flat();
        suggestions = allCourseCodes;
    }

    // dynamically filter course code
    suggestions = suggestions.filter(code => code.toUpperCase().includes(value.toUpperCase()))

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    const handleAddCourse = (code) => {
        setValue(code);
        setShowSuggestion(false);
    }

    const addCourseButton_classValidation = () => {
        if (value) {
            return "btn btn-outline-success"
        } else {
            return "btn btn-outline-success disabled"
        }
    }

    const handleSubmitCourse = (e) => {
        e.preventDefault();
        // Check if the value is in suggestions and not in courseList
        if (courseList.includes(value)) {
            setDuplicateCourse(true);
            setInvalidCourse(false);
        }

        if (suggestions.includes(value) && !courseList.includes(value)) {
            setDuplicateCourse(false);
            // Update the courseList state with the new value
            setCourseList([...courseList, value]);
            // Clear the input field after adding
            setValue('');
            // Close the suggestion box
            setShowSuggestion(false);
            setInvalidCourse(false);
        } else if (!suggestions.includes(value)) {
            setDuplicateCourse(false);
            setInvalidCourse(true);
        }
    }

    const handleRemoveCourse = (course_id) => {
        const updatedCourseList = courseList.filter(course => course !== course_id);
        setCourseList(updatedCourseList);
    }



    return (
        <>
            {duplicateCourse && (
                <div className="alert alert-warning alert-dismissible fade show mt-4" role="alert">
                    <strong>Duplicate course!</strong> You already added that course.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            {invalidCourse && (
                <div className="alert alert-warning alert-dismissible fade show mt-4" role="alert">
                    <strong>Invalid course!</strong> Course code does not exist.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <nav className="navbar bg-body-tertiary mt-4">
                <div className="container-fluid">
                    <form className="d-flex mx-auto" role="search">
                        <input ref={inputRef} onFocus={() => setShowSuggestion(true)} value={value} onChange={(event) => handleChange(event)} className="form-control me-2" type="search" placeholder="Search courses" aria-label="Search" />
                        <button onClick={(event) => handleSubmitCourse(event)} className={addCourseButton_classValidation()}>Add</button>
                        {courseList.length >= 2 && (
                            <button onClick={(event) => handleConfirmCourses(event)} className="btn btn-outline-primary ms-3">confirm</button>
                        )}
                    </form>
                </div>

            </nav>

            {/* Suggestion box */}
            {showSuggestion && (
                <div className="position-relative mt-2 mx-auto" style={{ maxWidth: '200px' }}>
                    <div className="list-group dropdown-menu position-absolute">
                        {suggestions.map((code) => (
                            <button
                                onClick={() => handleAddCourse(code)}
                                key={code}
                                type="button"
                                className="list-group-item list-group-item-action text-center border-0 btn"
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                </div>
            )}


            <div className="row mt-4">
                {/** loop start from here */}
                {courseList.map((course) => (
                    <div key={course} className="col-sm-4 mb-3 mb-sm-2">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{course}</h5>
                            </div>
                            <div className="card-footer bg-transparent border-secondary d-flex justify-content-between">
                                <div> {/* This div is for other footer content, if any */}
                                    {/* Add other footer content here */}
                                </div>
                                <button onClick={() => handleRemoveCourse(course)} className="btn btn-sm">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )

}
