import BudgetCardSection from "@/components/BudgetCardSection";
import Footersection from "@/components/Footersection";
import HeroSection from "@/components/Herosection"
import Reviewsection from "@/components/Reviewsection";
export default function Home() {
  return (
  <div className="flex flex-col bg-white" >
   <HeroSection />
   <BudgetCardSection />
   <Reviewsection />
   <Footersection />
  </div>
  );
}