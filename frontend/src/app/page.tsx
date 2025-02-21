import BudgetCardSection from "@/components/BudgetCardSection";
import Destination from "@/components/DEST-GUIDE/Destination";
import DestinationGuide from "@/components/DEST-GUIDE/DestinationGuide";
import ExplorePage from "@/components/ExplorePage";
import Footersection from "@/components/Footersection";
import HeroSection from "@/components/Herosection"
import HolidayBudget from "@/components/HolidayBudget";
import Newspaper from "@/components/NEWSPAPER/Newspaper";
import Reviewsection from "@/components/Reviewsection";
import TripPurpose from "@/components/TripPurpose";
import UniquePlaces from "@/components/UniquePlaces";
export default function Home() {
  return (
    <div className="flex flex-col bg-white" >
      <HeroSection />
      <BudgetCardSection />
      <ExplorePage />
      <UniquePlaces />
      <TripPurpose />
      <HolidayBudget />
      <Newspaper />
      <Destination />
      <DestinationGuide />
      <Reviewsection />
      <Footersection />
    </div>
  );
}