import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFileText, BsShieldCheck, BsExclamationTriangle, BsCheckCircle, BsArrowLeft, BsPeople, BsGlobe, BsLock, BsClipboardCheck, BsChat } from "react-icons/bs";
import { GiBroom, GiContract } from "react-icons/gi";
import Header from "./components/Header";

export default function TermsOfServicePage() {
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
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <BsCheckCircle className="text-xl" />,
      content: "By accessing and using SweepOkhara, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.",
      points: [
        "You must be at least 13 years old to use this service",
        "You agree to comply with all applicable laws and regulations",
        "You accept responsibility for all activities under your account"
      ]
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      icon: <BsPeople className="text-xl" />,
      content: "As a user of SweepOkhara, you agree to use the service responsibly and ethically for community betterment.",
      points: [
        "Provide accurate information when reporting waste issues",
        "Do not submit false or misleading reports",
        "Respect the privacy and rights of other users",
        "Use appropriate language in all communications",
        "Do not misuse the reporting system"
      ]
    },
    {
      id: "service-description",
      title: "Service Description",
      icon: <GiBroom className="text-xl" />,
      content: "SweepOkhara is a community-driven waste management platform that connects citizens with municipal services to maintain cleaner urban environments.",
      points: [
        "Real-time waste reporting and tracking",
        "Waste collection schedule management",
        "Environmental awareness resources",
        "Community engagement features",
        "Municipal service coordination"
      ]
    },
    {
      id: "account-terms",
      title: "Account Terms",
      icon: <BsLock className="text-xl" />,
      content: "To access certain features of SweepOkhara, you may be required to create an account and maintain accurate information.",
      points: [
        "You are responsible for maintaining account security",
        "Notify us immediately of any unauthorized use",
        "We reserve the right to disable accounts that violate terms",
        "Accounts may be terminated for policy violations",
        "You can delete your account at any time"
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <BsFileText className="text-xl" />,
      content: "All content, features, and functionality of SweepOkhara are owned by us and are protected by intellectual property laws.",
      points: [
        "You may not reproduce, distribute, or create derivative works",
        "Content submitted remains your property",
        "You grant us license to use submitted content for service operation",
        "Trademarks and logos may not be used without permission",
        "Feedback and suggestions may be used to improve the service"
      ]
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: <BsExclamationTriangle className="text-xl" />,
      content: "SweepOkhara is provided 'as is' without warranties of any kind, either express or implied.",
      points: [
        "We are not liable for indirect, incidental, or consequential damages",
        "We do not guarantee uninterrupted or error-free service",
        "Users assume all risks associated with service use",
        "We are not responsible for third-party actions",
        "Liability is limited to the maximum extent permitted by law"
      ]
    },
    {
      id: "termination",
      title: "Termination",
      icon: <BsClipboardCheck className="text-xl" />,
      content: "We may terminate or suspend your access to SweepOkhara immediately, without prior notice, for conduct that we believe violates these terms.",
      points: [
        "We may terminate accounts for violation of terms",
        "You may terminate your account at any time",
        "Upon termination, your right to use the service ceases",
        "Certain provisions survive termination",
        "We may modify or discontinue service at any time"
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law",
      icon: <BsGlobe className="text-xl" />,
      content: "These terms shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.",
      points: [
        "Disputes will be resolved in Nepali courts",
        "Nepal law governs these terms",
        "International users must comply with local laws",
        "EU users have specific rights under GDPR",
        "We comply with applicable data protection laws"
      ]
    }
  ];

  const keyHighlights = [
    { text: "Community-focused waste management", icon: "♻️" },
    { text: "Transparent and ethical service operation", icon: "🔍" },
    { text: "User privacy and data protection", icon: "🔒" },
    { text: "Responsible reporting system", icon: "📝" },
    { text: "Municipal collaboration", icon: "🏛️" },
    { text: "Environmental sustainability", icon: "🌱" }
  ];

  return (
    <>

      {/* Main content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-10 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
            <Link to= "/user">
          <button
            
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          </Link>
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg">
                <GiContract className="text-3xl" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Please read these terms carefully before using SweepOkhara.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Effective Date: November 26, 2024 | Version: 1.2
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-xl flex-shrink-0">
              <BsExclamationTriangle className="text-amber-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Important Notice</h3>
              <p className="text-amber-700">
                By accessing or using SweepOkhara, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms affect your legal rights and responsibilities.
              </p>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <section className="animate-fade-in">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">Our Commitment to You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-emerald-100">
                  <span className="text-2xl flex-shrink-0">{highlight.icon}</span>
                  <span className="text-gray-700 font-medium">{highlight.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Navigate Terms</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 group"
              >
                <div className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-emerald-700 leading-tight">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Terms Sections */}
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
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{section.content}</p>
                
                {section.points && section.points.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <ul className="space-y-3">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-1 rounded mt-1 flex-shrink-0">
                            <BsCheckCircle className="text-emerald-600 text-sm" />
                          </div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Additional Terms */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Additional Terms</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Modifications to Terms</h4>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Effective Date" at the top of this page. Your continued use of SweepOkhara after any changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Contact Information</h4>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Email</h5>
                  <a href="mailto:legal@sweepokhara.gov.np" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                    legal@sweepokhara.gov.np
                  </a>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Address</h5>
                  <p className="text-gray-700">Pokhara Metropolitan City Office, Pokhara, Nepal</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Severability</h4>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 max-w-2xl mx-auto">
            <div className="bg-emerald-100 p-3 rounded-full">
              <BsShieldCheck className="text-emerald-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Agreement Confirmation</h3>
              <p className="text-gray-700">
                By continuing to use SweepOkhara, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors duration-300"
              >
                I Understand
              </button>
              <button
                onClick={() => navigate('/privacy-policy')}
                className="px-6 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors duration-300"
              >
                View Privacy Policy
              </button>
            </div>
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