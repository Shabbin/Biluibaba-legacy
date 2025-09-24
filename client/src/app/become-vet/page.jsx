"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import axiosInstance from "@/src/lib/axiosInstance";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Select from "@/src/components/ui/select";

import MultiSelect from "react-select";

import { FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

import LocationData from "./location.data";

const Steps = [
  {
    id: 1,
    name: "Personal Details",
  },
  {
    id: 2,
    name: "Documents",
  },
  {
    id: 3,
    name: "Address",
  },
  {
    id: 4,
    name: "Tax Information",
  },
  {
    id: 5,
    name: "Specialized Zone",
  },
  {
    id: 6,
    name: "Bank Details",
  },
  {
    id: 7,
    name: "Create Password and Continue",
  },
];

const Pets = [
  { value: "Dog", text: "Dog" },
  { value: "Cat", text: "Cat" },
  { value: "Bird", text: "Bird" },
  { value: "Fish", text: "Fish" },
  { value: "Rabbit", text: "Rabbit" },
  { value: "Guinea Pig", text: "Guinea Pig" },
];

const concerns = [
  { value: "Flea and tick", label: "Flea and tick" },
  { value: "Skin/ear infections", label: "Skin/ear infections" },
  { value: "Urinary problems", label: "Urinary problems" },
  { value: "Eye issues", label: "Eye issues" },
  { value: "Diarrhea and vomiting", label: "Diarrhea and vomiting" },
  { value: "Mobility concerns", label: "Mobility concerns" },
  { value: "Trauma/injury triage", label: "Trauma/injury triage" },
  { value: "Preventative wellness", label: "Preventative wellness" },
  { value: "Nutrition", label: "Nutrition" },
  { value: "Training & obedience", label: "Training & obedience" },
  { value: "Toxin ingestion", label: "Toxin ingestion" },
  { value: "Grooming advice", label: "Grooming advice" },
  { value: "Weight loss", label: "Weight loss" },
  { value: "New parent", label: "New parent" },
];

export default function Page() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  let [vetData, setVetData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "Male",
    hospital: "",
    state: "",
    district: "Dhaka",
    postcode: "",
    fullAddress: "",
    nidFront: null,
    nidBack: null,
    nidNumber: "",
    certificate: null,
    degree: "",
    license: "",
    hospital: "",
    tin: "",
    specializedZone: [
      {
        pet: "Dog",
        concerns: [],
      },
    ],
    bankAccountType: "Current",
    bankAccountName: "",
    bankAccountNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);

  const handleVetDataChange = (event) => {
    const { name, value } = event.target;
    setVetData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSpecializedZoneChange = (index, event) => {
    const { name, value } = event.target;
    const specializedZone = [...vetData.specializedZone];

    specializedZone[index][name] = value;

    setVetData({ ...vetData, specializedZone });
  };

  const handleSpecializedZoneAddFields = () => {
    if (vetData.specializedZone.length === 4) return;
    setVetData((prevState) => ({
      ...prevState,
      specializedZone: [
        ...prevState.specializedZone,
        { pet: "Dog", concerns: [] },
      ],
    }));
  };

  const handleSpecializedZoneRemoveFields = (index) => {
    if (vetData.specializedZone.length === 1) return;
    const specializedZone = [...vetData.specializedZone];
    specializedZone.splice(index, 1);
    setVetData({ ...vetData, specializedZone });
  };

  const handleVetFileChange = (event) => {
    const { name, files } = event.target;
    setVetData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (setLoading) => {
    const formData = new FormData();

    Object.entries(vetData).forEach(([key, value]) => {
      if (key === "specializedZone") {
        formData.append(key, JSON.stringify(value));
      } else if (value) formData.append(key, value);
    });

    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/api/vet/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Vet application created successfully...");
        setSuccess(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      return toast.error("Something went wrong. Please try again");
    }
    setLoading(true);
  };

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <div className="my-10 pb-5 border-b">
          <h2 className="text-5xl font-bold">Become a Vet</h2>
          <p className="py-5 text-xl">
            Join Biluibaba as a vet and grow your network with ease!
          </p>
        </div>

        {success ? (
          <div className="text-center py-10">
            <div className="text-4xl pb-10 md:w-2/3 w-full mx-auto">
              Your vet application on Biluibaba is complete! Please check your
              email and click the verification link to confirm your profile.
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
          <div className="flex flex-row gap-5 justify-between">
            <div className="basis-1/3 border-r pb-20">
              {Steps.map((s, i) => (
                <div
                  className={
                    "flex flex-row items-center gap-5 mb-5 " +
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
                  data={vetData}
                  handleDataChange={handleVetDataChange}
                  setStep={setStep}
                />
              )}

              {step === 2 && (
                <StepTwo
                  data={vetData}
                  handleFileChange={handleVetFileChange}
                  handleDataChange={handleVetDataChange}
                  setStep={setStep}
                />
              )}

              {step === 3 && (
                <StepThree
                  data={vetData}
                  handleDataChange={handleVetDataChange}
                  setStep={setStep}
                />
              )}

              {step === 4 && (
                <StepFour
                  data={vetData}
                  handleDataChange={handleVetDataChange}
                  setStep={setStep}
                />
              )}

              {step === 5 && (
                <StepFive
                  data={vetData}
                  handleSpecializedZoneChange={handleSpecializedZoneChange}
                  handleSpecializedZoneAddFields={
                    handleSpecializedZoneAddFields
                  }
                  handleSpecializedZoneRemoveFields={
                    handleSpecializedZoneRemoveFields
                  }
                  setStep={setStep}
                />
              )}

              {step === 6 && (
                <StepSix
                  data={vetData}
                  handleSubmit={handleSubmit}
                  handleDataChange={handleVetDataChange}
                  setStep={setStep}
                />
              )}

              {step === 7 && (
                <StepSeven
                  data={vetData}
                  handleSubmit={handleSubmit}
                  handleDataChange={handleVetDataChange}
                  setStep={setStep}
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

  const checkVetEmail = async () => {
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
    else if (!data.gender || data.gender === "")
      return toast.error("Please provide a valid gender.");

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
      console.log(error);
      return toast.error(error.response.data.error);
    }
  };

  return (
    <div className="my-5 flex md:flex-row flex-col md:items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="name">Your full name</label>
        <Input
          type="text"
          name="name"
          value={data.name}
          onChange={handleDataChange}
          placeholder="e.g, Sohail, Nusrat"
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
          placeholder="e.g, 01XXXXXXXXX"
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
          placeholder="e.g, john.doe@gmail.com"
        />
      </div>
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="type">Select Gender</label>
        <Select
          value={data.gender}
          data={[
            { text: "Male", value: "Male" },
            { text: "Female", value: "Female" },
          ]}
          onChange={handleDataChange}
          name="type"
        />
      </div>
      <div className="basis-full inline-flex justify-end">
        <Button
          type="default"
          text="Next"
          icon={<FaArrowRight />}
          disabled={loading}
          onClick={checkVetEmail}
        />
      </div>
    </div>
  );
}

function StepTwo({ data, handleDataChange, handleFileChange, setStep }) {
  const checkDocuments = () => {
    if (!data.nidFront || data.nidFront === null)
      return toast.error("Please provide National ID Card (Front Side)");
    else if (!data.nidBack || data.nidBack === null)
      return toast.error("Please provide National ID Card (Back Side)");
    else if (!data.nidNumber || data.nidNumber === "")
      return toast.error("Please provide National ID Card Number");
    else if (!data.certificate || data.certificate === null)
      return toast.error("Please provide an image of your certificate.");
    else if (!data.degree || data.degree === "")
      return toast.error("Please provide your degree name.");
    else if (!data.license || data.license === "")
      return toast.error("Please provide your license number.");
    else setStep(3);
  };

  return (
    <div className="my-5 flex md:flex-row flex-col md:items-center justify-between gap-y-2 flex-wrap">
      {data.nidFront !== null && (
        <img
          src={URL.createObjectURL(data.nidFront)}
          alt="NID Front"
          className="basis-full w-1/2"
        />
      )}
      <div className="basis-full">
        <label htmlFor="nidFront">National ID Card (Front Side)</label>
        <Input
          accept="image/*"
          type="file"
          name="nidFront"
          onChange={handleFileChange}
          placeholder="e.g, Sohail, Nusrat"
        />
      </div>
      {data.nidBack !== null && (
        <img
          src={URL.createObjectURL(data.nidBack)}
          alt="NID Back"
          className="basis-full w-1/2"
        />
      )}
      <div className="basis-full">
        <label htmlFor="nidBack">National ID Card (Back Side)</label>
        <Input
          accept="image/*"
          type="file"
          name="nidBack"
          onChange={handleFileChange}
          placeholder="e.g, Sohail, Nusrat"
        />
      </div>
      <div className="basis-full">
        <label htmlFor="nidNumber">National ID Card Number</label>
        <Input
          type="text"
          name="nidNumber"
          value={data.nidNumber}
          onChange={handleDataChange}
          placeholder="e.g, 99999999"
        />
      </div>

      {data.certificate !== null && (
        <img
          src={URL.createObjectURL(data.certificate)}
          alt="Certificate"
          className="basis-full w-1/2"
        />
      )}

      <div className="basis-full">
        <label htmlFor="nidNumber">Certificate Image</label>
        <Input
          accept="image/*"
          type="file"
          name="certificate"
          onChange={handleFileChange}
        />
      </div>

      <div className="basis-full">
        <label htmlFor="nidNumber">Degree Name</label>
        <Input
          type="text"
          name="degree"
          value={data.degree}
          onChange={handleDataChange}
          placeholder="e.g, XXXXXXXXXXXX"
        />
      </div>

      <div className="basis-full">
        <label htmlFor="nidNumber">License Number</label>
        <Input
          type="text"
          name="license"
          value={data.license}
          onChange={handleDataChange}
          placeholder="e.g, XXXXXXXXXXXX"
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
          onClick={checkDocuments}
        />
      </div>
    </div>
  );
}

function StepThree({ data, handleDataChange, setStep }) {
  const checkAddress = () => {
    if (!data.fullAddress || data.fullAddress === "")
      return toast.error("Please provide your store address.");
    else if (!data.state || data.state === "")
      return toast.error("Please provide your store division.");
    else if (!data.district || data.district === "")
      return toast.error("Please provide your store district.");
    else if (!data.postcode || data.postcode === "")
      return toast.error("Please provide your store postcode.");
    else setStep(4);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-1/2 -m-2 p-2">
        <label htmlFor="storeAddress">Store address</label>
        <Input
          type="text"
          name="fullAddress"
          value={data.fullAddress}
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
        <label htmlFor="district">Store district</label>
        <Select
          data={LocationData.map((location) => ({
            value: location,
            text: location,
          }))}
          value={data.district}
          onChange={handleDataChange}
          name="district"
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
          onClick={checkAddress}
        />
      </div>
    </div>
  );
}

function StepFour({ data, handleDataChange, setStep }) {
  const checkTaxInformation = () => {
    setStep(5);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-full">
        <label htmlFor="tin">Tax Identification Number (Optional)</label>
        <Input
          type="text"
          value={data.tin}
          name="tin"
          onChange={handleDataChange}
          placeholder="e.g, XXXXXXXXXXX"
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

function StepFive({
  data,
  handleSpecializedZoneChange,
  handleSpecializedZoneAddFields,
  handleSpecializedZoneRemoveFields,
  setStep,
}) {
  const checkSpecializedZone = () => {
    if (data.specializedZone.length === 0)
      return toast.error("Please add at least one specialized zone");
    setStep(6);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      {data.specializedZone.map((zone, index) => (
        <div key={index} className="basis-full">
          <div className="flex justify-between items-center">
            <h5 className="my-3 text-2xl font-bold">
              Specialized Zone {index + 1}
            </h5>
            <Button
              type="default"
              text="Remove"
              className={
                "!px-6 !py-2 " +
                (data.specializedZone.length === 1
                  ? "opacity-75 cursor-not-allowed"
                  : "")
              }
              onClick={() => handleSpecializedZoneRemoveFields(index)}
            />
          </div>
          <div className="basis-full">
            <label htmlFor="type">Pet</label>
            <Select
              data={Pets}
              value={zone.pet}
              onChange={(event) => handleSpecializedZoneChange(index, event)}
              name="pet"
            />
          </div>
          <div className="basis-full">
            <label htmlFor="concerns">Concerns</label>
            <MultiSelect
              options={concerns}
              value={zone.concerns}
              className="w-full px-4 my-3 py-3 rounded-lg text-black border-zinc-900 border focus:border-black focus:ring-1 focus:outline-none focus:ring-zinc-400 shadow-none"
              isMulti
              onChange={(value) =>
                handleSpecializedZoneChange(index, {
                  target: { value, name: "concerns" },
                })
              }
            />
          </div>
        </div>
      ))}
      <div className="flex flex-row justify-end basis-full my-3">
        <Button
          type="default"
          text="Add"
          className={
            "!py-2 " +
            (data.specializedZone.length === 4
              ? "opacity-75 cursor-not-allowed"
              : "")
          }
          onClick={() => handleSpecializedZoneAddFields()}
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
          onClick={checkSpecializedZone}
        />
      </div>
    </div>
  );
}

function StepSix({ data, handleDataChange, setStep }) {
  const checkBankDetails = () => {
    if (!data.bankAccountType || data.bankAccountType === "")
      return toast.error("Please provide bank account type");
    else if (!data.bankAccountName || data.bankAccountName === "")
      return toast.error("Please provide bank account name");
    else if (!data.bankAccountNumber || data.bankAccountNumber === "")
      return toast.error("Please provide bank account type");
    else setStep(7);
  };

  return (
    <div className="my-5 flex flex-row items-center justify-between gap-y-2 flex-wrap">
      <div className="basis-full">
        <label htmlFor="bankAccountType">Bank Account Type</label>
        <Select
          value={data.bankAccountType}
          data={[
            { text: "Current", value: "Current" },
            { text: "Savings", value: "Savings" },
          ]}
        />
      </div>

      <div className="basis-full">
        <label htmlFor="bankAccountName">Bank Account Name</label>
        <Input
          type="text"
          name="bankAccountName"
          value={data.bankAccountName}
          onChange={handleDataChange}
        />
      </div>

      <div className="basis-full">
        <label htmlFor="bankAccountNumber">Bank Account Number</label>
        <Input
          type="text"
          name="bankAccountNumber"
          value={data.bankAccountNumber}
          onChange={handleDataChange}
        />
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
          text="Next"
          icon={<FaArrowRight />}
          onClick={checkBankDetails}
        />
      </div>
    </div>
  );
}

function StepSeven({ data, handleDataChange, setStep, handleSubmit }) {
  const [passwordType, setPasswordType] = useState("password");
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
    <div className="my-5 flex flex-row items-center justify-center gap-y-2 flex-wrap">
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
            value={data.confirmPassword}
            name="confirmPassword"
            onChange={handleDataChange}
          />
        </div>
      </div>
      <div className="basis-full">
        <p className="bg-gray-100 font-bold text-zinc-600 p-5 text-lg rounded-xl mb-5 ">
          By providing veterinary services through Biluibaba, you confirm that
          you are a licensed practitioner and accept full responsibility for the
          care and advice you deliver. Biluibaba serves only as a connecting
          platform and is not liable for treatment outcomes.
        </p>
      </div>
      <div className="basis-full inline-flex justify-end gap-5">
        <Button
          type="outline"
          text="Back"
          icon={<FaArrowLeft />}
          iconAlign="left"
          onClick={() => setStep(6)}
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
