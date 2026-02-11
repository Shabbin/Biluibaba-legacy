"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils"; // Standard shadcn utility

import axiosInstance from "@/src/lib/axiosInstance";

// --- Shadcn Components ---
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

// --- Icons ---
import {
  FaArrowRight,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaStore,
  FaCheck,
  FaCloudArrowUp,
  FaCircleCheck,
  FaCircleUser,
  FaLocationDot,
  FaFileContract,
  FaBuildingColumns,
  FaLock
} from "react-icons/fa6";

const Steps = [
  { id: 1, name: "Personal Details", icon: <FaCircleUser /> },
  { id: 2, name: "Store Address", icon: <FaLocationDot /> },
  { id: 3, name: "Documents", icon: <FaFileContract /> },
  { id: 4, name: "Tax Info", icon: <FaBuildingColumns /> },
  { id: 5, name: "Bank Details", icon: <FaBuildingColumns /> },
  { id: 6, name: "Security", icon: <FaLock /> },
];

export default function VendorRegistrationPage() {
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

  // Handle Standard Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Shadcn Select
  const handleSelectChange = (name, value) => {
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Inputs
  const handleFileChange = (e) => {
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
      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 md:py-20 font-sans">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* --- Header --- */}
        <div className="text-center mb-12 space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl">
            <FaStore />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Become a Seller
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Start your journey with Biluibaba. Setup your store in minutes.
          </p>
        </div>

        {success ? (
          <Card className="max-w-xl mx-auto text-center p-10 border-green-100 shadow-lg">
            <CardContent className="space-y-6 pt-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                <FaCheck />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Application Received!</h2>
                <p className="text-slate-500">
                  We have received your details. Please check your email inbox to verify your account and activate your store dashboard.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-center pb-2">
              <Button onClick={() => router.push("/")} size="lg" className="w-full sm:w-auto">
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- Left: Vertical Stepper (Shadcn Style) --- */}
            <div className="lg:col-span-3">
              <nav aria-label="Progress">
                <ol role="list" className="overflow-hidden rounded-md lg:space-y-0 lg:border-l lg:border-slate-200">
                  {Steps.map((s, stepIdx) => {
                    const status = step === s.id ? 'current' : step > s.id ? 'complete' : 'upcoming';
                    
                    return (
                      <li key={s.id} className="relative lg:pl-6 py-2">
                        {/* Mobile/Horizontal View (Hidden on LG) */}
                        <div className="block lg:hidden absolute top-0 left-0 h-full w-1 bg-slate-200" />
                        
                        {/* Desktop Line Marker */}
                        <div 
                          className={cn(
                            "absolute left-[-2px] top-0 h-full w-1 bg-transparent transition-colors duration-300 hidden lg:block",
                            status === 'current' ? "bg-primary" : 
                            status === 'complete' ? "bg-green-500" : "bg-transparent"
                          )} 
                        />

                        <div className={cn(
                          "flex items-center group cursor-default transition-all duration-300",
                          status === 'upcoming' && "opacity-50"
                        )}>
                          <span className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold mr-3 shrink-0",
                            status === 'complete' ? "bg-green-500 border-green-500 text-white" :
                            status === 'current' ? "bg-primary border-primary text-primary-foreground" :
                            "border-slate-300 text-slate-500"
                          )}>
                            {status === 'complete' ? <FaCheck size={10} /> : s.icon}
                          </span>
                          <span className={cn(
                            "text-sm font-medium",
                            status === 'current' ? "text-primary font-bold" : "text-slate-600"
                          )}>
                            {s.name}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* --- Right: Form Card --- */}
            <div className="lg:col-span-9">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{Steps[step - 1].name}</CardTitle>
                    <span className="text-sm text-slate-400 font-medium">Step {step} of 6</span>
                  </div>
                  <CardDescription>
                    Please provide accurate information to avoid verification delays.
                  </CardDescription>
                </CardHeader>
                <Separator />
                
                <CardContent className="pt-6">
                  {/* Step Rendering */}
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {step === 1 && <StepOne data={vendorData} onChange={handleInputChange} onSelect={handleSelectChange} setStep={setStep} />}
                    {step === 2 && <StepTwo data={vendorData} onChange={handleInputChange} setStep={setStep} />}
                    {step === 3 && <StepThree data={vendorData} onFileChange={handleFileChange} onChange={handleInputChange} setStep={setStep} />}
                    {step === 4 && <StepFour data={vendorData} onChange={handleInputChange} setStep={setStep} />}
                    {step === 5 && <StepFive data={vendorData} onChange={handleInputChange} onSelect={handleSelectChange} setStep={setStep} />}
                    {step === 6 && <StepSix data={vendorData} onChange={handleInputChange} setStep={setStep} handleSubmit={handleSubmit} loading={loading} />}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Refactored to Shadcn) ---

const FormActions = ({ onBack, onNext, loading, nextLabel = "Next" }) => (
  <div className="flex justify-end gap-3 mt-8 pt-4">
    {onBack && (
      <Button variant="outline" onClick={onBack} disabled={loading} type="button">
        <FaArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
    )}
    <Button onClick={onNext} disabled={loading} className="px-8" type="button">
      {loading ? "Processing..." : nextLabel}
      {!loading && <FaArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  </div>
);

function StepOne({ data, onChange, onSelect, setStep }) {
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    if (!data.name) return toast.error("Full Name is required");
    if (!data.email || !data.email.includes("@")) return toast.error("Valid email required");
    if (!data.phoneNumber) return toast.error("Phone number required");
    if (!data.storeName) return toast.error("Store name required");

    try {
      setLoading(true);
      const { data: res } = await axiosInstance.post("/api/app/check-email", { email: data.email });
      if (res.success) setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.error || "Email check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="type">Vendor Type</Label>
          <Select name="type" value={data.type} onValueChange={(val) => onSelect("type", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">{data.type === "Individual" ? "Full Name" : "Company Name"} <span className="text-red-500">*</span></Label>
          <Input id="name" name="name" value={data.name} onChange={onChange} placeholder="e.g. John Doe" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
          <Input id="phoneNumber" name="phoneNumber" value={data.phoneNumber} onChange={onChange} placeholder="e.g. 017..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input id="email" name="email" type="email" value={data.email} onChange={onChange} placeholder="john@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name <span className="text-red-500">*</span></Label>
          <Input id="storeName" name="storeName" value={data.storeName} onChange={onChange} placeholder="e.g. Pet Paradise" />
        </div>
      </div>
      <FormActions onNext={validate} loading={loading} />
    </div>
  );
}

function StepTwo({ data, onChange, setStep }) {
  const validate = () => {
    if (!data.storeAddress || !data.state || !data.area || !data.district || !data.postcode) {
      return toast.error("Please fill all address fields");
    }
    setStep(3);
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="storeAddress">Store Address Line 1 <span className="text-red-500">*</span></Label>
        <Input id="storeAddress" name="storeAddress" value={data.storeAddress} onChange={onChange} placeholder="House, Road, Block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">Division / State <span className="text-red-500">*</span></Label>
          <Input id="state" name="state" value={data.state} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District <span className="text-red-500">*</span></Label>
          <Input id="district" name="district" value={data.district} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Area / Thana <span className="text-red-500">*</span></Label>
          <Input id="area" name="area" value={data.area} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode <span className="text-red-500">*</span></Label>
          <Input id="postcode" name="postcode" value={data.postcode} onChange={onChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupAddress">Full Pickup Address <span className="text-red-500">*</span></Label>
        <Input id="pickupAddress" name="pickupAddress" value={data.pickupAddress} onChange={onChange} placeholder="Same as store address if applicable" />
      </div>

      <FormActions onBack={() => setStep(1)} onNext={validate} />
    </div>
  );
}

function StepThree({ data, onFileChange, onChange, setStep }) {
  const validate = () => {
    if (!data.nidFront || !data.nidBack || !data.nidNumber) return toast.error("NID documents and number required");
    setStep(4);
  };

  const FileUploadBox = ({ label, name, file }) => (
    <div className="space-y-2">
      <Label>{label} <span className="text-red-500">*</span></Label>
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer relative group">
        <Input 
          type="file" 
          name={name} 
          onChange={onFileChange} 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
        />
        {file ? (
          <div className="relative z-10 flex flex-col items-center">
             <div className="h-32 w-full mb-2 relative">
               <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-contain rounded-md" />
             </div>
             <p className="text-sm font-medium text-green-600 flex items-center gap-2">
               <FaCircleCheck /> File Selected
             </p>
             <p className="text-xs text-slate-400 mt-1">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center z-10 text-slate-400">
             <FaCloudArrowUp className="text-3xl mb-2 group-hover:text-primary transition-colors" />
             <p className="text-sm font-medium">Click to upload image</p>
             <p className="text-xs">JPG, PNG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUploadBox label="NID Front Side" name="nidFront" file={data.nidFront} />
        <FileUploadBox label="NID Back Side" name="nidBack" file={data.nidBack} />
      </div>
      
      <div className="space-y-2">
         <Label htmlFor="nidNumber">National ID Number <span className="text-red-500">*</span></Label>
         <Input id="nidNumber" name="nidNumber" value={data.nidNumber} onChange={onChange} />
      </div>

      <FormActions onBack={() => setStep(2)} onNext={validate} />
    </div>
  );
}

function StepFour({ data, onChange, setStep }) {
  const validate = () => {
    if (!data.tin || !data.tradeLicense) return toast.error("TIN and Trade License required");
    setStep(5);
  };

  return (
    <div className="grid gap-6">
      {data.type === "Company" && (
        <div className="space-y-2">
          <Label htmlFor="companyRegistration">Company Registration No.</Label>
          <Input id="companyRegistration" name="companyRegistration" value={data.companyRegistration} onChange={onChange} />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="tin">Tax Identification Number (TIN) <span className="text-red-500">*</span></Label>
        <Input id="tin" name="tin" value={data.tin} onChange={onChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tradeLicense">Trade License Number <span className="text-red-500">*</span></Label>
        <Input id="tradeLicense" name="tradeLicense" value={data.tradeLicense} onChange={onChange} />
      </div>
      <FormActions onBack={() => setStep(3)} onNext={validate} />
    </div>
  );
}

function StepFive({ data, onChange, onSelect, setStep }) {
  const validate = () => {
    if (!data.bankAccountName || !data.bankAccountNumber) return toast.error("Bank details required");
    setStep(6);
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Bank Account Type</Label>
        <Select name="bankAccountType" value={data.bankAccountType} onValueChange={(val) => onSelect("bankAccountType", val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Current">Current</SelectItem>
            <SelectItem value="Saving">Saving</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bankAccountName">Account Holder Name <span className="text-red-500">*</span></Label>
        <Input id="bankAccountName" name="bankAccountName" value={data.bankAccountName} onChange={onChange} placeholder="e.g. John Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bankAccountNumber">Account Number <span className="text-red-500">*</span></Label>
        <Input id="bankAccountNumber" name="bankAccountNumber" value={data.bankAccountNumber} onChange={onChange} />
      </div>
      <FormActions onBack={() => setStep(4)} onNext={validate} />
    </div>
  );
}

function StepSix({ data, onChange, handleSubmit, setStep, loading }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    if (!data.password || data.password.length < 8) return toast.error("Password too short");
    if (data.password !== data.confirmPassword) return toast.error("Passwords do not match");
    handleSubmit();
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="password">Create Password <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input 
             id="password" 
             name="password" 
             type={showPass ? "text" : "password"} 
             value={data.password} 
             onChange={onChange} 
             className="pr-10"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
             {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input 
             id="confirmPassword" 
             name="confirmPassword" 
             type={showConfirm ? "text" : "password"} 
             value={data.confirmPassword} 
             onChange={onChange} 
             className="pr-10"
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
             {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <FaFileContract className="text-primary" /> Vendor Agreement
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          By submitting this application, you agree to receive and utilize packaging provided by Biluibaba for delivering goods sold on our platform to ensure a consistent experience for customers.
        </p>
      </div>

      <FormActions onBack={() => setStep(5)} onNext={validate} nextLabel="Submit Application" loading={loading} />
    </div>
  );
}