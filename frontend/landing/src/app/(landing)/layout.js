import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar/navbar";

export default function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
