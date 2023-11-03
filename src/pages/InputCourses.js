import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export const InputCourses = () => {
    const inputRef = useRef(null);
    const [inputLink, setInputLink] = useState('');

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                //setShowSuggestion(false);
            }
        }

        // Add the event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const getCourseName = async () => {
        try {
            const payload = {
                course_link: inputLink
            };

            const response = await fetch('http://127.0.0.1:8000/getCourseName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                throw new Error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // do something
        }
    }

    const handleInputChange = (event) => {
        setInputLink(event.target.value);
    };

    const handleSubmitCourse = (event) => {
        event.preventDefault();
        console.log(inputLink);
        getCourseName(inputLink);
    }

    return (
        <>
            <nav className="navbar bg-body-tertiary mt-4">
                <div className="container-fluid">
                    <form className="d-flex mx-auto" role="search">
                        <input ref={inputRef} value={inputLink} onChange={handleInputChange} className="form-control me-2" type="search" placeholder="paste course link here" aria-label="Search" />
                        <button onClick={(event) => handleSubmitCourse(event)} className="btn btn-outline-success">Add</button>
                    </form>
                </div>

            </nav>
        </>
    )
}
