import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import TimeTable from 'react-timetable-events';
import { Loading } from '../components/Loading';
import { DataReady } from '../components/DataReady';
import { LineChart } from '../components/LineChart';

export const ProcessData = ({ courseData, avoidGroupList, randomizeOptions,
    registeredCourseList, timetable, setTimetable, conflictLogs, setConflictLogs, demoMode }) => {
    const navigate = useNavigate()
    const [newSortedDays, setSortedDays] = useState([])
    const [clashCount, setClashCount] = useState(1);
    const [responseMessage, setResponseMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const [enableProcessButton, setEnableProcessButton] = useState(false);
    const [dataSent, setDataSent] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [convergenceArray, setConvergenceArray] = useState([])
    const [populationSize, setPopulationSize] = useState(10);
    const [numGeneration, setNumGeneration] = useState(20);
    const [mutationRate, setMutationRate] = useState(0.1);
    const [showChart, setShowChart] = useState(false);
    const [showParameterConfiguration, setShowParameterConfiguration] = useState(false);
    const [maxScore,setMaxScore] = useState(0);

    useEffect(()=>{
        console.log(avoidGroupList)
        console.log(JSON.stringify(avoidGroupList))
    },[])

    // if courseData length is empty, then cannot proceed to process data
    useEffect(() => {
        setMaxScore(avoidGroupList.length);
        if (registeredCourseList.length === 0 || randomizeOptions.length === 0 ||
            avoidGroupList.length === 0) {
            console.log('some values are missing. cannot process your data')
            setEnableProcessButton(false)

            return navigate("/inputCourses", { replace: true });
        } else {
            setEnableProcessButton(true)
        }
    }, [])

    const sendDataToAPI = async () => {
        setShowParameterConfiguration(false);
        setLoading(true);
        try {
            const payload = {
                course_data: courseData,
                uw_group_list: avoidGroupList,
                randomize_options: randomizeOptions,
                registered_course: registeredCourseList,
                population_size: populationSize,
                num_generation: numGeneration,
                mutation_rate: mutationRate
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
                setConvergenceArray(data.convergence_list);
                setResponseMessage(data.chromosome);
                setClashCount(data.clashes);
                setConflictLogs(data.conflict_logs);
                setShowChart(true);
            } else {
                throw new Error('Failed to send data');
                setShowChart(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setShowChart(false);
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
                            type: 'error', // Set the event type as needed
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
        }
    }, [loading, responseMessage]) // wait for loading and response message, then can setTimetable

    useEffect(() => {
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
            return 'btn btn-sm btn-outline-secondary ms-2 disabled text-white'
        } else {
            return 'btn btn-sm btn-outline-secondary ms-2 text-white'
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

    const configureParameters = () => {
        if (!demoMode) {
            sendDataToAPI();
        } else {
            setShowParameterConfiguration(true);
        }
    }

    return (
        <div>
            {!enableProcessButton && (
                <div className="alert alert-warning mt-3" role="alert">
                    Some parameters are missing, go back to 'inputCourses' page
                </div>
            )}

            <nav className="navbar navbar-expand-lg bg-body-tertiary mt-4 mb-2" style={navbarStyle}>
                <button onClick={()=>configureParameters()} className={isButtonSendEnabled()} type="button">
                    {dataSent ? 'run again' : 'start algorithm'} <i className="fa-solid fa-shuffle"></i>
                </button>

                <button onClick={goToCourseSetup} className={isButtonConfigureEnabled()} type="button">
                    configure courses <i className="fa-solid fa-gear"></i>
                </button>

                <div className="flex-grow-1"></div>

                {(dataSent && !loading) && (
                    clashCount > 0 ? (
                        <button onClick={() => setShowLogs(true)} type="button" className="btn btn-sm btn-outline-danger position-relative me-3">
                            clash <i className="fa-solid fa-burst"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {clashCount}
                                <span className="visually-hidden">clash count</span>
                            </span>
                        </button>
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
                    hoursInterval={{ from: 8, to: 20 }}
                />
            )}

            {loading && (
                <Loading />
            )}

            {(enableProcessButton && JSON.stringify(responseMessage) === '{}' && !loading) && (
                <DataReady />
            )}

            <Modal show={showParameterConfiguration} size='lg'>
                <Modal.Header>configure genetic parameters</Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="populationSize" className="form-label">Population size</label>
                        <input value={populationSize} onChange={(event)=>setPopulationSize(event.target.value)} type="number" className="form-control" id="populationSize" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="numGenerations" className="form-label">Num generations</label>
                        <input value={numGeneration} onChange={(event)=>setNumGeneration(event.target.value)} type="number" className="form-control" id="numGenerations" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mutationRate" className="form-label">Mutation Rate</label>
                        <input value={mutationRate} onChange={(event)=>setMutationRate(event.target.value)} type="number" className="form-control" id="mutationRate" min="0.01" max="0.9" step="0.01" />
                    </div>
                    <div className="mb-3">
                        <Button onClick={sendDataToAPI}>Run</Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowParameterConfiguration(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {(JSON.stringify(responseMessage) !== '{}') && (
                <Modal show={showChart} size='lg'>
                    <Modal.Header>Convergence result</Modal.Header>
                    <Modal.Body>
                        <LineChart chartData={convergenceArray} maxScore={maxScore}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setShowChart(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            <Modal show={showLogs} size="lg">
                <Modal.Header>Conflict logs</Modal.Header>
                <Modal.Body>
                    <div className="container text-center border-danger">
                        {conflictLogs.map((log, index) => (
                            <>
                                <div className="row border-danger" style={{ fontSize: '12px' }} key={index}>
                                    {log.map((group, index) => (
                                        <div className="col mb-2" key={index}>
                                            <ul className="list-group">
                                                <li className="list-group-item">{group.course_name}</li>
                                                <li className="list-group-item">{group.group_name}</li>
                                                <li className="list-group-item" style={{ whiteSpace: 'nowrap' }}>{group.time_start} - {group.time_end}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <hr />
                            </>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowLogs(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
