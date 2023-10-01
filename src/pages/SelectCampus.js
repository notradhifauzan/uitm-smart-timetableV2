import React, { useEffect } from 'react'
import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

export const SelectCampus = ({ campusCode,setCampusCode,facultyCode,setFacultyCode }) => {
    const navigate = useNavigate();
    const [selectedCampus, setSelectedCampus] = useState("");
    const [displayFacultyCode, setDisplayFacultyCode] = useState(false);
    const [campusNameList,setCampusNameList] = useState([])
    const [campusCodeList,setCampusCodeList] = useState([])
    const [facList,setFaclist] = useState([])
    const [facNameList,setFacNameList] = useState([])

    const url = "http://127.0.0.1:8000/listCampusCode";
    const url2 = "http://127.0.0.1:8000/getFacultyCode";

    const { data: faculty } = useFetch(url2)
    const { data: campus } = useFetch(url);

    useEffect(() => {
        const faculty_values = []
        const faculty_names = []

        const campus_codes = []
        const campus_names = []

        if(campus){
            campus_codes.push(...campus.campus_code)
            campus_names.push(...campus.campus_name)

            setCampusCodeList(campus_codes)
            setCampusNameList(campus_names)
        }
        
        if(faculty){
            faculty_values.push(...faculty.faculty_value)
            faculty_names.push(...faculty.faculty_name)

            setFaclist(faculty_values)
            setFacNameList(faculty_names)
        }
    }, [faculty,campus])

    const submitCampusCode = (e) => {
        e.preventDefault();

        if(selectedCampus){
            if(selectedCampus == 'B'){
                if(facultyCode == ''){
                    console.log('you need to select your faculty before proceeding')
                } else {
                    setCampusCode(selectedCampus)
                    return navigate("/selectCourses")
                }
            } else {
                setCampusCode(selectedCampus)
                return navigate("/selectCourses")
            }
        } else {
            console.log('Please select a campus code before proceeding')
        }
    }

    const handleCampusSelect = (event) => {
        // Update the selected campus code in the state when an option is selected
        let selectedCampus = event.target.value;
        if (selectedCampus == 'B') {
            setDisplayFacultyCode(true);
        } else {
            setDisplayFacultyCode(false);
            setFacultyCode("");
        }
        setSelectedCampus(selectedCampus);
    }

    const handleFacultySelect = (event) => {
        let selectedFac = event.target.value;
        setFacultyCode(selectedFac)
    }

    return (
        <>
            <div className="card text-center mt-4">
                <div className="card-header">

                </div>
                <div className="card-body">
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <select name='campus_code_select' className="form-select mt-3" aria-label="Default select example" onChange={handleCampusSelect}>
                                    <option>Select campus code</option>
                                    {campusCodeList && campusCodeList.map((code,index) => (
                                        <option value={code} key={code}>{campusNameList[index]}</option>
                                    ))}
                                </select>
                            </div>
                            {displayFacultyCode && (
                                <div className="col-md-6">
                                    <select name='campus_code_select' className="form-select mt-3" aria-label="Default select example" onChange={handleFacultySelect}>
                                        <option>Select faculty code</option>
                                        {facList.map((fac,index) => (
                                            <option value={fac} key={fac}>{facNameList[index]}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-1">
                                <button onClick={(event) => submitCampusCode(event)} className="btn btn-primary">Next</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
