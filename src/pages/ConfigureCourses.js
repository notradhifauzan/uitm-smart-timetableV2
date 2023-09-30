import React from 'react'
import { CourseDetails } from './CourseDetails'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const ConfigureCourses = ({ randomizeOptions, setRandomizeOptions, courseData,
    avoidGroupList, setAvoidGroupList,
    registeredCourseList, setRegisteredCourseList }) => {

    const navigate = useNavigate()

    // if courseData length is empty, then cannot proceed to process data
    useEffect(() => {
        if (registeredCourseList.length === 0 || randomizeOptions.length === 0 ||
            avoidGroupList.length === 0) {
            console.log('some values are missing. cannot process your data')
            return navigate("/selectCampus", { replace: true });
        }
    }, [])

    const handleProceedButton = (event) => {
        event.preventDefault()

        return navigate("/processData")
    }

    return (
        <>
            <nav className="navbar bg-body-tertiary mt-3">
                <form className="container-fluid justify-content-start">
                    <button onClick={(event) => handleProceedButton(event)} className="btn btn-outline-success me-2" type="button">Proceed</button>
                </form>
            </nav>
            {/**for each course exist in the courseData state variable, I want to iterate this component below */}
            {Object.values(courseData).map((course, index) => (
                <CourseDetails
                    key={index}
                    index={index}
                    course={course}
                    randomizeOptions={randomizeOptions}
                    setRandomizeOptions={setRandomizeOptions}
                    avoidGroupList={avoidGroupList}
                    setAvoidGroupList={setAvoidGroupList}
                    registeredCourseList={registeredCourseList}
                    setRegisteredCourseList={setRegisteredCourseList}
                />
            ))}
        </>
    )
}
