import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturedCompanies from '../components/landing/FeaturedCompanies';
import JobCategories from '../components/landing/JobCategories';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import Testimonials from '../components/landing/Testimonials';
import FinalCTA from '../components/landing/FinalCTA';

const LandingPage = () => {
    return (
        <>
            <Navbar variant="landing" />
            <main>
                <HeroSection />
                <StatsSection />
                <FeaturedCompanies />
                <JobCategories />
                <WhyChooseUs />
                <Testimonials />
                <FinalCTA />
            </main>
            <Footer />
        </>
    );
};

export default LandingPage;
