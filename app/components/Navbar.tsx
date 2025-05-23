'use client';

import React, { useEffect, useState } from 'react';
import { getTitles } from '../actions';

interface NavbarProps {
  selectedTitle: string;
  setSelectedTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function Navbar({ 
  selectedTitle, 
  setSelectedTitle, 
  selectedDate, 
  setSelectedDate 
}: NavbarProps) {
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTitles() {
      try {
        const data = await getTitles();
        setTitles(data.titles || []);
        // Set default date to the latest date from the first title
        if (data.titles && data.titles.length > 0 && !selectedDate) {
          setSelectedDate(data.titles[0].latest_amended_on || '');
        }
      } catch (error) {
        console.error('Error loading titles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTitles();
  }, [setSelectedDate, selectedDate]);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          eCFR Data Visualization Dashboard
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {!loading && (
            <>
              <div className="flex items-center">
                <label htmlFor="title-select" className="block mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title:
                </label>
                <select
                  id="title-select"
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {titles.map((title) => (
                    <option key={title.number} value={title.number}>
                      Title {title.number} - {title.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 