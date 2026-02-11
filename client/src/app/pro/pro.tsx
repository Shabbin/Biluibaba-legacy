"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiVipCrownFill } from "react-icons/ri";
import { FaCheck, FaStar, FaShieldAlt, FaTruck, FaHeadset, FaCalendarCheck } from "react-icons/fa";

// Components
import Button from "@/src/components/ui/button";
import Accordion from "@/src/components/ui/accordion";

const pricingPlans = [
  {
    name: "Monthly",
    price: "৳499",
    period: "/month",
    savings: null,
    popular: false,
    features: [
      "10% discount on all products",
      "Priority vet booking",
      "Free shipping on orders over ৳1000",
      "24/7 customer support",
      "Early access to new products",
      "Monthly pet care newsletter"
    ]
  },
  {
    name: "Annual",
    price: "৳4,999",
    period: "/year",
    savings: "Save ৳989",
    popular: true,
    features: [
      "20% discount on all products",
      "Priority vet booking",
      "Free shipping on all orders",
      "24/7 premium customer support",
      "Early access to new products",
      "Monthly pet care newsletter",
      "Free quarterly health checkup",
      "Exclusive members-only events"
    ]
  },
  {
    name: "Lifetime",
    price: "৳19,999",
    period: "one-time",
    savings: "Best Value",
    popular: false,
    features: [
      "25% discount on all products forever",
      "Priority vet booking",
      "Free shipping on all orders",
      "24/7 VIP customer support",
      "Early access to new products",
      "Monthly pet care newsletter",
      "Free quarterly health checkup",
      "Exclusive members-only events",
      "Annual pet insurance discount",
      "Biluibaba merchandise kit"
    ]
  }
];

const benefits = [
  {
    icon: <FaStar className="text-4xl text-yellow-500" />,
    title: "Exclusive Discounts",
    description: "Get up to 25% off on all products and services"
  },
  {
    icon: <FaCalendarCheck className="text-4xl text-petzy-coral" />,
    title: "Priority Booking",
    description: "Skip the queue and book appointments instantly"
  },
  {
    icon: <FaTruck className="text-4xl text-petzy-blue" />,
    title: "Free Shipping",
    description: "Enjoy free delivery on all your orders"
  },
  {
    icon: <FaHeadset className="text-4xl text-petzy-mint" />,
    title: "24/7 Support",
    description: "Get instant help whenever you need it"
  },
  {
    icon: <FaShieldAlt className="text-4xl text-petzy-slate" />,
    title: "Premium Care",
    description: "Access exclusive health and wellness programs"
  }
];

const faqData = [
  {
    question: "What is Biluibaba Premium?",
    answer: "Biluibaba Premium is a subscription service that gives you exclusive discounts, priority booking, free shipping, and access to premium features across our platform."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your monthly or annual subscription at any time. Your benefits will continue until the end of your billing period. Lifetime memberships are non-refundable."
  },
  {
    question: "How do the discounts work?",
    answer: "Your discount is automatically applied at checkout on all products and services. Monthly members get 10%, annual members get 20%, and lifetime members get 25% off."
  },
  {
    question: "Is free shipping available for all areas?",
    answer: "Free shipping is available across Bangladesh for all premium members. Delivery times may vary based on your location."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, mobile banking (bKash, Nagad, Rocket), and online payment gateways through SSLCommerz."
  }
];

const Pro = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to Annual plan

  const handleSubscribe = (planIndex) => {
    // TODO: Implement payment/subscription logic
    console.log("Subscribing to:", pricingPlans[planIndex].name);
    // For now, just show alert
    alert(`Coming Soon: ${pricingPlans[planIndex].name} subscription will be available soon!`);
  };

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-b from-yellow-50 via-white to-white pt-20 pb-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-petzy-coral/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-soft mb-8">
              <RiVipCrownFill className="text-3xl text-yellow-500" />
              <span className="font-bold text-petzy-slate">Premium Membership</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-petzy-slate mb-6 leading-tight">
              Upgrade to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-petzy-coral">
                Biluibaba Premium
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-petzy-slate-light mb-12 max-w-3xl mx-auto">
              Get exclusive benefits, priority access, and amazing discounts. 
              Join thousands of pet parents who trust Biluibaba Premium.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                text="View Plans"
                className="px-10 py-4 text-lg shadow-xl shadow-yellow-500/20"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              />
              <button
                className="px-10 py-4 rounded-full font-bold text-petzy-slate border-2 border-gray-200 hover:border-petzy-coral hover:text-petzy-coral transition-all"
                onClick={() => router.push("/vets")}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-petzy-slate mb-4">
              Why Go Premium?
            </h2>
            <p className="text-xl text-petzy-slate-light max-w-2xl mx-auto">
              Unlock a world of exclusive benefits designed for you and your pet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-petzy-slate mb-3">
                  {benefit.title}
                </h3>
                <p className="text-petzy-slate-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-petzy-slate mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-petzy-slate-light max-w-2xl mx-auto">
              Select the perfect plan for you and your furry friend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-yellow-50 to-white border-2 border-yellow-400 shadow-xl shadow-yellow-500/20'
                    : 'bg-white border-2 border-gray-100 shadow-soft hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <FaStar className="text-white" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-petzy-slate mb-2">
                    {plan.name}
                  </h3>
                  {plan.savings && (
                    <span className="text-sm font-bold text-petzy-coral bg-petzy-coral/10 px-3 py-1 rounded-full">
                      {plan.savings}
                    </span>
                  )}
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold text-petzy-slate">
                      {plan.price}
                    </span>
                    <span className="text-petzy-slate-light">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-petzy-slate">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  text={plan.popular ? "Get Started" : "Subscribe Now"}
                  type={plan.popular ? "default" : "outline"}
                  className="w-full py-3"
                  onClick={() => handleSubscribe(idx)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL SECTION --- */}
      <section className="py-24 bg-petzy-periwinkle-light/20">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-petzy-slate mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-petzy-slate-light">
              Join thousands of happy pet parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Rahman",
                pet: "Dog Parent",
                image: "/testimonials/user1.png",
                text: "The premium membership has been a game-changer! The discounts alone have saved me thousands, and priority vet booking is invaluable."
              },
              {
                name: "Ahmed Khan",
                pet: "Cat Parent",
                image: "/testimonials/user2.png",
                text: "Free shipping and 24/7 support make this worth every penny. My cats are happier and healthier than ever!"
              },
              {
                name: "Nadia Hossain",
                pet: "Multi-Pet Parent",
                image: "/testimonials/user3.png",
                text: "I got the lifetime membership and it's the best investment I've made for my pets. The exclusive events are amazing!"
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-petzy-slate">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-petzy-slate-light">
                      {testimonial.pet}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-petzy-slate-light leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <div className="container mx-auto px-5 my-24">
        <div className="bg-gradient-to-r from-gray-900 to-petzy-slate rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <RiVipCrownFill className="text-6xl text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-yellow-500">
              Ready to Go Premium?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our premium family today and give your pet the best care they deserve
            </p>
            <Button
              text="Subscribe Now"
              className="bg-white text-petzy-slate hover:bg-yellow-400 hover:text-white px-10 py-4 text-lg shadow-xl transform hover:scale-105"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>
        </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="container mx-auto px-5 mb-24 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-sm font-bold text-petzy-coral uppercase tracking-widest">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-petzy-slate mt-2">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion items={faqData} />
      </div>

      {/* --- FINAL CTA --- */}
      <section className="py-20 bg-gradient-to-b from-white to-petzy-blue-light/30">
        <div className="container mx-auto px-5 text-center">
          <img
            src="/logo-black.png"
            alt="Biluibaba Logo"
            className="w-48 mx-auto mb-8 opacity-90"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-petzy-slate mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-petzy-slate-light mb-8">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              text="Contact Support"
              type="outline"
              className="px-8 py-3"
              onClick={() => router.push("/contact")}
            />
            <Button
              text="Back to Home"
              className="px-8 py-3"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pro;
