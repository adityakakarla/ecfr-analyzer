'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AgencyMetrics from './visualizations/AgencyMetrics';
import HistoricalChanges from './visualizations/HistoricalChanges';
import TitleStructure from './visualizations/TitleStructure';
import WordCountAnalysis from './visualizations/WordCountAnalysis';

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTitle, setSelectedTitle] = useState('1');
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          selectedTitle={selectedTitle}
          setSelectedTitle={setSelectedTitle}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedView === 'overview' && (
              <>
                <AgencyMetrics selectedTitle={selectedTitle} />
                <HistoricalChanges 
                  selectedTitle={selectedTitle}
                  selectedDate={selectedDate} 
                />
                <TitleStructure 
                  selectedTitle={selectedTitle}
                  selectedDate={selectedDate} 
                />
                <WordCountAnalysis 
                  selectedTitle={selectedTitle}
                  selectedDate={selectedDate} 
                />
              </>
            )}
            
            {selectedView === 'agency-metrics' && (
              <div className="col-span-2">
                <AgencyMetrics selectedTitle={selectedTitle} />
              </div>
            )}
            
            {selectedView === 'historical-changes' && (
              <div className="col-span-2">
                <HistoricalChanges 
                  selectedTitle={selectedTitle}
                  selectedDate={selectedDate} 
                />
              </div>
            )}
            
            {selectedView === 'title-structure' && (
              <div className="col-span-2">
                <TitleStructure 
                  selectedTitle={selectedTitle}
                  selectedDate={selectedDate} 
                />
              </div>
            )}
            
            {selectedView === 'word-count' && (
              <div className="col-span-2">
                <WordCountAnalysis 
                  selectedTitle={selectedTitle}
                  selectedDate={selectedDate} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 