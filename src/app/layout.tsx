"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import RehydrateUser from '../redux/utils/rehydrateUser';
import { Toaster } from "sonner";

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
}>) {

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Theme appearance="dark">
            <RehydrateUser />
            {children}
            <Toaster richColors position="bottom-right" />
          </Theme>
        </body>
      </html>
    </Provider>
  );
}
