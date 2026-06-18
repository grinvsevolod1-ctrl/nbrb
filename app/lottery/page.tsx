import GreenCardContest from "@/components/green-card-contest";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Script from "next/script";

export default function LotteryPage() {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <SiteHeader />
      <GreenCardContest />
      <SiteFooter />
    </>
  );
}
