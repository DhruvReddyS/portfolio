import type { Metadata } from "next";
import PortfolioExperience from "./portfolio-experience";

export const metadata: Metadata = {
  title: "Dhruv Reddy — Cloud Nine Portfolio",
  description:
    "Enter Dhruv Reddy’s Cloud Nine—a cinematic journey through full-stack products, applied AI systems, data work, and real-world engineering.",
};

export default function Home() {
  return <PortfolioExperience />;
}
