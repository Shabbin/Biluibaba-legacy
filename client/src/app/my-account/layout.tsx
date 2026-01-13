import React, { ReactNode } from "react";
import Sidebar from "./sidebar";

interface AccountLayoutProps {
  children: ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row">
      <div className="basis-1/5">
        <Sidebar />
      </div>
      <div className="basis-4/5 p-5">{children}</div>
    </div>
  );
};

export default AccountLayout;
