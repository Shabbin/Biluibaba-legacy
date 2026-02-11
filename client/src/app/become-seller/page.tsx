"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import axiosInstance from "@/src/lib/axiosInstance";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Select from "@/src/components/ui/select";

import { 
  FaArrowRight, 
  FaArrowLeft, 
  FaEye, 
  FaEyeSlash, 
  FaStore, 
  FaCheck,
  FaFileArrowUp
} from "react-icons/fa6";

const Steps = [
  { id: 1, name: "Personal Details" },
  { id: 2, name: "Store Address" },
  { id: 3, name: "Documents" },
  { id: 4, name: "Tax Info" },
  { id: 5, name: "Bank Details" },
  { id: 6, name: "Security" },
];

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleVendorDataChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVendorFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setVendorData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(vendorData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/api/vendor/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Vendor application created successfully!");
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-5 max-w-6xl">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-petzy-coral/10 text-petzy-coral rounded-2xl mb-4 text-3xl">
             <FaStore />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-petzy-slate mb-4">
            Become a Seller
          </h1>
          <p className="text-lg text-petzy-slate-light max-w-2xl mx-auto">
            Join Biluibaba and start selling your pet products to thousands of customers today.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 md:p-20 text-center max-w-3xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
              <FaCheck />
            </div>
            <h2 className="text-3xl font-bold text-petzy-slate mb-4">Application Submitted!</h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Your vendor application on Biluibaba is complete! Please check your email inbox (and spam folder) for a verification link to confirm your profile and activate your store.
            </p>
            <Button
              type="default"
              onClick={() => router.push("/")}
              text="Return to Home"
              className="px-10 py-4 text-lg shadow-lg shadow-petzy-coral/20"
              icon={<FaArrowRight />}
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* --- Sidebar Stepper --- */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-3xl p-6 shadow-soft sticky top-24">
                <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-6 ml-2">Progress</h3>
                <div className="space-y-0 relative">
                  {/* Connector Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>
                  
                  {Steps.map((s, i) => {
                     const isActive = step === s.id;
                     const isCompleted = step > s.id;
                     
                     return (
                      <div key={i} className={`flex items-center gap-4 py-3 relative bg-white transition-all duration-300 ${isActive ? 'translate-x-2' : ''}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10 
                            ${isActive ? 'bg-petzy-coral border-petzy-coral text-white scale-110 shadow-lg shadow-petzy-coral/30' : 
                              isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                              'bg-white border-gray-200 text-gray-400'}`}>
                            {isCompleted ? <FaCheck /> : s.id}
                         </div>
                         <span className={`text-sm font-bold transition-colors ${isActive ? 'text-petzy-slate' : isCompleted ? 'text-petzy-slate-light' : 'text-gray-400'}`}>
                            {s.name}
                         </span>
                      </div>
                     )
                  })}
                </div>
              </div>
            </div>

            {/* --- Main Form Area --- */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                {/* Step Title */}
                <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-petzy-slate">{Steps[step - 1].name}</h2>
                   <span className="text-sm font-bold text-gray-400">Step {step} of 6</span>
                </div>

                {/* Step Content */}
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  {step === 1 && <StepOne data={vendorData} handleDataChange={handleVendorDataChange} setStep={setStep} />}
                  {step === 2 && <StepTwo data={vendorData} handleDataChange={handleVendorDataChange} setStep={setStep} />}
                  {step === 3 && <StepThree data={vendorData} handleDataChange={handleVendorDataChange} handleFileChange={handleVendorFileChange} setStep={setStep} />}
                  {step === 4 && <StepFour data={vendorData} handleDataChange={handleVendorDataChange} setStep={setStep} />}
                  {step === 5 && <StepFive data={vendorData} handleDataChange={handleVendorDataChange} setStep={setStep} />}
                  {step === 6 && <StepSix data={vendorData} handleDataChange={handleVendorDataChange} setStep={setStep} handleSubmit={handleSubmit} loading={loading} />}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-petzy-slate mb-2 ml-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const StepActions = ({ onBack, onNext, nextLabel = "Next", loading = false }) => (
  <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
    {onBack && (
      <Button
        type="outline"
        text="Back"
        icon={<FaArrowLeft />}
        iconAlign="left"
        className="px-6"
        onClick={onBack}
        disabled={loading}
      />
    )}
    <Button
      type="default"
      text={loading ? "Processing..." : nextLabel}
      icon={!loading && <FaArrowRight />}
      className="px-8 shadow-lg shadow-petzy-coral/20"
      onClick={onNext}
      disabled={loading}
    />
  </div>
);


function StepOne({ data, handleDataChange, setStep }) {
  const [loading, setLoading] = useState(false);

  const checkVendorEmail = async () => {
    // Validation
    if (!data.name) return toast.error("Full name is required");
    if (!data.email || !data.email.includes("@")) return toast.error("Valid email is required");
    if (!data.phoneNumber || data.phoneNumber.length < 11) return toast.error("Valid phone number required");
    if (!data.storeName) return toast.error("Store name is required");

    try {
      setLoading(true);
      const { data: res } = await axiosInstance.post("/api/app/check-email", { email: data.email });
      if (res.success) setStep(2);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Email check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Label required>Vendor Type</Label>
        <Select
          value={data.type}
          data={[{ text: "Individual", value: "Individual" }, { text: "Company", value: "Company" }]}
          onChange={handleDataChange}
          name="type"
          className="bg-gray-50 border-gray-200"
        />
      </div>
      <div>
        <Label required>{data.type === "Individual" ? "Full Name" : "Company Name"}</Label>
        <Input name="name" value={data.name} onChange={handleDataChange} placeholder="e.g. John Doe" />
      </div>
      <div>
        <Label required>Phone Number</Label>
        <Input 
           name="phoneNumber" 
           value={data.phoneNumber} 
           onChange={handleDataChange} 
           placeholder="e.g. 017xxxxxxxx"
           onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} 
        />
      </div>
      <div>
        <Label required>Email Address</Label>
        <Input type="email" name="email" value={data.email} onChange={handleDataChange} placeholder="e.g. john@example.com" />
      </div>
      <div>
        <Label required>Store Name</Label>
        <Input name="storeName" value={data.storeName} onChange={handleDataChange} placeholder="e.g. Pet Paradise" />
      </div>
      
      <div className="md:col-span-2">
        <StepActions onNext={checkVendorEmail} loading={loading} />
      </div>
    </div>
  );
}

function StepTwo({ data, handleDataChange, setStep }) {
  const validate = () => {
    if (!data.storeAddress) return toast.error("Store address required");
    if (!data.state) return toast.error("Division required");
    if (!data.area) return toast.error("Area required");
    if (!data.district) return toast.error("District required");
    if (!data.postcode) return toast.error("Postcode required");
    setStep(3);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Label required>Store Address (Line 1)</Label>
        <Input name="storeAddress" value={data.storeAddress} onChange={handleDataChange} placeholder="House, Road, Block" />
      </div>
      <div>
        <Label required>Division / State</Label>
        <Input name="state" value={data.state} onChange={handleDataChange} placeholder="e.g. Dhaka" />
      </div>
      <div>
        <Label required>District</Label>
        <Input name="district" value={data.district} onChange={handleDataChange} placeholder="e.g. Dhaka" />
      </div>
      <div>
        <Label required>Area / Thana</Label>
        <Input name="area" value={data.area} onChange={handleDataChange} placeholder="e.g. Gulshan" />
      </div>
      <div>
        <Label required>Postcode</Label>
        <Input name="postcode" value={data.postcode} onChange={handleDataChange} placeholder="e.g. 1212" onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} />
      </div>
      <div className="md:col-span-2">
        <Label required>Full Pickup Address</Label>
        <Input name="pickupAddress" value={data.pickupAddress} onChange={handleDataChange} placeholder="Exact address for courier pickup" />
      </div>
      
      <div className="md:col-span-2">
         <StepActions onBack={() => setStep(1)} onNext={validate} />
      </div>
    </div>
  );
}

function StepThree({ data, handleFileChange, handleDataChange, setStep }) {
  const validate = () => {
    if (!data.nidFront) return toast.error("NID Front image required");
    if (!data.nidBack) return toast.error("NID Back image required");
    if (!data.nidNumber) return toast.error("NID Number required");
    setStep(4);
  };

  const FilePreview = ({ file, label, name }) => (
    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-petzy-coral transition-colors bg-gray-50">
       {file ? (
         <div className="relative h-40 w-full mb-4">
            <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-contain rounded-lg" />
         </div>
       ) : (
         <div className="h-40 flex items-center justify-center text-gray-300 mb-4">
            <FaFileArrowUp className="text-4xl" />
         </div>
       )}
       <label className="cursor-pointer">
          <span className="bg-white border border-gray-200 text-petzy-slate font-bold py-2 px-4 rounded-full text-sm hover:bg-petzy-slate hover:text-white transition-colors">
            {file ? "Change File" : `Upload ${label}`}
          </span>
          <input type="file" name={name} accept="image/*" onChange={handleFileChange} className="hidden" />
       </label>
       <p className="text-xs text-gray-400 mt-2">Max 5MB (JPG, PNG)</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
            <Label required>NID Front Side</Label>
            <FilePreview file={data.nidFront} name="nidFront" label="Front" />
         </div>
         <div>
            <Label required>NID Back Side</Label>
            <FilePreview file={data.nidBack} name="nidBack" label="Back" />
         </div>
      </div>
      
      <div>
         <Label required>National ID Number</Label>
         <Input name="nidNumber" value={data.nidNumber} onChange={handleDataChange} placeholder="Enter your NID number" />
      </div>

      <StepActions onBack={() => setStep(2)} onNext={validate} />
    </div>
  );
}

function StepFour({ data, handleDataChange, setStep }) {
  const validate = () => {
    if (data.type === "Company" && !data.companyRegistration) return toast.error("Company Reg. No required");
    if (!data.tin) return toast.error("TIN required");
    if (!data.tradeLicense) return toast.error("Trade License required");
    setStep(5);
  };

  return (
    <div className="space-y-6">
      {data.type === "Company" && (
        <div>
          <Label required>Company Registration Number</Label>
          <Input name="companyRegistration" value={data.companyRegistration} onChange={handleDataChange} />
        </div>
      )}
      <div>
        <Label required>Tax Identification Number (TIN)</Label>
        <Input name="tin" value={data.tin} onChange={handleDataChange} />
      </div>
      <div>
        <Label required>Trade License Number</Label>
        <Input name="tradeLicense" value={data.tradeLicense} onChange={handleDataChange} />
      </div>

      <StepActions onBack={() => setStep(3)} onNext={validate} />
    </div>
  );
}

function StepFive({ data, handleDataChange, setStep }) {
  const validate = () => {
    if (!data.bankAccountName || !data.bankAccountNumber) return toast.error("Bank details incomplete");
    setStep(6);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label required>Bank Account Type</Label>
        <Select
          value={data.bankAccountType}
          data={[{ value: "Current", text: "Current" }, { value: "Saving", text: "Saving" }]}
          name="bankAccountType"
          onChange={handleDataChange}
        />
      </div>
      <div>
        <Label required>Account Holder Name</Label>
        <Input name="bankAccountName" value={data.bankAccountName} onChange={handleDataChange} placeholder="e.g. John Doe" />
      </div>
      <div>
        <Label required>Account Number</Label>
        <Input name="bankAccountNumber" value={data.bankAccountNumber} onChange={handleDataChange} placeholder="e.g. 1234567890" />
      </div>

      <StepActions onBack={() => setStep(4)} onNext={validate} />
    </div>
  );
}

function StepSix({ data, handleDataChange, handleSubmit, setStep, loading }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    if (!data.password || data.password.length < 8) return toast.error("Password must be at least 8 chars");
    if (data.password !== data.confirmPassword) return toast.error("Passwords do not match");
    handleSubmit();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label required>Password</Label>
        <div className="relative">
          <Input
             type={showPass ? "text" : "password"} 
             name="password" 
             value={data.password} 
             onChange={handleDataChange} 
             className="pr-10"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
             {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      
      <div>
        <Label required>Confirm Password</Label>
        <div className="relative">
          <Input 
             type={showConfirm ? "text" : "password"} 
             name="confirmPassword" 
             value={data.confirmPassword} 
             onChange={handleDataChange} 
             className="pr-10"
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
             {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="bg-petzy-blue-light/20 p-6 rounded-2xl border border-petzy-blue-light/30">
        <h4 className="font-bold text-petzy-slate mb-2 text-sm">Agreement</h4>
        <p className="text-sm text-petzy-slate-light leading-relaxed">
          By using Biluibaba for order fulfillment, you agree to receive and utilize packaging provided by us for delivering goods sold on our platform. This ensures a consistent and reliable experience for both vendors and customers.
        </p>
      </div>

      <StepActions 
         onBack={() => setStep(5)} 
         onNext={validate} 
         nextLabel="Submit Application" 
         loading={loading} 
      />
    </div>
  );
}