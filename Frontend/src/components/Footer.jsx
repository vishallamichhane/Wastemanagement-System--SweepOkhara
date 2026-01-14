import { Link } from 'react-router-dom';

function Footer(){
  return (
    <>
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-8 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/policy" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </Link>
          <Link to="/terms" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Terms of Service
          </Link>
        </div>
      </footer>
    </>
  )
}


export default Footer