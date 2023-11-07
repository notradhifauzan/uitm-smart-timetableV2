import React from 'react'
import Toast from 'react-bootstrap/Toast';
import { useState } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';

export const ToastTemplate = ({ toastContext, toastMessage, show, setShow, success }) => {
     
    return (
        <>
            {(success == false) && (
                <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
                    <Toast bg="danger" onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Header>
                            <img
                                src="holder.js/20x20?text=%20"
                                className="rounded me-2"
                                alt=""
                            />
                            <strong className="me-auto">{toastContext}</strong>
                            <small className="text-muted">just now</small>
                        </Toast.Header>
                        <Toast.Body className='text-white'>{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
            {success && (
                <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
                    <Toast bg='success' onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Header>
                            <img
                                src="holder.js/20x20?text=%20"
                                className="rounded me-2"
                                alt=""
                            />
                            <strong className="me-auto">{toastContext}</strong>
                            <small className="text-muted">just now</small>
                        </Toast.Header>
                        <Toast.Body className='text-white'>{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </>
    )
}
