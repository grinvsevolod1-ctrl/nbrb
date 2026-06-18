import GreenCardContest from "@/components/green-card-contest";
import Script from "next/script";

export default function LotteryPage() {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <GreenCardContest />
    </>
  );
}
