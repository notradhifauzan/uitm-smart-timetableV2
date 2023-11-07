import React, { useEffect, useState } from 'react';
import { CourseDetails } from './CourseDetails';
import { useNavigate } from 'react-router-dom';
import { CourseData } from '../components/course_data';
import { AGL } from '../components/custom_configurations';

class RegisteredCourse {
    constructor(name) {
        this.name = name;
        this.groups = [];
    }

    addGroup(group) {
        this.groups.push(group);
    }
}

class Group {
    constructor(name) {
        this.name = name;
        this.sessions = [];
    }
}

class Session {
    constructor(day, time_start, time_end) {
        this.day = day;
        this.time_start = time_start;
        this.time_end = time_end;
    }
}

export const SetupCourses = ({ randomizeOptions, setRandomizeOptions, courseData,
    setCourseData, courseList,
    avoidGroupList, setAvoidGroupList,
    registeredCourseList, setRegisteredCourseList,demoMode }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // fetch course data sequentially
    useEffect(() => {
        if(!demoMode){
            // Function to fetch course data for a single course code
            const fetchCourseData = async (course) => {
                let url = '';
                url = `http://127.0.0.1:8000/get_course_data`;
    
                const payload = {
                    course_link: course.course_link
                };
    
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
    
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    const result = await response.json();
                    // Store the course data in the state using the course code as the key
                    setCourseData((prevData) => ({
                        ...prevData,
                        [course.name]: result.course_data,
                    }));
                } catch (error) {
                    console.log(error.message);
                    setError(error.message);
                }
            };
    
            // Make API calls for each course code in courseList in order
            setLoading(true);
            setError("");
            const fetchSequentially = async () => {
                for (const code of courseList) {
                    await fetchCourseData(code);
                }
                setLoading(false);
            };
    
            fetchSequentially();
        } else {
            setCourseData(CourseData);
        }
    }, [courseList]);

    // initialize randomize options array, set to true
    // initialize unwanted group list, set the length to courseList.length
    // initialize list of registeredCourse
    useEffect(() => {
        if(!demoMode){
            const newRandomizeOptions = Array(courseList.length).fill(true);
            setRandomizeOptions(newRandomizeOptions);
    
            const uwGroupLists = Array.from({ length: courseList.length }, () => []);
            setAvoidGroupList(uwGroupLists);
    
            const rcList = Array.from({ length: courseList.length }, () => []);
            setRegisteredCourseList(rcList);
        } else {
            const newRandomizeOptions = Array(Object.keys(CourseData).length).fill(true);
            setRandomizeOptions(newRandomizeOptions);
    
            const uwGroupLists = Array.from({ length: Object.keys(CourseData).length }, () => []);
            setAvoidGroupList(uwGroupLists);
    
            const rcList = Array.from({ length: Object.keys(CourseData).length }, () => []);
            setRegisteredCourseList(rcList);

            setAvoidGroupList(AGL);
        }

    }, [courseList, setRandomizeOptions]);

    useEffect(() => {
        if (!loading) {
            const rcl = []
            for (const courseName in courseData) {
                if (courseData.hasOwnProperty(courseName)) {
                    const rc = new RegisteredCourse(courseName)

                    const groups = courseData[courseName].groups
                    const randomGroup = groups[Math.floor(Math.random() * groups.length)]

                    const group = new Group(randomGroup.name)

                    for (const session of randomGroup.sessions) {
                        const newSession = new Session(session.day, session.time_start, session.time_end)
                        group.sessions.push(newSession)
                    }

                    rc.addGroup(group)

                    rcl.push(rc)
                }
            }
            setRegisteredCourseList(rcl);
        }
    }, [courseData, loading])

    const handleProceedButton = (event) => {
        event.preventDefault()

        return navigate("/processData")
    }

    if (loading) {
        return (
            <div className="d-flex align-items-center mt-4">
                <strong role="status">Loading course data...</strong>
                <div className="spinner-border ms-auto" aria-hidden="true"></div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const navbarStyle = {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        border: '1px solid #000',
    };

    return (
        <>
            <nav className="navbar bg-body-tertiary mt-3" style={navbarStyle}>
                <form className="container-fluid justify-content-start">
                    <button onClick={(event) => handleProceedButton(event)} className="btn btn-sm btn-outline-success me-2" type="button">Proceed <i className="fa-solid fa-play"></i></button>
                </form>
            </nav>
            {/**for each course exist in the courseData state variable, I want to iterate this component below */}
            {!loading && Object.values(courseData).map((course, index) => (
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
    );
};
