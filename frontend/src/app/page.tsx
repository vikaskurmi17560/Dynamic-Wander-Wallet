import BudgetCardSection from "@/components/BudgetCardSection";
import ExplorePage from "@/components/ExplorePage";
import Footersection from "@/components/Footersection";
import HeroSection from "@/components/Herosection"
import HolidayBudget from "@/components/HolidayBudget";
import Reviewsection from "@/components/Reviewsection";
import TripPurpose from "@/components/TripPurpose";
import UniquePlaces from "@/components/UniquePlaces";
export default function Home() {
  return (
  <div className="flex flex-col bg-white" >
   <HeroSection />
   <BudgetCardSection />
   <ExplorePage/>
   <UniquePlaces/>
   <TripPurpose/>
   <HolidayBudget/>
   <Reviewsection />
   <Footersection />
  </div>
  );
}