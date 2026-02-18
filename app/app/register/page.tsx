"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

// --- Shadcn Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// --- Icons ---
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Store,
  Check,
  CloudUpload,
  CheckCircle2,
  User,
  MapPin,
  FileText,
  Building,
  Lock,
} from "lucide-react";

const Steps = [
  { id: 1, name: "Personal Details", icon: <User className="h-4 w-4" /> },
  { id: 2, name: "Store Address", icon: <MapPin className="h-4 w-4" /> },
  { id: 3, name: "Documents", icon: <FileText className="h-4 w-4" /> },
  { id: 4, name: "Tax Info", icon: <Building className="h-4 w-4" /> },
  { id: 5, name: "Bank Details", icon: <Building className="h-4 w-4" /> },
  { id: 6, name: "Security", icon: <Lock className="h-4 w-4" /> },
];

interface VendorData {
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  storeName: string;
  storeAddress: string;
  state: string;
  area: string;
  district: string;
  postcode: string;
  fullAddress: string;
  pickupAddress: string;
  nidFront: File | null;
  nidBack: File | null;
  nidNumber: string;
  companyRegistration: string;
  tin: string;
  tradeLicense: string;
  bankAccountType: string;
  bankAccountName: string;
  bankAccountNumber: string;
  password: string;
  confirmPassword: string;
}

export default function VendorRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [vendorData, setVendorData] = useState<VendorData>({
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Shadcn Select
  const handleSelectChange = (name: string, value: string): void => {
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
      const { data } = await axios.post("/api/vendor/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast({
          title: "Success",
          description: "Vendor application created successfully!",
        });
        setSuccess(true);
      }
    } catch (error: unknown) {
      console.error(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-10 md:py-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* --- Header --- */}
        <div className="text-center mb-12 space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white rounded-2xl flex items-center justify-center shadow-soft">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Become a Seller
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Start your journey with Biluibaba. Setup your store in minutes.
          </p>
        </div>

        {success ? (
          <Card className="max-w-xl mx-auto text-center border-green-200/60 shadow-soft-lg">
            <CardContent className="space-y-6 pt-12 pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Check className="h-10 w-10" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Application Received!</h2>
                <p className="text-slate-600 leading-relaxed">
                  We have received your details. Please check your email inbox to verify your
                  account and activate your store dashboard.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-center pb-8">
              <Button onClick={() => router.push("/")} size="lg" className="px-8">
                Return to Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- Left: Vertical Stepper --- */}
            <div className="lg:col-span-3">
              <nav aria-label="Progress">
                <ol
                  role="list"
                  className="overflow-hidden rounded-xl bg-white p-4 shadow-soft lg:space-y-2 lg:border-l-2 lg:border-border/40"
                >
                  {Steps.map((s) => {
                    const status =
                      step === s.id ? "current" : step > s.id ? "complete" : "upcoming";

                    return (
                      <li key={s.id} className="relative lg:pl-6 py-3">
                        {/* Desktop Line Marker */}
                        <div
                          className={cn(
                            "absolute left-[-2px] top-0 h-full w-1 bg-transparent transition-all duration-300 hidden lg:block rounded-full",
                            status === "current"
                              ? "bg-gradient-to-b from-[#FF8A80] to-[#FF6B61]"
                              : status === "complete"
                              ? "bg-gradient-to-b from-green-500 to-green-600"
                              : "bg-transparent"
                          )}
                        />

                        <div
                          className={cn(
                            "flex items-center gap-3 transition-all duration-300",
                            status === "upcoming" && "opacity-40"
                          )}
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center w-9 h-9 rounded-xl border-2 font-bold shrink-0 transition-all duration-300",
                              status === "complete"
                                ? "bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-soft"
                                : status === "current"
                                ? "bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] border-[#FF8A80] text-white shadow-soft"
                                : "border-border/60 text-slate-400 bg-white"
                            )}
                          >
                            {status === "complete" ? <Check className="h-4 w-4" /> : s.icon}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors",
                              status === "current"
                                ? "text-[#FF8A80] font-bold"
                                : status === "complete"
                                ? "text-slate-700"
                                : "text-slate-500"
                            )}
                          >
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
              <Card className="border-border/60 shadow-soft-lg">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8A80]/10 to-[#FF6B61]/10 flex items-center justify-center">
                        {Steps[step - 1].icon}
                      </div>
                      {Steps[step - 1].name}
                    </CardTitle>
                    <span className="text-sm text-slate-500 font-semibold px-3 py-1.5 rounded-full bg-slate-100">
                      Step {step} of 6
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    Please provide accurate information to avoid verification delays.
                  </CardDescription>
                </CardHeader>
                <Separator />

                <CardContent className="pt-8 pb-6">
                  {/* Step Rendering */}
                  <div className="animate-fadeIn">
                    {step === 1 && (
                      <StepOne
                        data={vendorData}
                        onChange={handleInputChange}
                        onSelect={handleSelectChange}
                        setStep={setStep}
                      />
                    )}
                    {step === 2 && (
                      <StepTwo data={vendorData} onChange={handleInputChange} setStep={setStep} />
                    )}
                    {step === 3 && (
                      <StepThree
                        data={vendorData}
                        onFileChange={handleFileChange}
                        onChange={handleInputChange}
                        setStep={setStep}
                      />
                    )}
                    {step === 4 && (
                      <StepFour data={vendorData} onChange={handleInputChange} setStep={setStep} />
                    )}
                    {step === 5 && (
                      <StepFive
                        data={vendorData}
                        onChange={handleInputChange}
                        onSelect={handleSelectChange}
                        setStep={setStep}
                      />
                    )}
                    {step === 6 && (
                      <StepSix
                        data={vendorData}
                        onChange={handleInputChange}
                        setStep={setStep}
                        handleSubmit={handleSubmit}
                        loading={loading}
                      />
                    )}
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

// --- SUB-COMPONENTS ---

interface FormActionsProps {
  onBack?: () => void;
  onNext: () => void;
  loading?: boolean;
  nextLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onBack,
  onNext,
  loading,
  nextLabel = "Next",
}) => (
  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/60">
    {onBack && (
      <Button variant="outline" onClick={onBack} disabled={loading} type="button" size="lg">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
    )}
    <Button onClick={onNext} disabled={loading} size="lg" className="px-10" type="button">
      {loading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
          Processing...
        </>
      ) : (
        <>
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  </div>
);

interface StepProps {
  data: VendorData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: (step: number) => void;
}

interface StepOneProps extends StepProps {
  onSelect: (name: string, value: string) => void;
}

function StepOne({ data, onChange, onSelect, setStep }: StepOneProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const validate = async () => {
    if (!data.name) {
      toast({ title: "Error", description: "Full Name is required", variant: "destructive" });
      return;
    }
    if (!data.email || !data.email.includes("@")) {
      toast({ title: "Error", description: "Valid email required", variant: "destructive" });
      return;
    }
    if (!data.phoneNumber) {
      toast({ title: "Error", description: "Phone number required", variant: "destructive" });
      return;
    }
    if (!data.storeName) {
      toast({ title: "Error", description: "Store name required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const { data: res } = await axios.post("/api/app/check-email", { email: data.email });
      if (res.success) setStep(2);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "Email check failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <Label htmlFor="name">
            {data.type === "Individual" ? "Full Name" : "Company Name"}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={data.name}
            onChange={onChange}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={onChange}
            placeholder="e.g. 017..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={onChange}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeName">
            Store Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="storeName"
            name="storeName"
            value={data.storeName}
            onChange={onChange}
            placeholder="e.g. Pet Paradise"
          />
        </div>
      </div>
      <FormActions onNext={validate} loading={loading} />
    </div>
  );
}

function StepTwo({ data, onChange, setStep }: StepProps) {
  const validate = () => {
    if (
      !data.storeAddress ||
      !data.state ||
      !data.area ||
      !data.district ||
      !data.postcode ||
      !data.pickupAddress
    ) {
      toast({
        title: "Error",
        description: "Please fill all address fields",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="storeAddress">
          Store Address Line 1 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="storeAddress"
          name="storeAddress"
          value={data.storeAddress}
          onChange={onChange}
          placeholder="House, Road, Block"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="state">
            Division / State <span className="text-red-500">*</span>
          </Label>
          <Input id="state" name="state" value={data.state} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">
            District <span className="text-red-500">*</span>
          </Label>
          <Input id="district" name="district" value={data.district} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">
            Area / Thana <span className="text-red-500">*</span>
          </Label>
          <Input id="area" name="area" value={data.area} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postcode">
            Postcode <span className="text-red-500">*</span>
          </Label>
          <Input id="postcode" name="postcode" value={data.postcode} onChange={onChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupAddress">
          Full Pickup Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="pickupAddress"
          name="pickupAddress"
          value={data.pickupAddress}
          onChange={onChange}
          placeholder="Same as store address if applicable"
        />
      </div>

      <FormActions onBack={() => setStep(1)} onNext={validate} />
    </div>
  );
}

interface StepThreeProps extends StepProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function StepThree({ data, onFileChange, onChange, setStep }: StepThreeProps) {
  const validate = () => {
    if (!data.nidFront || !data.nidBack || !data.nidNumber) {
      toast({
        title: "Error",
        description: "NID documents and number required",
        variant: "destructive",
      });
      return;
    }
    setStep(4);
  };

  const FileUploadBox = ({
    label,
    name,
    file,
  }: {
    label: string;
    name: string;
    file: File | null;
  }) => (
    <div className="space-y-2">
      <Label>
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="border-2 border-dashed border-border/60 rounded-xl p-8 hover:bg-slate-50/50 hover:border-[#FF8A80]/40 transition-all cursor-pointer relative group">
        <Input
          type="file"
          name={name}
          onChange={onFileChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        {file ? (
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="h-36 w-full relative rounded-lg overflow-hidden shadow-soft">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm font-semibold">File Selected</p>
            </div>
            <p className="text-xs text-slate-500 font-medium">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 z-10 text-slate-400">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#FF8A80]/10 transition-colors">
              <CloudUpload className="h-6 w-6 group-hover:text-[#FF8A80] transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Click to upload image</p>
              <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FileUploadBox label="NID Front Side" name="nidFront" file={data.nidFront} />
        <FileUploadBox label="NID Back Side" name="nidBack" file={data.nidBack} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nidNumber">
          National ID Number <span className="text-red-500">*</span>
        </Label>
        <Input id="nidNumber" name="nidNumber" value={data.nidNumber} onChange={onChange} />
      </div>

      <FormActions onBack={() => setStep(2)} onNext={validate} />
    </div>
  );
}

function StepFour({ data, onChange, setStep }: StepProps) {
  const validate = () => {
    if (!data.tin || !data.tradeLicense) {
      toast({
        title: "Error",
        description: "TIN and Trade License required",
        variant: "destructive",
      });
      return;
    }
    setStep(5);
  };

  return (
    <div className="grid gap-6">
      {data.type === "Company" && (
        <div className="space-y-2">
          <Label htmlFor="companyRegistration">Company Registration No.</Label>
          <Input
            id="companyRegistration"
            name="companyRegistration"
            value={data.companyRegistration}
            onChange={onChange}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="tin">
          Tax Identification Number (TIN) <span className="text-red-500">*</span>
        </Label>
        <Input id="tin" name="tin" value={data.tin} onChange={onChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tradeLicense">
          Trade License Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="tradeLicense"
          name="tradeLicense"
          value={data.tradeLicense}
          onChange={onChange}
        />
      </div>
      <FormActions onBack={() => setStep(3)} onNext={validate} />
    </div>
  );
}

interface StepFiveProps extends StepProps {
  onSelect: (name: string, value: string) => void;
}

function StepFive({ data, onChange, onSelect, setStep }: StepFiveProps) {
  const validate = () => {
    if (!data.bankAccountName || !data.bankAccountNumber) {
      toast({
        title: "Error",
        description: "Bank details required",
        variant: "destructive",
      });
      return;
    }
    setStep(6);
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Bank Account Type</Label>
        <Select
          name="bankAccountType"
          value={data.bankAccountType}
          onValueChange={(val) => onSelect("bankAccountType", val)}
        >
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
        <Label htmlFor="bankAccountName">
          Account Holder Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bankAccountName"
          name="bankAccountName"
          value={data.bankAccountName}
          onChange={onChange}
          placeholder="e.g. John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bankAccountNumber">
          Account Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bankAccountNumber"
          name="bankAccountNumber"
          value={data.bankAccountNumber}
          onChange={onChange}
        />
      </div>
      <FormActions onBack={() => setStep(4)} onNext={validate} />
    </div>
  );
}

interface StepSixProps extends StepProps {
  handleSubmit: () => void;
  loading: boolean;
}

function StepSix({ data, onChange, handleSubmit, setStep, loading }: StepSixProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const validate = () => {
    if (!data.password || data.password.length < 8) {
      toast({ title: "Error", description: "Password too short", variant: "destructive" });
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    handleSubmit();
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="password">
          Create Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            value={data.password}
            onChange={onChange}
            className="pr-10"
            placeholder="Minimum 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={data.confirmPassword}
            onChange={onChange}
            className="pr-10"
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-border/60 rounded-xl p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-slate-900">
          <FileText className="text-[#FF8A80] h-4 w-4" /> Vendor Agreement
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          By submitting this application, you agree to receive and utilize packaging provided by
          Biluibaba for delivering goods sold on our platform to ensure a consistent experience for
          customers.
        </p>
      </div>

      <FormActions
        onBack={() => setStep(5)}
        onNext={validate}
        nextLabel="Submit Application"
        loading={loading}
      />
    </div>
  );
}
