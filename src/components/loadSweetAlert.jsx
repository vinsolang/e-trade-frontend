import React, { useEffect, useState } from 'react';

// Dynamically load SweetAlert2 library via CDN script tag
const loadSweetAlert = () => {
    // Check if Swal is already defined globally
    if (typeof window.Swal !== 'undefined') {
        return Promise.resolve(window.Swal);
    }

    const CDN_URL = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    
    // Check if the script is already pending
    if (document.querySelector(`script[src="${CDN_URL}"]`)) {
        return new Promise((resolve) => {
            const checkGlobal = setInterval(() => {
                if (typeof window.Swal !== 'undefined') {
                    clearInterval(checkGlobal);
                    resolve(window.Swal);
                }
            }, 50);
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = CDN_URL;
        script.onload = () => resolve(window.Swal);
        script.onerror = () => reject(new Error('Failed to load SweetAlert2 script.'));
        document.head.appendChild(script);
    });
};

/**
 * A utility component to display a SweetAlert2 modal.
 * @param {object} config - Configuration object for SweetAlert2 (e.g., {icon: 'success', title: 'Done'})
 * @param {function} onConfirm - Function to call when the user clicks 'OK' or closes the alert.
 */
const SweetAlert = ({ config, onConfirm }) => {
    const [SwalInstance, setSwalInstance] = useState(null);

    useEffect(() => {
        // Load the Swal library when the component mounts
        loadSweetAlert().then(setSwalInstance).catch(console.error);
    }, []);

    useEffect(() => {
        if (SwalInstance && config) {
            SwalInstance.fire({
                ...config,
                showConfirmButton: true,
                confirmButtonColor: config.icon === 'success' ? '#22c55e' : '#ef4444', // Green or Red
                confirmButtonText: 'OK',
            }).then(() => {
                // Call the cleanup function regardless of how the user closes the modal
                onConfirm(); 
            });
        }
    }, [SwalInstance, config, onConfirm]);

    return null; // This component doesn't render any visible UI directly
};

export default SweetAlert;
