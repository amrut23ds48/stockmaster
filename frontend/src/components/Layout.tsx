import type { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Header } from "./Header";
import React from "react";
export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />
      <Header />
      <main className="pt-32 px-6 pb-6">
        <div className="max-w-[1920px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
