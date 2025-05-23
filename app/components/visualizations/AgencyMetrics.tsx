'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getAgencyData, getFullTitleData } from '../../actions';

// Mock word count data - In a real application, we would calculate this from actual content
const mockAgencyWordCounts: Record<string, number> = {
  "USDA": 42500,
  "DOJ": 38200,
  "DOD": 35700,
  "HHS": 32100,
  "DHS": 28400,
  "DOT": 26800,
  "DOL": 24200,
  "EPA": 21600,
  "DOE": 18900,
  "DOI": 17300,
  "TREAS": 15800,
  "ED": 14200,
  "HUD": 12500,
  "VA": 9800,
  "SBA": 7300,
};

interface AgencyMetricsProps {
  selectedTitle?: string;
}

export default function AgencyMetrics({ selectedTitle = "1" }: AgencyMetricsProps) {
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [agencyWordCountData, setAgencyWordCountData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgencyData() {
      try {
        setLoading(true);
        const data = await getAgencyData();
        
        if (data && data.agencies) {
          setAgencyData(data.agencies);
          
          // Process data for word count visualization
          processAgencyData(data.agencies, selectedTitle);
        }
      } catch (error) {
        console.error('Error loading agency data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAgencyData();
  }, [selectedTitle]);

  const processAgencyData = (agencies: any[], titleId: string) => {
    // In a real application, we would:
    // 1. Get full title data with text content
    // 2. Extract agencies referenced in that title
    // 3. Count words from sections regulated by each agency
    
    // For now, we'll use mock data
    const relevantAgencies = agencies
      .filter(agency => 
        agency.cfr_references && 
        agency.cfr_references.some((ref: any) => ref.title.toString() === titleId)
      )
      .map(agency => {
        const shortName = agency.short_name as string || agency.name as string;
        return {
          name: shortName,
          // Generate a "realistic" word count based on our mock data and title number
          wordCount: mockAgencyWordCounts[shortName] ? 
            Math.round(mockAgencyWordCounts[shortName] * (parseInt(titleId) % 5 + 0.8)) : 
            Math.round(Math.random() * 15000 + 5000)
        };
      })
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, 15); // Top 15 agencies by word count
    
    setAgencyWordCountData(relevantAgencies);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Agency Word Count for Title {selectedTitle}
        </h2>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Agency Word Count for Title {selectedTitle}
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This chart shows the estimated total word count of regulations from each agency for Title {selectedTitle}.
        </p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={agencyWordCountData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString()} words`, 'Word Count']} 
            />
            <Legend />
            <Bar 
              dataKey="wordCount" 
              name="Word Count" 
              fill="#8884d8" 
              label={{ position: 'right', formatter: (value: number) => value.toLocaleString() }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 