import { useState } from 'react'
import './App.css'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import UserHomePage from './pages/userpage/UserHomepage';
import MapPage from './pages/userpage/Mapview';
import HomePage from './pages/Home';
import FeaturePage from './pages/Feature';
import AboutusPage from './pages/Aboutus';
import ContactPage from './pages/Contact';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchedulePage from './pages/userpage/Schedule';
import ReminderPage from './pages/userpage/Reminder';
import ReportPage from './pages/userpage/Report';
import MyRepotPage from './pages/userpage/MyReport';
import Awareness1Page from './pages/userpage/Awareness1';
import Awareness2Page from './pages/userpage/Awareness2';
import Awareness3Page from './pages/userpage/Awareness3';
import ProfilePage from './pages/userpage/Profile';
import PrivacySettingsPage from './pages/userpage/Privacysetting';
import UserLayout from './pages/userpage/Layout';






function App() {
  

  return (
    <> 
    <BrowserRouter>
     <Routes>
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      
      <Route path='/' element= {<HomePage/>}/>
      <Route path='/feature' element= {<FeaturePage/>}/>
      <Route path='/aboutus' element= {<AboutusPage/>}/>
      <Route path='/contact' element= {<ContactPage/>}/>
      {/* <Route path="" element={<UserLayout />} > */}
          <Route path="/user" element={<UserHomePage />} />
          <Route path='/schedule' element= {<SchedulePage/>}/>
          <Route path='/myreport' element= {<MyRepotPage/>}/>
          <Route path='/reminder' element= {<ReminderPage/>}/>
          <Route path='/report' element= {<ReportPage/>}/>
          <Route path='/awareness1' element= {<Awareness1Page/>}/>
          <Route path='/awareness2' element= {<Awareness2Page/>}/>
          <Route path='/awareness3' element= {<Awareness3Page/>}/>
          <Route path='/profile' element= {<ProfilePage/>}/>
          <Route path='/privacy' element= {<PrivacySettingsPage/>}/>
          <Route path='/map' element= {<MapPage/>}/>
      {/* </Route> */}


     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
