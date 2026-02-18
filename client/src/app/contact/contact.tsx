"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

// Components
import Button from "@/src/components/ui/button";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone",
      details: ["+880 1234-567890", "+880 9876-543210"],
      color: "petzy-coral"
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
      details: ["support@biluibaba.com", "info@biluibaba.com"],
      color: "petzy-blue"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Address",
      details: ["123 Pet Street, Gulshan-2", "Dhaka, Bangladesh 1212"],
      color: "petzy-mint"
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", url: "#", color: "bg-blue-600" },
    { icon: <FaInstagram />, name: "Instagram", url: "#", color: "bg-pink-600" },
    { icon: <FaTwitter />, name: "Twitter", url: "#", color: "bg-sky-500" },
    { icon: <FaWhatsapp />, name: "WhatsApp", url: "#", color: "bg-green-600" }
  ];

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-b from-petzy-blue-light to-white pt-20 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-petzy-coral/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-petzy-slate mb-6 leading-tight">
              Get in <span className="text-petzy-coral">Touch</span>
            </h1>
            <p className="text-xl text-petzy-slate-light">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTACT INFO CARDS --- */}
      <section className="container mx-auto px-5 -mt-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((info, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-${info.color}/10 text-${info.color} rounded-2xl mb-4`}>
                {info.icon}
              </div>
              <h3 className="text-xl font-bold text-petzy-slate mb-3">
                {info.title}
              </h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-petzy-slate-light">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT FORM & MAP --- */}
      <section className="container mx-auto px-5 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-petzy-slate mb-6">
              Send Us a Message
            </h2>
            <p className="text-petzy-slate-light mb-8">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-petzy-slate font-semibold mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-petzy-coral focus:ring-2 focus:ring-petzy-coral/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-petzy-slate font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-petzy-coral focus:ring-2 focus:ring-petzy-coral/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-petzy-slate font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-petzy-coral focus:ring-2 focus:ring-petzy-coral/20 outline-none transition-all"
                    placeholder="+880 1234-567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-petzy-slate font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-petzy-coral focus:ring-2 focus:ring-petzy-coral/20 outline-none transition-all"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-petzy-slate font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-petzy-coral focus:ring-2 focus:ring-petzy-coral/20 outline-none transition-all resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <Button
                text={loading ? "Sending..." : "Send Message"}
                type="default"
                className="w-full py-4 text-lg"
                disabled={loading}
              />
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden h-80 relative group">
              <img
                src="/vet-map.png"
                alt="Location Map"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                <span className="bg-white px-6 py-3 rounded-full shadow-lg text-sm font-bold text-petzy-slate">
                  View on Google Maps
                </span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-petzy-periwinkle-light/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-petzy-slate mb-6">
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-petzy-slate font-semibold">Monday - Friday</span>
                  <span className="text-petzy-slate-light">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-petzy-slate font-semibold">Saturday</span>
                  <span className="text-petzy-slate-light">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-petzy-slate font-semibold">Sunday</span>
                  <span className="text-petzy-slate-light">Closed</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-petzy-slate-light">
                  <strong className="text-petzy-coral">24/7 Emergency Support</strong> available for premium members
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-8 shadow-soft">
              <h3 className="text-2xl font-bold text-petzy-slate mb-6">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white rounded-xl p-4 flex items-center gap-3 hover:scale-105 transition-transform duration-300 shadow-md`}
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <span className="font-semibold">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ QUICK LINKS --- */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-petzy-slate mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-xl text-petzy-slate-light mb-8">
            Check out our frequently asked questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              text="View FAQ"
              type="default"
              className="px-8 py-3"
              onClick={() => router.push("/vets#faq")}
            />
            <Button
              text="Back to Home"
              type="outline"
              className="px-8 py-3"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
