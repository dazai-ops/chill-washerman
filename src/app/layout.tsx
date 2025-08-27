"use client"

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import RehydrateUser from '../redux/utils/rehydrateUser';
import { Toaster } from "sonner";
import ThemeToggel from '../components/layout/ThemeToggle/ThemeToggel';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>  ) {
  const [appearanceApp, setAppearanceApp] = useState("dark");

  useEffect(() => {
    const currentAppearance = localStorage.getItem("appearance");
    if (currentAppearance === "light" || currentAppearance === "dark") {
      setAppearanceApp(currentAppearance);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("appearance", appearanceApp);
  }, [appearanceApp])

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Theme appearance={appearanceApp as "light" | "dark" | "inherit" | undefined}>
            <RehydrateUser />
            {children}
            <ThemeToggel appearance={appearanceApp} setAppearance={setAppearanceApp}/>
            <Toaster richColors position="bottom-right" />
          </Theme>
        </body>
      </html>
    </Provider>
  );
}
