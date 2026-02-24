"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ShieldCheck,
  FileText,
  HelpCircle,
  LogOut,
  RefreshCcw,
} from "lucide-react";

export default function PendingApprovalPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/app/logout");
      if (data.success) {
        toast({
          title: "Logged out successfully",
          description: "Redirecting to login page...",
        });
        return router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Account Pending Approval
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your vendor account is currently under review by our admin team.
            You&apos;ll receive an email notification once your account has been
            approved.
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Account Created
              </p>
              <p className="text-xs text-muted-foreground">
                Your registration was received successfully
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Under Review
              </p>
              <p className="text-xs text-muted-foreground">
                Our team is reviewing your documents and information
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-40">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Account Approved
              </p>
              <p className="text-xs text-muted-foreground">
                Start managing your products and orders
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="rounded-xl"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Check Status
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Help */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              Need help? Contact us at{" "}
              <a
                href="mailto:support@biluibaba.com"
                className="text-[#FF8A80] hover:underline font-medium"
              >
                support@biluibaba.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
