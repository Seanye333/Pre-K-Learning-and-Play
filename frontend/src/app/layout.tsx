import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";

export const metadata: Metadata = {
  title: "Pre-K Learning Fun!",
  description: "A safe, fun learning platform for young children",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pre-K Learning",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // fills notch/home-bar area on iPad
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden">
      <body className="h-full w-full overflow-hidden font-nunito">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
