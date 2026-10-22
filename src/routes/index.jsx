import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import RootLayout from '../layouts/RootLayout';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Packages from '../pages/Packages';
import Contact from '../pages/Contact';
import Cab from '../pages/Cab';
import Gallery from '../pages/Gallery';
import NotFound from '../pages/NotFound';

// SEO Landing Pages – Kodaikanal
import KodaiTourPackages from '../pages/LandingPages/KodaiTourPackages';
import KodaiTaxiService from '../pages/LandingPages/KodaiTaxiService';
import KodaiOneWayDrop from '../pages/LandingPages/KodaiOneWayDrop';
import MaduraiToKodaiTaxi from '../pages/LandingPages/MaduraiToKodaiTaxi';
import KodaiSightseeing from '../pages/LandingPages/KodaiSightseeing';
import KodaiTourOperator from '../pages/LandingPages/KodaiTourOperator';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Facing Catalog Website */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="packages" element={<Packages />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cab" element={<Cab />} />
        <Route path="gallery" element={<Gallery />} />

        {/* Kodaikanal SEO Landing Pages */}
        <Route path="kodaikanal-tour-packages" element={<KodaiTourPackages />} />
        <Route path="kodaikanal-taxi-service" element={<KodaiTaxiService />} />
        <Route path="kodaikanal-one-way-drop" element={<KodaiOneWayDrop />} />
        <Route path="madurai-to-kodaikanal-taxi" element={<MaduraiToKodaiTaxi />} />
        <Route path="kodaikanal-sightseeing" element={<KodaiSightseeing />} />
        <Route path="kodaikanal-tour-operator" element={<KodaiTourOperator />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
