import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, SelectCampus, SelectCourses } from '../pages/index';
import { SetupCourses } from '../pages/SetupCourses';
import { ProcessData } from '../pages/ProcessData';
import { ConfigureCourses } from '../pages/ConfigureCourses';
import { InputCourses } from '../pages/InputCourses';

export const AllRoutes = () => {
    const [courseList, setCourseList] = useState([]);
    const [courseData, setCourseData] = useState({});
    const [avoidGroupList, setAvoidGroupList] = useState([[]]);
    const [randomizeOptions, setRandomizeOptions] = useState([]);
    const [registeredCourseList, setRegisteredCourseList] = useState([]);
    const [timetable,setTimetable] = useState({});
    const [conflictLogs,setConflictLogs] = useState([]);
    const [demoMode,setDemoMode] = useState(false);

    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/inputCourses' element={<InputCourses courseList={courseList} setCourseList={setCourseList} setDemoMode={setDemoMode} />}></Route>
                    <Route
                        path='/selectCourses'
                        element={
                            <SelectCourses
                                courseList={courseList}
                                setCourseList={setCourseList} />
                        }>
                    </Route>
                    <Route path='/setupCourses' element={
                        <SetupCourses
                            randomizeOptions={randomizeOptions}
                            setRandomizeOptions={setRandomizeOptions}
                            courseData={courseData}
                            setCourseData={setCourseData}
                            courseList={courseList}
                            avoidGroupList={avoidGroupList}
                            setAvoidGroupList={setAvoidGroupList}
                            registeredCourseList={registeredCourseList}
                            setRegisteredCourseList={setRegisteredCourseList}
                            demoMode={demoMode}
                        />
                    }>
                    </Route>
                    <Route path='/processData'
                        element={
                            <ProcessData
                                courseData={courseData}
                                avoidGroupList={avoidGroupList}
                                randomizeOptions={randomizeOptions}
                                registeredCourseList={registeredCourseList}
                                timetable = {timetable}
                                setTimetable = {setTimetable}
                                conflictLogs = {conflictLogs}
                                setConflictLogs = {setConflictLogs}
                                demoMode ={demoMode}
                            />
                        }
                    />
                    <Route path='/configureCourses'
                        element={
                            <ConfigureCourses
                                randomizeOptions={randomizeOptions}
                                setRandomizeOptions={setRandomizeOptions}
                                courseData={courseData}
                                setCourseData={setCourseData}
                                avoidGroupList={avoidGroupList}
                                setAvoidGroupList={setAvoidGroupList}
                                registeredCourseList={registeredCourseList}
                                setRegisteredCourseList={setRegisteredCourseList}
                                timetable = {timetable}
                                conflictLogs = {conflictLogs}
                            />}>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}
