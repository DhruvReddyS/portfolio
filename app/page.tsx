import type { Metadata } from "next";
import PortfolioExperience from "./portfolio-experience";

export const metadata: Metadata = {
  title: "The Build Log",
  description:
    "Dhruv Reddy builds production full-stack platforms and applied AI systems from Hyderabad. Five internships, six platforms, two competitions won, logged entry by entry.",
};

export default function Home() {
  return <PortfolioExperience />;
}
