import Sidebar from "./sidebar";

export default function AccountLayoout({ children }) {
  return (
    <div className="flex flex-row pt-20">
      <div className="basis-1/5">
        <Sidebar></Sidebar>
      </div>
      <div className="basis-4/5 p-5">{children}</div>
    </div>
  );
}
