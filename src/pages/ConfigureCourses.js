import React, { useState } from 'react'
import { CourseDetails } from './CourseDetails'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import TimeTable from 'react-timetable-events'

export const ConfigureCourses = ({ randomizeOptions, setRandomizeOptions, courseData,
    avoidGroupList, setAvoidGroupList,
    registeredCourseList, setRegisteredCourseList, timetable }) => {

    const [show, setShow] = useState(false)
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

    // Sort the days of the week
    const sortedDays = Object.keys(timetable).sort((day1, day2) => {
        // Convert day names to numbers (0 for Sunday, 1 for Monday, etc.)
        const dayOfWeek = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };

        return dayOfWeek[day1] - dayOfWeek[day2];
    });

    return (
        <>
            <nav className="navbar bg-body-tertiary mt-3">
                <form className="container-fluid justify-content-start">
                    <button onClick={(event) => handleProceedButton(event)} className="btn btn-sm btn-outline-success me-2" type="button">Proceed</button>
                    <button onClick={() => setShow(true)} className="btn btn-sm btn-outline-secondary me-2" type="button">peek current timetable</button>
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

            <Modal show={show} size="lg">
                <Modal.Header>Current Timetable</Modal.Header>
                <Modal.Body>
                    <TimeTable events={sortedDays.reduce((sortedEvents, day) => {
                        sortedEvents[day] = timetable[day];
                        return sortedEvents;
                    }, {})}

                        style={{ height: '500px' }}
                        hoursInterval={{ from: 8, to: 19 }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
