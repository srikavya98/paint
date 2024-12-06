import React from "react";

interface ErrorAlertProps {
  children: React.ReactNode;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
    {children}
  </div>
);

export default ErrorAlert;
