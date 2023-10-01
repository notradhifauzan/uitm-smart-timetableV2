import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, SelectCampus, SelectCourses } from '../pages/index';
import { SetupCourses } from '../pages/SetupCourses';
import { ProcessData } from '../pages/ProcessData';
import { ConfigureCourses } from '../pages/ConfigureCourses';

export const AllRoutes = () => {
    const [facultyCode, setFacultyCode] = useState("");
    const [campusCode, setCampusCode] = useState("");
    const [courseList, setCourseList] = useState([]);
    const [courseData, setCourseData] = useState({});
    const [avoidGroupList, setAvoidGroupList] = useState([[]]);
    const [randomizeOptions, setRandomizeOptions] = useState([]);
    const [registeredCourseList, setRegisteredCourseList] = useState([]);

    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/selectCampus' element={
                        <SelectCampus
                            campusCode={campusCode}
                            setCampusCode={setCampusCode}
                            facultyCode={facultyCode}
                            setFacultyCode={setFacultyCode}
                        />
                    }></Route>
                    <Route
                        path='/selectCourses'
                        element={
                            <SelectCourses
                                facultyCode = {facultyCode}
                                campusCode={campusCode}
                                courseList={courseList}
                                setCourseList={setCourseList} />
                        }>
                    </Route>
                    <Route path='/setupCourses' element={
                        <SetupCourses
                            facultyCode = {facultyCode}
                            randomizeOptions={randomizeOptions}
                            setRandomizeOptions={setRandomizeOptions}
                            courseData={courseData}
                            setCourseData={setCourseData}
                            campusCode={campusCode}
                            courseList={courseList}
                            avoidGroupList={avoidGroupList}
                            setAvoidGroupList={setAvoidGroupList}
                            registeredCourseList={registeredCourseList}
                            setRegisteredCourseList={setRegisteredCourseList}
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
                            />}>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}
