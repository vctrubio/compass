import DeployButton from "@/components/deploy-button";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/navigations/Navbar";
import { Footer } from "@/components/navigations/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Compass - North's School Management System",
  description: "The fastest way to build apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <Navbar />
            {children}
            {/* <Footer /> */}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
