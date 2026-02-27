"use client";

import Link from "next/link";
import {
  FaHandshake,
  FaChartLine,
  FaMoneyBillWave,
  FaUsers,
  FaArrowRight,
  FaPercent,
  FaGift,
  FaHeadset,
} from "react-icons/fa6";
import Button from "@/src/components/ui/button";

const benefits = [
  {
    icon: <FaPercent className="text-2xl" />,
    title: "Competitive Commissions",
    description: "Earn up to 15% commission on every successful referral purchase.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <FaChartLine className="text-2xl" />,
    title: "Real-Time Tracking",
    description: "Monitor your referrals, clicks, and earnings with our dashboard.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <FaMoneyBillWave className="text-2xl" />,
    title: "Monthly Payouts",
    description: "Get your earnings deposited directly to your bank account every month.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: <FaGift className="text-2xl" />,
    title: "Exclusive Perks",
    description: "Access special discounts, early product launches, and exclusive deals.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: <FaUsers className="text-2xl" />,
    title: "Growing Community",
    description: "Join hundreds of affiliates who are already earning with Biluibaba.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: <FaHeadset className="text-2xl" />,
    title: "Dedicated Support",
    description: "Get help from our affiliate team whenever you need it.",
    color: "bg-cyan-50 text-cyan-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign Up",
    description: "Fill out a simple application form to join our affiliate program.",
  },
  {
    step: "02",
    title: "Get Your Link",
    description: "Receive your unique referral link and marketing materials.",
  },
  {
    step: "03",
    title: "Share & Promote",
    description: "Share your link on social media, blogs, or with friends and family.",
  },
  {
    step: "04",
    title: "Earn Money",
    description: "Earn commission on every purchase made through your referral link.",
  },
];

export default function AffiliatesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-petzy-blue-light to-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-petzy-coral/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-petzy-blue/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white mb-6">
              <FaHandshake className="text-petzy-coral" />
              <span className="text-sm font-semibold text-petzy-slate">Affiliate Program</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-petzy-slate mb-6 leading-tight">
              Earn While You <span className="text-petzy-coral">Share</span>
            </h1>
            <p className="text-lg text-petzy-slate-light mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the Biluibaba Affiliate Program and earn generous commissions by
              recommending pet products your audience will love.
            </p>
            <Link href="/contact">
              <Button
                text="Apply Now"
                icon={<FaArrowRight />}
                className="bg-petzy-coral text-white hover:bg-petzy-coral/90 !px-8 !py-4 !text-base shadow-lg shadow-petzy-coral/30"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-5 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-petzy-slate mb-4">
            Why Partner With <span className="text-petzy-coral">Us?</span>
          </h2>
          <p className="text-petzy-slate-light max-w-xl mx-auto">
            We provide everything you need to succeed as an affiliate partner.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-5`}>
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-petzy-slate mb-2">{benefit.title}</h3>
              <p className="text-sm text-petzy-slate-light leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-petzy-blue-light/30 py-20">
        <div className="container mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-petzy-slate mb-4">
              How It <span className="text-petzy-coral">Works</span>
            </h2>
            <p className="text-petzy-slate-light max-w-xl mx-auto">
              Getting started is easy. Follow these simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-petzy-coral text-white flex items-center justify-center mx-auto mb-5 text-xl font-extrabold shadow-lg shadow-petzy-coral/30">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-petzy-coral/30" />
                )}
                <h3 className="text-lg font-bold text-petzy-slate mb-2">{step.title}</h3>
                <p className="text-sm text-petzy-slate-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Tiers */}
      <div className="container mx-auto px-5 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-petzy-slate mb-4">
            Commission <span className="text-petzy-coral">Tiers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { tier: "Starter", sales: "1-50", commission: "5%", color: "border-gray-200" },
            { tier: "Growth", sales: "51-200", commission: "10%", color: "border-petzy-coral ring-2 ring-petzy-coral/20" },
            { tier: "Elite", sales: "200+", commission: "15%", color: "border-gray-200" },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border-2 ${item.color} bg-white text-center hover:shadow-lg transition-all`}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">{item.tier}</h3>
              <div className="text-5xl font-extrabold text-petzy-coral mb-2">{item.commission}</div>
              <p className="text-sm text-petzy-slate-light">Commission Rate</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-petzy-slate font-medium">{item.sales} sales/month</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-petzy-coral to-petzy-coral/90 py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join our affiliate program today and turn your love for pets into a rewarding income.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 bg-white text-petzy-coral font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg active:scale-95">
              Contact Us to Apply
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}