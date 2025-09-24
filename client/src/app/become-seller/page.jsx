"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import axiosInstance from "@/src/lib/axiosInstance";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Select from "@/src/components/ui/select";

import { FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const Steps = [
  {
    id: 1,
    name: "Personal Details",
  },
  {
    id: 2,
    name: "Store Address",
  },
  {
    id: 3,
    name: "Documents",
  },
  {
    id: 4,
    name: "Tax Information",
  },
  {
    id: 5,
    name: "Bank Details",
  },
  {
    id: 6,
    name: "Create Password and Continue",
  },
];

export default function Page() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [vendorData, setVendorData] = useState({
    type: "Individual",
    name: "",
    phoneNumber: "",
    email: "",
    storeName: "",
    storeAddress: "",
    state: "",
    area: "",
    district: "",
    postcode: "",
    fullAddress: "",
    pickupAddress: "",
    nidFront: null,
    nidBack: null,
    nidNumber: "",
    companyRegistration: "",
    tin: "",
    tradeLicense: "",
    bankAccountType: "Current",
    bankAccountName: "",
    bankAccountNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);

  const handleVendorDataChange = (event) => {
    const { name, value } = event.target;
    setVendorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVendorFileChange = (event) => {
    const { name, files } = event.target;
    console.log(name, files[0]);
    setVendorData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (setLoading) => {
    const formData = new FormData();

    Object.entries(vendorData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);

      const { data } = await axiosInstance.post(
        "/api/vendor/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Vendor application created successfully...");
        setSuccess(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      return toast.error("Something went wrong. Please try again");
    }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto md:px-0 px-5">
        <div className="my-10 pb-5 border-b">
          <h2 className="text-5xl font-bold">Become a seller</h2>
          <p className="py-5 text-xl">
            Join Biluibaba as a seller and grow your business with ease!
          </p>
        </div>

        {success ? (
          <div className="text-center py-10">
            <div className="text-4xl pb-10 md:w-2/3 w-full mx-auto">
              Your vendor application on Biluibaba is complete! Please check
              your email and click the verification link to confirm your
              profile.
            </div>
            <Button
              type="default"
              onClick={() => router.push("/")}
              text="Return Home"
              className="mx-auto"
              icon={<FaArrowRight />}
            />
          </div>
        ) : (
          <div className="flex md:flex-row flex-col gap-5 justify-between">
            <div className="basis-1/3 md:border-r md:pb-20">
              {Steps.map((s, i) => (
                <div
                  className={
                    "flex flex-row items-center gap-5 mb-5  " +
                    (step >= s.id ? "text-black" : "text-zinc-400")
                  }
                  key={i}
                >
                  <div
                    className={
                      "h-10 w-10 rounded-full inline-flex items-center justify-center " +
                      (step >= s.id
                        ? "bg-black text-white border-black border-2"
                        : "border-zinc-400 border-1")
                    }
                  >
                    <div>{s.id}</div>
                  </div>
                  <div className={"text-xl " + (step >= s.id && "font-bold")}>
                    {s.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="basis-full">
              <div className="text-4xl font-bold">{Steps[step - 1].name}</div>

              {step === 1 && (
                <StepOne
                  data={vendorData}
                  handleDataChange={handleVendorDataChange}
                  setStep={setStep}
                />
              )}
              {step === 2 && (
                <StepTwo
                  data={vendorData}
                  handleDataChange={handleVendorDataChange}
                  setStep={setStep}
                />
              )}
              {step === 3 && (
                <StepThree
                  data={vendorData}
                  handleDataChange={handleVendorDataChange}
                  handleFileChange={handleVendorFileChange}
                  setStep={setStep}
                />
              )}
              {step === 4 && (
                <StepFour
                  data={vendorData}
                  handleDataChange={handleVendorDataChange}
                  setStep={setStep}
                />
              )}
              {step === 5 && (
                <StepFive
                  data={vendorData}
                  handleDataChange={handleVendorDataChange}
                  setStep={setStep}
                />
              )}
              {step === 6 && (
                <StepSix
                  data={vendorData}
                  handleDataChange={handleVendorDataChange}
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepOne({ data, handleDataChange, setStep }) {
  const [loading, setLoading] = useState(false);

  const checkVendorEmail = async () => {
    if (!data.name || data.name === "")
      return toast.error("Please provide your full name.");
    else if (!data.email || data.email === "" || !data.email.includes("@"))
      return toast.error("Please provide a valid email address.");
    else if (
      !data.phoneNumber ||
      data.phoneNumber === "" ||
      data.phoneNumber.length < 11
    )
      return toast.error("Please provide a valid phone number.");
    else if (!data.storeName || data.storeName === "")
      return toast.error("Please provide a valid store name.");

    try {
      setLoading(true);

      let { data: responseData } = await axiosInstance.post(
        "/api/app/check-email",
        {
          email: data.email,
        }
      );

      if (responseData.success) setStep(2);
    } catch (error) {
      setLoading(false);
      console.error(error);
      return toast.error(error.response.data.error);
    }
  };

  return (
    <div className="my-5 flex md:flex-row flex-col md:items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="type">Select vendor type</label>
        <Select
          value={data.type}
          data={[
            { text: "Individual", value: "Individual" },
            { text: "Company", value: "Company" },
          ]}
          onChange={handleDataChange}
          name="type"
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="name">
          {data.type === "Individual" ? "Your full name" : "Your company name"}
        </label>
        <Input
          type="text"
          name="name"
          value={data.name}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="phoneNumber">Your phone number</label>
        <Input
          type="text"
          name="phoneNumber"
          value={data.phoneNumber}
          pattern="[0-9]*"
          onChange={handleDataChange}
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="email">Your email address</label>
        <Input
          type="email"
          name="email"
          value={data.email}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full">
        <label htmlFor="storeName">Your store name</label>
        <Input
          text="text"
          name="storeName"
          value={data.storeName}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full inline-flex justify-end">
        <Button
          type="default"
          text="Next"
          icon={<FaArrowRight />}
          disabled={loading}
          onClick={checkVendorEmail}
        />
      </div>
    </div>
  );
}

function StepTwo({ data, handleDataChange, setStep }) {
  const checkStoreAddress = () => {
    if (!data.storeAddress || data.storeAddress === "")
      return toast.error("Please provide a valid store address");
    else if (!data.state || data.state === "")
      return toast.error("Please provide a valid state");
    else if (!data.area || data.area === "")
      return toast.error("Please provide store's area");
    else if (!data.district || data.district === "")
      return toast.error("Please provide store's district");
    else if (!data.postcode || data.postcode === "")
      return toast.error("Please provide store's post code");
    else if (!data.fullAddress || data.fullAddress === "")
      return toast.error("Please provide your store's full address");
    else if (!data.pickupAddress || data.pickupAddress === "")
      return toast.error("Please provide your pickup address");
    else setStep(3);
  };

  return (
    <div className="my-5 flex md:flex-row flex-col md:items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="storeAddress">Store address</label>
        <Input
          type="text"
          name="storeAddress"
          value={data.storeAddress}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="state">Store division</label>
        <Input
          type="text"
          name="state"
          value={data.state}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="area">Store area</label>
        <Input
          type="text"
          name="area"
          value={data.area}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="district">Store district</label>
        <Input
          type="text"
          name="district"
          value={data.district}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="postcode">Store postcode</label>
        <Input
          type="text"
          name="postcode"
          value={data.postcode}
          onChange={handleDataChange}
          pattern="[0-9]*"
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="fullAddress">Full store address</label>
        <Input
          type="text"
          name="fullAddress"
          value={data.fullAddress}
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full">
        <label htmlFor="pickupAddress">Full pickup address</label>
        <Input
          type="text"
          name="pickupAddress"
          value={data.pickupAddress}
          onChange={handleDataChange}
        />
      </div>

      <div className="basis-full inline-flex justify-end gap-5">
        <Button
          type="outline"
          text="Back"
          icon={<FaArrowLeft />}
          iconAlign="left"
          onClick={() => setStep(1)}
        />
        <Button
          type="default"
          text="Next"
          icon={<FaArrowRight />}
          onClick={checkStoreAddress}
        />
      </div>
    </div>
  );
}

function StepThree({ data, handleDataChange, handleFileChange, setStep }) {
  const checkDocuments = () => {
    if (!data.nidFront || data.nidFront === null)
      return toast.error("Please provide National ID Card (Front Side)");
    else if (!data.nidBack || data.nidBack === null)
      return toast.error("Please provide National ID Card (Back Side)");
    if (!data.nidNumber || data.nidNumber === "")
      return toast.error("Please provide National ID Card Number");
    else setStep(4);
  };

  return (
    <div className="my-5 flex md:flex-row flex-col md:items-center justify-between gap-y-2 flex-wrap">
      {data.nidFront !== null && (
        <img
          src={URL.createObjectURL(data.nidFront)}
          alt="NID Front"
          className="w-[300px]"
        />
      )}
      <div className="basis-full">
        <label htmlFor="nidFront">
          National ID Card (Front Side) .jpg/.jpeg/.png
        </label>
        <Input
          accept="image/jpg, image/jpeg, image/png"
          type="file"
          name="nidFront"
          onChange={handleFileChange}
        />
      </div>
      {data.nidBack !== null && (
        <img
          src={URL.createObjectURL(data.nidBack)}
          alt="NID Back"
          className="w-[300px]"
        />
      )}
      <div className="basis-full">
        <label htmlFor="nidBack">
          National ID Card (Back Side) .jpg/.jpeg/.png
        </label>
        <Input
          accept="image/jpg, image/jpeg, image/png"
          type="file"
          name="nidBack"
          onChange={handleFileChange}
        />
      </div>
      <div className="basis-full">
        <label htmlFor="nidNumber">National ID Card Number</label>
        <Input
          type="text"
          name="nidNumber"
          value={data.nidNumber}
          onChange={handleDataChange}
        />
      </div>

      <div className="basis-full inline-flex justify-end gap-5">
        <Button
          type="outline"
          text="Back"
          icon={<FaArrowLeft />}
          iconAlign="left"
          onClick={() => setStep(2)}
        />
        <Button
          type="default"
          text="Next"
          icon={<FaArrowRight />}
          onClick={checkDocuments}
        />
      </div>
    </div>
  );
}

function StepFour({ data, handleDataChange, setStep }) {
  const checkTaxInformation = () => {
    if (
      (data.type === "Company" && !data.companyRegistration) ||
      data.companyRegistration === ""
    ) {
      return toast.error("Please provide company registration number");
    } else if (!data.tin || data.tin === "")
      return toast.error("Please provide Tax Identification Number (TIN)");
    else if (!data.tradeLicense || data.tradeLicense === "")
      return toast.error("Please provide Trade License Number");
    else setStep(5);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      {data.type === "Company" && (
        <div className="basis-full">
          <label htmlFor="companyRegistration">
            Company Registration Number
          </label>
          <Input
            type="text"
            value={data.companyRegistration}
            name="companyRegistration"
            onChange={handleDataChange}
          />
        </div>
      )}
      <div className="basis-full">
        <label htmlFor="tin">Tax Identification Number (TIN)</label>
        <Input
          type="text"
          value={data.tin}
          name="tin"
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full">
        <label htmlFor="tradeLicense">Trade License Number</label>
        <Input
          type="text"
          value={data.tradeLicense}
          name="tradeLicense"
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full inline-flex justify-end gap-5">
        <Button
          type="outline"
          text="Back"
          icon={<FaArrowLeft />}
          iconAlign="left"
          onClick={() => setStep(3)}
        />
        <Button
          type="default"
          text="Next"
          icon={<FaArrowRight />}
          onClick={checkTaxInformation}
        />
      </div>
    </div>
  );
}

function StepFive({ data, handleDataChange, setStep }) {
  const checkBankDetails = () => {
    if (!data.bankAccountType || data.bankAccountType === "")
      return toast.error("Please provide bank account type");
    else if (!data.bankAccountName || data.bankAccountName === "")
      return toast.error("Please provide bank account name");
    else if (!data.bankAccountNumber || data.bankAccountNumber === "")
      return toast.error("Please provide bank account type");
    else setStep(6);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-full">
        <label htmlFor="bankAccountType">Bank Account Type</label>
        <Select
          data={[
            { value: "Current", text: "Current" },
            { value: "Saving", text: "Saving" },
          ]}
          value={data.bankAccountType}
          name="bankAccountType"
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full">
        <label htmlFor="bankAccountType">Bank Account Name</label>
        <Input
          type="text"
          value={data.bankAccountName}
          name="bankAccountName"
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full">
        <label htmlFor="bankAccountNumber">Bank Account Number</label>
        <Input
          type="text"
          value={data.bankAccountNumber}
          name="bankAccountNumber"
          onChange={handleDataChange}
        />
      </div>
      <div className="basis-full inline-flex justify-end gap-5">
        <Button
          type="outline"
          text="Back"
          icon={<FaArrowLeft />}
          iconAlign="left"
          onClick={() => setStep(4)}
        />
        <Button
          type="default"
          text="Next"
          icon={<FaArrowRight />}
          onClick={checkBankDetails}
        />
      </div>
    </div>
  );
}

function StepSix({ data, handleDataChange, handleSubmit, setStep }) {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);

  const checkPasswordAndSubmit = () => {
    if (!data.password || data.password === "")
      return toast.error("Please provide a valid password");
    else if (data.password.length < 8)
      return toast.error("Password must be 8 characters long...");
    else if (!data.confirmPassword || data.confirmPassword === "")
      return toast.error("Please confirm your password");
    else handleSubmit(setLoading);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-full">
        <label htmlFor="bankAccountType">Password</label>
        <div className="relative block">
          {passwordType === "password" ? (
            <FaEyeSlash
              size="1.5em"
              className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={() => setPasswordType("text")}
            />
          ) : (
            <FaEye
              size="1.5em"
              className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={() => setPasswordType("password")}
            />
          )}
          <Input
            type={passwordType}
            value={data.password}
            name="password"
            onChange={handleDataChange}
          />
        </div>
      </div>
      <div className="basis-full">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="relative block">
          {confirmPasswordType === "password" ? (
            <FaEyeSlash
              size="1.5em"
              className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={() => setConfirmPasswordType("text")}
            />
          ) : (
            <FaEye
              size="1.5em"
              className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={() => setConfirmPasswordType("password")}
            />
          )}
          <Input
            type={confirmPasswordType}
            value={data.confirmPassword}
            name="confirmPassword"
            onChange={handleDataChange}
          />
        </div>
      </div>
      <div className="basis-full">
        <p className="bg-gray-100 font-bold text-zinc-600 p-5 text-lg rounded-xl mb-5 ">
          By using Biluibaba for order fulfillment, you agree to receive and
          utilize packaging provided by us for delivering goods sold on our
          platform. This ensures a consistent and reliable experience for both
          vendors and customers.
        </p>
      </div>
      <div className="basis-full inline-flex justify-end gap-5">
        <Button
          type="outline"
          text="Back"
          icon={<FaArrowLeft />}
          iconAlign="left"
          onClick={() => setStep(5)}
        />
        <Button
          type="default"
          text="Submit"
          disabled={loading}
          icon={<FaArrowRight />}
          onClick={checkPasswordAndSubmit}
        />
      </div>
    </div>
  );
}
