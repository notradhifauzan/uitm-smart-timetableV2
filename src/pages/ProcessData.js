import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeTable from 'react-timetable-events';
import { Loading } from '../components/Loading';
import { DataReady } from '../components/DataReady';

export const ProcessData = ({ courseData, avoidGroupList, randomizeOptions, registeredCourseList, timetable, setTimetable }) => {
    const navigate = useNavigate()
    const [newSortedDays, setSortedDays] = useState([])
    const [clashCount, setClashCount] = useState(1);
    const [responseMessage, setResponseMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const [enableProcessButton, setEnableProcessButton] = useState(false);
    const [dataSent, setDataSent] = useState(false);

    // if courseData length is empty, then cannot proceed to process data
    useEffect(() => {
        if (registeredCourseList.length === 0 || randomizeOptions.length === 0 ||
            avoidGroupList.length === 0) {
            console.log('some values are missing. cannot process your data')
            setEnableProcessButton(false)

            return navigate("/selectCampus", { replace: true });
        } else {
            setEnableProcessButton(true)
        }

        console.log(JSON.stringify(responseMessage) === '{}')
    }, [])

    const sendDataToAPI = async () => {
        setLoading(true);
        try {
            const payload = {
                course_data: courseData,
                uw_group_list: avoidGroupList,
                randomize_options: randomizeOptions,
                registered_course: registeredCourseList,
            };

            const response = await fetch('http://127.0.0.1:8000/process_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setResponseMessage(data.chromosome);
                setClashCount(data.clashes);
            } else {
                throw new Error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setDataSent(true);
        }
    };

    const convertTimeToISO = (timeStr) => {
        // Split the time string into hours and minutes
        const [hourStr, minuteStr] = timeStr
            .replace(/\s+/g, '') // Remove spaces
            .toLowerCase() // Convert to lowercase
            .split(':'); // Split by colon

        // Parse hours and minutes as integers
        const hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);

        // Check if it's AM or PM based on your backend format
        if (timeStr.includes('pm')) {
            // If PM and not 12 PM, add 12 hours to hours
            if (hours !== 12) {
                hours += 12;
            }
        } else if (timeStr.includes('am') && hours === 12) {
            // If AM and 12 AM, set hours to 0
            hours = 0;
        }

        // Create a new Date object with the time
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        // Return the date in ISO 8601 format
        return date.toISOString();
    };

    useEffect(() => {
        if (!loading && Array.isArray(responseMessage)) {
            console.log('loading finished, initializing events')
            // Check if responseMessage is an array
            const events = {};
            // Loop through responseMessage and populate events
            const chromosome = responseMessage;
            chromosome.forEach(course => {
                course.groups.forEach(group => {
                    group.sessions.forEach(session => {
                        // Create an event object based on the session data
                        const timeStartISO = convertTimeToISO(session.time_start)
                        const timeEndISO = convertTimeToISO(session.time_end)
                        const event = {
                            id: Math.floor(Math.random() * 10000), // Generate a unique ID
                            name: `${course.name} - ${group.name}`,
                            startTime: new Date(timeStartISO), // Adjust the date as needed
                            endTime: new Date(timeEndISO), // Adjust the date as needed
                            type: 'custom', // Set the event type as needed
                        };

                        // Determine the day of the week (e.g., "monday")
                        const dayOfWeek = session.day.toLowerCase();

                        // Initialize the events array for the day if it doesn't exist
                        if (!events[dayOfWeek]) {
                            events[dayOfWeek] = [];
                        }

                        // Add the event to the corresponding day
                        events[dayOfWeek].push(event);
                    });
                });
            });

            setTimetable(events);
        } else {
            console.log('still loading')
        }
    }, [loading, responseMessage]) // wait for loading and response message, then can setTimetable

    useEffect(() => {
        // Sort the days of the week
        console.log('sorting days...')
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

        setSortedDays(sortedDays)
    }, [timetable]) // wait for timetable variable to be fully initialize, then can run this again



    const isButtonSendEnabled = () => {
        if (loading) {
            return 'btn btn-sm btn-outline-success ms-2 disabled'
        } else {
            return 'btn btn-sm btn-outline-success ms-2'
        }
    }

    const isButtonConfigureEnabled = () => {
        if (loading) {
            return 'btn btn-sm btn-outline-secondary ms-2 disabled'
        } else {
            return 'btn btn-sm btn-outline-secondary ms-2'
        }
    }

    const goToCourseSetup = () => {
        return navigate("/configureCourses", { replace: true })
    }

    const navbarStyle = {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        border: '1px solid #000',
    };

    return (
        <div>
            {!enableProcessButton && (
                <div className="alert alert-warning mt-3" role="alert">
                    Some parameters are missing, go back to 'selectCampus' page
                </div>
            )}

            <nav className="navbar navbar-expand-lg bg-body-tertiary mt-4 mb-2" style={navbarStyle}>
                <button onClick={sendDataToAPI} className={isButtonSendEnabled()} type="button">
                    {dataSent ? 'run again' : 'start algorithm'} <i className="fa-solid fa-shuffle"></i>
                </button>

                <button onClick={goToCourseSetup} className={isButtonConfigureEnabled()} type="button">
                    configure courses <i className="fa-solid fa-gear"></i>
                </button>

                <div className="flex-grow-1"></div>

                {(dataSent && !loading) && (
                    clashCount > 0 ? (
                        <span className="badge rounded-pill text-bg-warning me-3">{clashCount} clash found</span>
                    ) : (
                        <span className="badge rounded-pill text-bg-success me-3">No clash found</span>
                    )
                )}

                {!dataSent && (
                    <span className="badge rounded-pill text-bg-info me-3">Data ready</span>
                )}

                {loading && (
                    <div className="spinner-grow me-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </nav>

            {(dataSent == true && loading == false) && (
                <TimeTable events={newSortedDays.reduce((sortedEvents, day) => {
                    sortedEvents[day] = timetable[day];
                    return sortedEvents;
                }, {})}

                    style={{ height: '500px' }}
                    hoursInterval={{ from: 8, to: 19 }}
                />
            )}

            {loading && (
                <Loading />
            )}

            {(enableProcessButton && JSON.stringify(responseMessage) === '{}' && !loading) && (
                <DataReady />
            )}
        </div>
    );
};
