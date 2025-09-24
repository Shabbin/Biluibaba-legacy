import { FaCheckCircle } from "react-icons/fa";

const Page = () => {
  return (
    <div className="py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <FaCheckCircle size="8em" className="mx-auto" />
          <div className="text-6xl font-bold my-5">Congratulations!</div>
          <div className="font-bold text-4xl my-5">
            Your booking has been confirmed
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
