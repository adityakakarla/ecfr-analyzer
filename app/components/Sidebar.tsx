'use client';

import React from 'react';

interface SidebarProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
}

export default function Sidebar({ selectedView, setSelectedView }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview Dashboard' },
    { id: 'agency-metrics', label: 'Agency Metrics' },
    { id: 'historical-changes', label: 'Historical Changes' },
    { id: 'title-structure', label: 'Title Structure' },
    { id: 'word-count', label: 'Word Count Analysis' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">eCFR Analyzer</h2>
      </div>
      
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => setSelectedView(item.id)}
                className={`w-full flex items-center px-4 py-2 text-left ${
                  selectedView === item.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>eCFR Data Visualization</p>
          <p>By Aditya K.</p>
        </div>
      </div>
    </div>
  );
} 