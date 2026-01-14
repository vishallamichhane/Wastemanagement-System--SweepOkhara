import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsShieldCheck, BsFileText, BsPeople, BsLock, BsGlobe, BsCheckCircle, BsArrowLeft } from "react-icons/bs";
import { GiBroom } from "react-icons/gi";
import Header from "./components/Header";

export default function PrivacyPolicyPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <BsFileText className="text-xl" />,
      content: "Welcome to SweepOkhara's Privacy Policy. This document outlines how we collect, use, disclose, and safeguard your information when you use our waste management platform. Your privacy is critically important to us, and we are committed to protecting it through our compliance with this policy."
    },
    {
      id: "data-collection",
      title: "Information We Collect",
      icon: <BsPeople className="text-xl" />,
      content: "We collect information that you provide directly to us, including but not limited to: name, email address, phone number, location data, waste reporting information, and account preferences. We also automatically collect certain information when you use our services, such as IP addresses, device information, and usage patterns."
    },
    {
      id: "data-usage",
      title: "How We Use Your Information",
      icon: <BsShieldCheck className="text-xl" />,
      content: "We use the information we collect to: provide and maintain our services, process your waste reports, communicate with you about service updates, improve our platform's functionality, ensure community safety, and comply with legal obligations. We never sell your personal information to third parties."
    },
    {
      id: "data-sharing",
      title: "Information Sharing",
      icon: <BsGlobe className="text-xl" />,
      content: "We may share your information with: municipal authorities for waste management purposes, service providers who assist in platform operations, law enforcement when required by law, and other users only when necessary for community-based reporting features (with appropriate anonymization)."
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <BsLock className="text-xl" />,
      content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, secure data storage, and regular security assessments."
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: <BsCheckCircle className="text-xl" />,
      content: "You have the right to: access your personal information, correct inaccurate data, request deletion of your data, object to processing, and request data portability. You can exercise these rights by contacting us through the platform or at privacy@sweepokhara.gov.np"
    }
  ];

  const principles = [
    { text: "Transparency in data collection and use", icon: "🔍" },
    { text: "Minimal data collection for specific purposes", icon: "📊" },
    { text: "Secure storage and transmission of data", icon: "🔒" },
    { text: "User control over personal information", icon: "👤" },
    { text: "Regular privacy policy reviews and updates", icon: "🔄" },
    { text: "Compliance with local data protection laws", icon: "⚖️" }
  ];

  return (
    <>  
      {/* Main content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-10 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg">
                <BsShieldCheck className="text-3xl" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Protecting your privacy is our commitment. Learn how we handle your information.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last Updated: November 26, 2024 | Version: 2.1
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 group"
              >
                <div className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <section className="animate-fade-in">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Our Privacy Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/50 rounded-xl">
                  <span className="text-2xl flex-shrink-0">{principle.icon}</span>
                  <span className="text-gray-700 font-medium">{principle.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl text-white shadow-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{section.content}</p>
              </div>
            </section>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Cookies and Tracking</h4>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Children's Privacy</h4>
              <p className="text-gray-700">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Policy Updates</h4>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </div>
        </div>

       
        {/* Agreement Section */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50">
            <BsCheckCircle className="text-emerald-600 text-2xl" />
            <p className="text-gray-700 font-medium">
              By using SweepOkhara, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </main>


      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out both;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}