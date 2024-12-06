import React from "react";

interface StyledMenuProps {
  className?: string;
  children: React.ReactNode;
}

const StyledMenu: React.FC<StyledMenuProps> = ({ className, children }) => (
  <div className={`${className} bg-gray-100 rounded-lg p-4 mb-4 w-[650px] flex justify-evenly items-center shadow-md`}>
    {children}
  </div>
);

export default StyledMenu;
