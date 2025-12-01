import React, { useState, useEffect } from "react";
import { GiBroom, GiRocket } from "react-icons/gi";
import { BsEye, BsHeart, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import Header from "../components/Header";


export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-gray-800 font-sans flex flex-col relative overflow-hidden">
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-32 relative z-10">
        {/* Enhanced About Heading */}
        <section className="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
          <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
            About SweepOkhara
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are a team of passionate individuals dedicated to leveraging technology for a cleaner, greener, and more sustainable Pokhara. Our mission is to empower citizens and streamline waste management for a healthier community.
          </p>
        </section>

        {/* Enhanced Our Journey */}
        <section className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto mb-24">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
              Our Journey
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                SweepOkhara was born from a simple idea: that every citizen deserves to live in a clean and healthy environment. Frustrated by inefficient waste management systems, we envisioned a platform that could connect residents, collectors, and city officials seamlessly. Starting in 2022, our small team began developing a smart solution to tackle Pokhara's waste challenges head-on.
              </p>
              <p>
                Today, we are proud to offer a comprehensive system that not only optimizes waste collection but also fosters a sense of community ownership and environmental responsibility. Our journey is one of collaboration, innovation, and an unwavering commitment to our city.
              </p>
            </div>
          </div>
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-300 rounded-full opacity-50 mix-blend-multiply blur-2xl"></div>
            <div className="rounded-2xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
              <img
                src="https://as2.ftcdn.net/jpg/13/37/85/67/1000_F_1337856793_BkH1M4y7fQVPWuRPeXQyrvIYSPPdWNCk.jpg"
                alt="Lush green park trees"
                className="object-cover w-full h-96 group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </section>

        {/* Enhanced Mission, Vision & Values */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-6xl mx-auto mb-28 shadow-2xl border border-green-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              Our Mission, Vision & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and drive our commitment to a better tomorrow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mission */}
            <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-200 hover:border-green-300 group hover:scale-105 animate-fade-in-up">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <GiRocket size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a cleaner Pokhara by providing an intelligent, user-friendly waste management platform that empowers citizens and optimizes collection services through technology.
              </p>
            </article>

            {/* Vision */}
            <article className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-200 hover:border-blue-300 group hover:scale-105 animate-fade-in-up animation-delay-200">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <BsEye size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading model for smart and sustainable urban waste management, fostering a culture of environmental responsibility and community pride across the nation.
              </p>
            </article>

            {/* Values */}
            <article className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-200 hover:border-amber-300 group hover:scale-105 animate-fade-in-up animation-delay-400">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <BsHeart size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Community, Integrity, Innovation, Sustainability, and Accountability. We believe in working together, acting ethically, and continuously improving for the planet and its people.
              </p>
            </article>
          </div>
        </section>

        {/* Enhanced Meet Our Team */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 mb-12">The dedicated minds behind SweepOkhara.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {[
              {
                name: "Sumit Gurung",
                role: "Co-Founder & CEO",
                img: "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg",
              },
              {
                name: "Shisher Chantel",
                role: "Lead Developer",
                img: "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg",
              },
              {
                name: "Paras Ghale",
                role: "Community Manager",
                img: "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg",
              },
              {
                name: "Bishal Lamichhane",
                role: "Operations Lead",
                img: "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg",
              },
            ].map(({ name, role, img }, index) => (
              <div 
                key={name} 
                className="flex flex-col items-center gap-4 group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <img
                    src={img}
                    alt={name}
                    className="rounded-full w-32 h-32 object-cover shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-500 relative z-10"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">{name}</p>
                  <p className="text-gray-600 text-sm">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced CTA */}
        <section className="max-w-6xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-glow"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse-slow"></div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full animate-pulse-slow animation-delay-2000"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6 leading-tight">
                Join the Movement for a Cleaner Tomorrow
              </h3>
              <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Register today and become an active part of the solution. Let's make our city a better place, one report at a time.
              </p>
              <button className="group bg-white text-green-700 font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 flex items-center gap-3 mx-auto">
                Register Now
                <BsArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - UPDATED with home page style */}
      <footer className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-lg font-bold">
              <GiBroom className="text-emerald-600 text-2xl" />
              <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                SweepOkhara
              </span>
            </div>
            
            <div className="flex gap-8 text-emerald-700 text-sm font-medium">
              <a href="#" className="hover:text-emerald-800 transition-colors duration-300 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-emerald-800 transition-colors duration-300 hover:underline">
                Terms of Service
              </a>
            </div>
            
            <div className="text-emerald-600 text-sm">
              © 2024 SweepOkhara. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Animation Styles */}
      <style jsx>{`
        @keyframes sweep {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .animate-sweep {
          animation: sweep 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out both;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}