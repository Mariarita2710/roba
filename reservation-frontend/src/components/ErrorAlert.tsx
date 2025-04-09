import React from "react";
import Alert from 'react-bootstrap/Alert';

type ErrorAlertProps = {
    message: string;
    onClose?: () => void;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
    return (
        <Alert variant="danger" dismissible onClose={onClose}>
            {message}
        </Alert>
    );
};

export default ErrorAlert;