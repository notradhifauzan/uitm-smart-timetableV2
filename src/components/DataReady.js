import React from 'react'

export const DataReady = () => {
    return (
        <div className="position-relative p-5 text-center text-muted bg-body">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="80px"
                viewBox="0 0 512 512"
                style={{ fill: '#75c653' }} // Set the fill color
            >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
            </svg>
            <h1 className="text-body-emphasis mt-2">Your data is ready to process</h1>
            <p className="col-lg-6 mx-auto mb-4">
                Please click the 'start algorithm' button above to generate your timetable. You can always adjust your preference later if needed.
            </p>
        </div>
    )
}
