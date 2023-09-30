import React from 'react'
import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

export const SelectCampus = ({ campusCode, setCampusCode }) => {
    const navigate = useNavigate();
    const url = "http://127.0.0.1:8000/listCampusCode";
    const { data: campus_codes, loading, error } = useFetch(url);
    const [selectedCampus, setSelectedCampus] = useState("");

    const submitCampusCode = (e) => {
        e.preventDefault();

        // Check if a campus code is selected
        if (selectedCampus) {
            // Call the function and pass the selected campus code as an argument
            setCampusCode(selectedCampus);
            return navigate("/selectCourses")
        } else {
            // Handle the case where no campus code is selected (optional)
            console.log("Please select a campus code before proceeding.");
        }
    }

    const handleCampusSelect = (event) => {
        // Update the selected campus code in the state when an option is selected
        setSelectedCampus(event.target.value);
    }

    return (
        <>
            <form>
                <select name='campus_code_select' className="form-select mt-5" aria-label="Default select example" onChange={handleCampusSelect}>
                    <option>Select campus code</option>
                    {campus_codes && campus_codes.map((code) => (
                        <option value={code} key={code}>{code}</option>
                    ))}
                </select>
                <button onClick={(event)=>submitCampusCode(event)} className="btn btn-primary mt-4">Next</button>
            </form>
        </>
    )
}
