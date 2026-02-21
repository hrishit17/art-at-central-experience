import Hero from "@/components/home/Hero";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import HorizontalGallery from "@/components/home/HorizontalGallery";
import ArtistOfMonth from "@/components/home/ArtistOfMonth";
import KineticTypography from "@/components/home/KineticTypography";
import EnquiryForm from "@/components/home/EnquiryForm";

const Index = () => {
  return (
    <>
      <Hero />
      <UpcomingEvents />
      <HorizontalGallery />
      <ArtistOfMonth />
      <KineticTypography />
      <EnquiryForm />
    </>
  );
};

export default Index;
