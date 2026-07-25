import type { Metadata } from "next";
import PortfolioExperience from "./portfolio-experience";

export const metadata: Metadata = {
  title: "Dhruv Reddy — Full-stack & AI Engineer",
  description:
    "Dhruv Reddy builds production-grade full-stack platforms, applied AI systems, and data products from Hyderabad, India.",
};

export default function Home() {
  return <PortfolioExperience />;
}
