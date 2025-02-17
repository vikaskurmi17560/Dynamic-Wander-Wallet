import BudgetCardSection from "@/components/BudgetCardSection";
import ExplorePage from "@/components/ExplorePage";
import Footersection from "@/components/Footersection";
import HeroSection from "@/components/Herosection"
import Reviewsection from "@/components/Reviewsection";
import UniquePlaces from "@/components/UniquePlaces";
export default function Home() {
  return (
  <div className="flex flex-col bg-white" >
   <HeroSection />
   <BudgetCardSection />
   <ExplorePage/>
   <UniquePlaces/>
   <Reviewsection />
   <Footersection />
  </div>
  );
}