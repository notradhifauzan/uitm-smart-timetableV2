import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate();

  const getStarted = () => {
    return navigate("/inputCourses")
  }

  return (
    <>
      <div className="p-5 text-center bg-body-tertiary rounded-3 mt-5">
        <h1 className="text-body-emphasis">Next-Gen Timetable Generator</h1>
        <p className="col-lg-8 mx-auto fs-5 text-muted">
          Some random text here. just for introductory purpose. it should be more than at least 100 characters to make it pleasantly nice to view though.
        </p>
        <div className="d-inline-flex gap-2 mb-5">
          <button onClick={getStarted} className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill" type="button">
            Get started &nbsp;
            <i className="fa-solid fa-play"></i>
          </button>
        </div>
      </div>
    </>
  )
}
