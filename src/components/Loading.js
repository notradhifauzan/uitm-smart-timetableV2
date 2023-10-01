import React, { useEffect, useState } from 'react'
import genetic_gif from './assets/genetic_loading.gif'

export const Loading = () => {
    const [loadingMessage, setLoadingMessage] = useState([])

    useEffect(() => {
        const data = [...loadingMessage]
        // Add informative loading messages
        data.push('This may take a while, we are trying to come up with the best timetable according to your configurations.');
        data.push('Generating your timetable... Please wait while these \'genetics\' do their work.');
        data.push('Searching for the perfect schedule just for you.');

        // Add motivational messages
        data.push('Hang tight! We\'re making your schedule awesome.');
        data.push('The magic is happening behind the scenes.');
        data.push('Good things come to those who wait. Your ideal schedule is on the way.');

        // Add fun messages
        data.push('Grab a snack while we work our magic.');
        data.push('Enjoy some elevator music while we crunch the numbers.');
        data.push('Counting down the seconds to your perfect timetable.');

        // Add tips or trivia
        data.push('Did you know? Scheduling is like solving a puzzle.');
        data.push('Tip: You can adjust your preferences later if needed.');
        data.push('Tip: You can run multiple times to view different solutions.');
        data.push('Fun Fact: The best schedules often have a bit of randomness.');

        setLoadingMessage(data)
    }, [])

    return (
        <>
            <div className="px-4 py-5 my-5 text-center">
                <img className="d-block mx-auto mb-4" src={genetic_gif} alt="" width="100" height="100" />
                <h3 className="display-5 fw-bold text-body-emphasis">Loading ...</h3>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">{loadingMessage[(Math.floor(Math.random()*loadingMessage.length))]}</p>
                </div>
            </div>
        </>
    )
}
