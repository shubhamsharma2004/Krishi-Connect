// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white/90 border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center items-center text-sm flex-wrap gap-3 text-gray-700">
        <span>© {new Date().getFullYear()} KrishiConnect — All rights reserved</span>
        <span className="text-gray-400">|</span>
        <span>Made with <span className="text-red-500">♥</span> for farmers</span>
        <span className="text-gray-400">|</span>
        <span className="font-semibold">Developed by Shubham Kumar</span>
      </div>
    </footer>
  );
}
