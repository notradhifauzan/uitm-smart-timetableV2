import React, { useEffect, useState } from 'react'
import { Toast } from 'react-bootstrap';

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

export const CourseDetails = ({ course, index, randomizeOptions, setRandomizeOptions,
    avoidGroupList, setAvoidGroupList,
    registeredCourseList, setRegisteredCourseList }) => {

    const [showToast, setShowToast] = useState(false)
    // handling group to avoid (adding and removing)
    // adding
    const handleAvoidGroupSelection = (event, index) => {
        const newData = [...avoidGroupList];
        let gname = event.target.value;

        if (gname.length === 0) {
            newData[index] = [];
            setAvoidGroupList(newData);
        } else {
            if (!newData[index].includes(gname)) {
                if (newData[index].length === course.groups.length - 1) {
                    console.log('trying to break my system huh?')
                    setShowToast(true)
                } else {
                    handleAddAvoidGroupList(index, gname);
                }
            } else {
                console.log('you already added this item');
            }
        }
    }

    const handleAddAvoidGroupList = (index, gname) => {
        const newData = [...avoidGroupList];
        newData[index].push(gname);
        setAvoidGroupList(newData);
    }

    // removing
    const handleRemoveItemFromExcludeGroupList = (gname, index) => {
        const data = [...avoidGroupList];
        data[index] = data[index].filter(item => item !== gname);
        setAvoidGroupList(data);
    }

    /* useEffect(() => {
        console.log(avoidGroupList)
    }, [avoidGroupList]) */

    // ^^ handling group to avoid (adding and removing) ^^

    // ui
    const customStyle = {
        fontSize: '14px',
    };

    // mutating the randomize options array
    // rc objects will be mutated here
    const handleRandomizeOptionsArray = (index, event) => {
        // Create a new array with the same elements as randomizeOptions
        const updatedRandomizeOptions = [...randomizeOptions];
        let gname = event.target.value;
        // Set the element at the specified index to false or true
        if (gname.length > 0) {
            updatedRandomizeOptions[index] = false;
            clearExcludedGroupList()
            mutateRegisteredCourseObj(gname);
        } else {
            updatedRandomizeOptions[index] = true;
            mutateRegisteredCourseObj(gname);
        }

        // Update the randomizeOptions state with the new array
        setRandomizeOptions(updatedRandomizeOptions);
    }

    const clearExcludedGroupList = () => {
        const data = [...avoidGroupList]
        data[index] = []
        setAvoidGroupList(data);
    }

    const mutateRegisteredCourseObj = (gname) => {
        if (gname.length > 0) {
            // search that group, get their session, store into objects
            const preferredGroup = course.groups.find((group) => group.name === gname);
            const rcl = [...registeredCourseList]

            const group = new Group(preferredGroup.name)
            for (const session of preferredGroup.sessions) {
                const newSession = new Session(session.day, session.time_start, session.time_end)
                group.sessions.push(newSession)
            }

            rcl[index].groups = [];
            rcl[index].addGroup(group);
            setRegisteredCourseList(rcl);
        } else {
            // randomly select any group, get their session, store into objects
            const rcl = [...registeredCourseList]
            const randomGroup = course.groups[Math.floor(Math.random() * course.groups.length)]

            const group = new Group(randomGroup.name)
            for (const session of randomGroup.sessions) {
                const newSession = new Session(session.day, session.time_start, session.time_end)
                group.sessions.push(newSession)
            }

            rcl[index].groups = [];
            rcl[index].addGroup(group);
            setRegisteredCourseList(rcl);
        }
    }

    const disableSelectOrNot = () => {
        const rand = [...randomizeOptions]
        if (rand[index] === true) {
            return false
        } else {
            return true
        }
    }

    /* useEffect(() => {
        console.log(randomizeOptions);
    }, [randomizeOptions]); */

    return (
        <div className="card mb-3 mt-4" style={customStyle}>
            <div className="card-header">
                <h5>{course.name}</h5>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="card-title" style={customStyle}>Preferred group</h5>
                        <select className="form-select" onChange={(event) => handleRandomizeOptionsArray(index, event)}>
                            <option value={""}>I'm flexible</option>
                            {course.groups.map((group) => (
                                <option key={group.name} value={group.name} >
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        <div className="row mt-3">
                            <div className="col-md-8">
                                <h5 className="card-title" style={customStyle}>Select course group you want to exclude</h5>
                                <select className="form-select" disabled={disableSelectOrNot()} onChange={(event) => handleAvoidGroupSelection(event, index)}>
                                    <option value={""}>I'm flexible</option>
                                    {course.groups.map((group) => (
                                        <option key={group.name} value={group.name}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h5 className="card-title" style={customStyle}>List of excluded course groups</h5>
                        <ul className="list-group">
                            {avoidGroupList[index].length === 0 && (
                                <li className="list-group-item">empty list</li>
                            )}
                            {avoidGroupList[index].map((item) => (
                                <li className="list-group-item list-group-item-danger d-flex justify-content-between align-items-center" key={item}>
                                    {item}
                                    <button
                                        onClick={() => handleRemoveItemFromExcludeGroupList(item, index)}
                                        className="btn btn-sm btn-outline-secondary ms-4 border-0">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <p className="card-text mt-4">More constraints may lead to an inefficient or no solution.</p>
            </div>

            <Toast className='mt-2 ms-2 mb-2' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Warning</strong>
                </Toast.Header>
                <Toast.Body>So you're planning not to join any group?</Toast.Body>
            </Toast>
        </div>
    )
}
