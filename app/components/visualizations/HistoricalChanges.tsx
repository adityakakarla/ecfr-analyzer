'use client';

import React, { useState, useEffect } from 'react';
import { 
XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { getSectionData } from '../../actions';

interface HistoricalChangesProps {
  selectedTitle: string;
  selectedDate: string;
}

export default function HistoricalChanges({ selectedTitle, selectedDate }: HistoricalChangesProps) {
  const [versionData, setVersionData] = useState<any[]>([]);
  const [amendmentsByMonth, setAmendmentsByMonth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVersionData() {
      try {
        setLoading(true);
        const data = await getSectionData(selectedTitle);
        
        if (data && data.content_versions) {
          setVersionData(data.content_versions);
          processVersionData(data.content_versions);
        }
      } catch (error) {
        console.error('Error loading version data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedTitle) {
      loadVersionData();
    }
  }, [selectedTitle]);

  const processVersionData = (versions: any[]) => {
    // Group by month and year
    const monthlyData: Record<string, number> = {};
    
    versions.forEach(version => {
      if (version.amendment_date) {
        const date = new Date(version.amendment_date);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
      }
    });
    
    // Convert to array for chart
    const chartData = Object.entries(monthlyData)
      .map(([date, count]) => ({
        date,
        amendments: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    setAmendmentsByMonth(chartData);
  };

  // Calculate trend metrics
  const calculateTrends = () => {
    if (amendmentsByMonth.length < 2) return { trend: 'neutral', percentage: 0 };
    
    const recentMonths = amendmentsByMonth.slice(-6); // Last 6 months
    if (recentMonths.length < 2) return { trend: 'neutral', percentage: 0 };
    
    const firstHalf = recentMonths.slice(0, Math.floor(recentMonths.length / 2));
    const secondHalf = recentMonths.slice(Math.floor(recentMonths.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.amendments, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.amendments, 0) / secondHalf.length;
    
    const percentChange = firstHalfAvg === 0 
      ? secondHalfAvg * 100 
      : ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    return {
      trend: percentChange > 5 ? 'up' : percentChange < -5 ? 'down' : 'neutral',
      percentage: Math.abs(Math.round(percentChange))
    };
  };

  const trend = calculateTrends();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Historical Changes for Title {selectedTitle}
        </h2>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Historical Changes for Title {selectedTitle}
        </h2>
        
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
            Amendment Trend:
          </span>
          <div className={`flex items-center ${
            trend.trend === 'up' 
              ? 'text-green-500' 
              : trend.trend === 'down' 
                ? 'text-red-500' 
                : 'text-gray-500'
          }`}>
            {trend.trend === 'up' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend.trend === 'down' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend.trend === 'neutral' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="ml-1 font-medium">
              {trend.percentage}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Amendments
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={amendmentsByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="amendments" name="Amendments" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 