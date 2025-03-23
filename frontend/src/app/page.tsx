import BudgetCardSection from "@/components/BudgetCardSection";
import Destination from "@/components/DEST-GUIDE/Destination";
import DestinationGuide from "@/components/DEST-GUIDE/DestinationGuide";
import ExplorePage from "@/components/ExplorePage";
import Feedback from "@/components/FEEDBACK/Feedback";
import Footer from "@/components/FOOTER/Footer";
import Footersection from "@/components/Footersection";
import HeroSection from "@/components/Herosection"
import HiddenPlaces from "@/components/HIDDEN_PLACE/HiddenPlaces";
import HolidayBudget from "@/components/HolidayBudget";
import Newspaper from "@/components/NEWSPAPER/Newspaper";
import Reviewsection from "@/components/Reviewsection";
import TripPurpose from "@/components/TripPurpose";
import UniquePlaces from "@/components/UniquePlaces";
import Waterfalls from "@/components/WATERFALLS/Waterfalls";
export default function Home() {
  return (
    <div className="flex flex-col bg-white" >
      <HeroSection />
      {/* <BudgetCardSection /> */}
      <Waterfalls />
      <HiddenPlaces />
      <ExplorePage />
      <UniquePlaces />
      <TripPurpose />
      <HolidayBudget />
      <Newspaper />
      <Destination />
      <DestinationGuide />
      <Feedback />
      {/* <Reviewsection /> */}
      <Footersection />
      {/* <Footer /> */}
    </div>
  );
}