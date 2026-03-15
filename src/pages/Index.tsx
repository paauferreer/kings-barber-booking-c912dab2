import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import HaircutsSection from "@/components/HaircutsSection";
import ReviewsSection from "@/components/ReviewsSection";
import InfoFooter from "@/components/InfoFooter";
import BookingModal from "@/components/BookingModal";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();

  const openBooking = (service?: string) => {
    setPreselectedService(service);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={() => openBooking()} />
      <HeroSection onBookNow={() => openBooking()} />
      <ServicesSection onBookService={(s) => openBooking(s)} />
      <GalleryCarousel />
      <HaircutsSection />
      <ReviewsSection />
      <InfoFooter />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedService={preselectedService}
      />
    </div>
  );
};

export default Index;
