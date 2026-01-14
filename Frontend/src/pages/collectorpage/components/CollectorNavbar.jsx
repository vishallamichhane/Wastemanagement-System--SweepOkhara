import React, { useState, useEffect } from "react";
import { 
  FiHome, 
  FiCalendar, 
  FiLogOut 
} from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

const CollectorNavbar = ({
  activeNav = "home",
  onNavChange = () => {},
  collectorData
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100"
            : "bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              SweepOkhara
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
              Collector
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <NavButton
              icon={FiHome}
              label="Dashboard"
              active={activeNav === "home"}
              onClick={() => onNavChange("home")}
            />

            <NavButton
              icon={FiCalendar}
              label="Schedule"
              active={activeNav === "schedule"}
              onClick={() => onNavChange("schedule")}
            />

            <button className="px-6 py-2.5 rounded-xl text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-50 transition-all duration-300">
              <div className="flex items-center space-x-2">
                <FiLogOut />
                <span>Logout</span>
              </div>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">{collectorData?.name}</p>
                <p className="text-xs text-gray-500">
                  Collector ID: {collectorData?.id}
                </p>
              </div>
              <img
                src={collectorData?.avatar}
                alt="Collector"
                className="w-11 h-11 rounded-full border-2 border-emerald-500"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>
    </>
  );
};

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 ${
      active
        ? "text-emerald-700 bg-emerald-50/80 shadow-sm"
        : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
    }`}
  >
    <div className="flex items-center space-x-2">
      <Icon />
      <span className="font-semibold">{label}</span>
    </div>
    <span
      className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ${
        active ? "w-4/5 left-1/10" : "w-0"
      }`}
    />
  </button>
);

export default CollectorNavbar;
