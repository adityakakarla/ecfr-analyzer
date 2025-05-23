'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Treemap
} from 'recharts';
import { getFullTitleData } from '../../actions';

interface TitleStructureProps {
  selectedTitle: string;
  selectedDate: string;
}

export default function TitleStructure({ selectedTitle, selectedDate }: TitleStructureProps) {
  const [titleData, setTitleData] = useState<any>(null);
  const [hierarchyStats, setHierarchyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTitleData() {
      try {
        setLoading(true);
        
        // Default to current date if not selected
        const date = selectedDate || new Date().toISOString().split('T')[0];
        
        const data = await getFullTitleData(selectedTitle, date);
        
        if (data) {
          setTitleData(data);
          analyzeTitleStructure(data);
        }
      } catch (error) {
        console.error('Error loading title structure data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedTitle && selectedDate) {
      loadTitleData();
    }
  }, [selectedTitle, selectedDate]);

  const analyzeTitleStructure = (data: any) => {
    if (!data || !data.children) return;
    
    // Count items at each hierarchical level
    const hierarchyCounts: Record<string, number> = {
      chapter: 0,
      part: 0,
      section: 0,
      subpart: 0,
      appendix: 0
    };
    
    // Count chapters and their children
    data.children.forEach((chapter: any) => {
      if (chapter.type === 'chapter' && !chapter.reserved) {
        hierarchyCounts.chapter++;
        
        if (chapter.children) {
          chapter.children.forEach((part: any) => {
            if (part.type === 'part' && !part.reserved) {
              hierarchyCounts.part++;
              
              if (part.children) {
                part.children.forEach((section: any) => {
                  if (section.type === 'section' && !section.reserved) {
                    hierarchyCounts.section++;
                  } else if (section.type === 'subpart' && !section.reserved) {
                    hierarchyCounts.subpart++;
                    
                    // Count sections within subparts
                    if (section.children) {
                      section.children.forEach((subpartSection: any) => {
                        if (subpartSection.type === 'section' && !subpartSection.reserved) {
                          hierarchyCounts.section++;
                        } else if (subpartSection.type === 'appendix' && !subpartSection.reserved) {
                          hierarchyCounts.appendix++;
                        }
                      });
                    }
                  } else if (section.type === 'appendix' && !section.reserved) {
                    hierarchyCounts.appendix++;
                  }
                });
              }
            }
          });
        }
      }
    });
    
    // Convert to chart data
    const hierarchyData = Object.entries(hierarchyCounts)
      .filter(([_, count]) => count > 0) // Only include non-zero counts
      .map(([level, count]) => ({
        level: level.charAt(0).toUpperCase() + level.slice(1) + 's',
        count
      }));
    
    setHierarchyStats(hierarchyData);
  };

  // Calculate metrics for title structure
  const calculateStructureMetrics = () => {
    if (!hierarchyStats.length) return { totalItems: 0, depth: 0, sectionsPerPart: 0 };
    
    const totalItems = hierarchyStats.reduce((sum, item) => sum + item.count, 0);
    const hasSections = hierarchyStats.find(item => item.level === 'Sections');
    const hasParts = hierarchyStats.find(item => item.level === 'Parts');
    
    return {
      totalItems,
      depth: hierarchyStats.length,
      sectionsPerPart: hasSections && hasParts && hasParts.count > 0 ? 
        Math.round(hasSections.count / hasParts.count * 10) / 10 : 0
    };
  };

  const metrics = calculateStructureMetrics();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Title {selectedTitle} Structure Analysis
        </h2>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Title {selectedTitle} Structure Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
          <p className="text-sm text-orange-500 dark:text-orange-200">Total Structure Items</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-100">
            {metrics.totalItems.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-teal-50 dark:bg-teal-900 p-4 rounded-lg">
          <p className="text-sm text-teal-500 dark:text-teal-200">Hierarchy Depth</p>
          <p className="text-2xl font-bold text-teal-700 dark:text-teal-100">
            {metrics.depth} levels
          </p>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg">
          <p className="text-sm text-indigo-500 dark:text-indigo-200">Sections per Part</p>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-100">
            {metrics.sectionsPerPart}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hierarchy Composition
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hierarchyStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Count']} />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Count" 
                fill="#82ca9d" 
                label={{ 
                  position: 'top', 
                  formatter: (value: number) => value.toLocaleString() 
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 