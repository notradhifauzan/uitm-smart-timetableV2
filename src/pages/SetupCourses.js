import React, { useEffect, useState } from 'react';
import { CourseDetails } from './CourseDetails';
import { useNavigate } from 'react-router-dom';

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
    setCourseData, campusCode, courseList,
    avoidGroupList, setAvoidGroupList,
    registeredCourseList, setRegisteredCourseList }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        if(campusCode.length === 0 || courseList.length === 0){
            return navigate("/selectCampus",{replace:true})
        }
    },[])

    useEffect(() => {
        // Function to fetch course data for a single course code
        const fetchCourseData = async (code) => {
            const url = `http://127.0.0.1:8000/get_course_data/${campusCode}/${code}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                // Store the course data in the state using the course code as the key
                setCourseData((prevData) => ({
                    ...prevData,
                    [code]: result.course_data,
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
    }, [campusCode, courseList]);

    // initialize randomize options array, set to true
    // initialize unwanted group list, set the length to courseList.length
    // initialize list of registeredCourse
    useEffect(() => {
        const newRandomizeOptions = Array(courseList.length).fill(true);
        setRandomizeOptions(newRandomizeOptions);

        const uwGroupLists = Array.from({ length: courseList.length }, () => []);
        setAvoidGroupList(uwGroupLists);

        const rcList = Array.from({ length: courseList.length }, () => []);
        setRegisteredCourseList(rcList);

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

    useEffect(() => {
        if (!loading && Object.keys(courseData).length === courseList.length) {
            //console.log(randomizeOptions);
        }
    }, [courseData, courseList, loading, randomizeOptions]);

    if (loading) {
        return (
            <div className="d-flex align-items-center mt-4">
                <strong role="status">Loading course data...</strong>
                <div className="spinner-border ms-auto" aria-hidden="true"></div>
            </div>
        );
    } else {
        //console.log(courseData);
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <nav className="navbar bg-body-tertiary mt-3">
                <form className="container-fluid justify-content-start">
                    <button onClick={(event)=>handleProceedButton(event)} className="btn btn-outline-success me-2" type="button">Proceed</button>
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
