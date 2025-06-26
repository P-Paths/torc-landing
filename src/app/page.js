// src/app/page.js
import HeroSection from '../../components/HeroSections';
import QualificationsSection from '../../components/QualificationsSection';
import TreatmentOptionsSection from '../../components/TreatmentOptionsSection';
import ZoomInviteSection from '../../components/ZoomInviteSection';
import AddictionInfo from '../../components/AddictionInfo';
import GamerTagHelp from '../../components/GamerTagHelp';
import Testimonials from '../../components/Testimonials';
import StepGuide from '../../components/StepGuide';
import Footer from '../../components/Footer';
import CompaniesInLawsuit from '../../components/CompaniesInLawsuit';
import AttorneyIntro from '../../components/AttorneyIntro';

export default function Home() {
  return (
    <main className="bg-white text-black min-h-screen px-6 py-10 font-sans">
  <HeroSection />
  <QualificationsSection />
  <StepGuide /> {/* Signs of addiction + optional ZIP lookup */}
  <ZoomInviteSection /> {/* Need help with Zoom/form */}
  <GamerTagHelp /> {/* Need help finding Gamer Tag */}
  <CompaniesInLawsuit /> {/* Companies in the lawsuit */}
  <Testimonials />
  <AttorneyIntro /> {/* Attorney intro section */}
  <TreatmentOptionsSection /> {/* Treatment resources */}
  <AddictionInfo /> {/* SYMPTOMS */}
  <Footer />

</main>
  );
}

