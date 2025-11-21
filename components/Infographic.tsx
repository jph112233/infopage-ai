import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie 
} from 'recharts';
import { Quote, CheckCircle2, Hash, TrendingUp } from 'lucide-react';
import { InfographicData, AppSettings, ColorTheme } from '../types';
import { EditableSection } from './EditableSection';
import { ProsperaLogo } from './ProsperaLogo';

interface InfographicProps {
  data: InfographicData;
  settings?: AppSettings;
  onUpdateSection?: (sectionKey: string, instruction: string) => Promise<void>;
}

interface ThemeConfig {
  primary: string;
  secondary: string;
  surface: string;
  accent: string;
  textMain: string;
  textLight: string;
  chart: string[];
}

const THEMES: Record<ColorTheme, ThemeConfig> = {
  corporate: {
    primary: '#09122B',    // Dark Blue from palette
    secondary: '#14B87C',  // Green from palette
    surface: '#F5F7FA',    // Light gray/blue hint
    accent: '#DCE93B',     // Yellow/Lime from palette
    textMain: '#09122B',
    textLight: '#B1B2C9',  // Faded Blue from palette
    chart: ['#14B87C', '#09122B', '#DCE93B', '#1D2B52', '#6CC852']
  },
  indigo: {
    primary: '#312e81',
    secondary: '#4f46e5',
    surface: '#eef2ff',
    accent: '#818cf8',
    textMain: '#1e1b4b',
    textLight: '#c7d2fe',
    chart: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']
  },
  emerald: {
    primary: '#064e3b',
    secondary: '#10b981',
    surface: '#ecfdf5',
    accent: '#34d399',
    textMain: '#022c22',
    textLight: '#a7f3d0',
    chart: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']
  },
  rose: {
    primary: '#881337',
    secondary: '#f43f5e',
    surface: '#fff1f2',
    accent: '#fb7185',
    textMain: '#4c0519',
    textLight: '#fecdd3',
    chart: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#ffe4e6']
  },
  amber: {
    primary: '#78350f',
    secondary: '#f59e0b',
    surface: '#fffbeb',
    accent: '#fbbf24',
    textMain: '#451a03',
    textLight: '#fde68a',
    chart: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7']
  },
  slate: {
    primary: '#0f172a',
    secondary: '#64748b',
    surface: '#f8fafc',
    accent: '#94a3b8',
    textMain: '#020617',
    textLight: '#cbd5e1',
    chart: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9']
  },
};

export const Infographic: React.FC<InfographicProps> = ({ 
  data, 
  settings, 
  onUpdateSection = async () => {} 
}) => {
  const themeKey = settings?.theme || 'corporate';
  const theme = THEMES[themeKey];

  const style = {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-surface': theme.surface,
    '--theme-accent': theme.accent,
    '--theme-text-main': theme.textMain,
    '--theme-text-light': theme.textLight,
  } as React.CSSProperties;

  return (
    <div 
      className="print-container bg-white w-full max-w-4xl mx-auto shadow-2xl overflow-visible print:shadow-none relative print:max-w-full print:w-[8.5in] print:mx-auto print:p-0"
      style={style}
    >
      {/* Header Section */}
      <header className="bg-[var(--theme-primary)] text-white p-6 print:p-2 print:px-3 text-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <div className="inline-block px-2 py-0.5 mb-1 print:mb-0.5 border border-[var(--theme-text-light)] rounded-full text-xs print:text-[9px] uppercase tracking-widest text-[var(--theme-text-light)]">
            Executive Summary
          </div>
          
          <EditableSection sectionKey="title" onUpdate={onUpdateSection} className="mb-1 print:mb-0.5">
            <h1 className="text-3xl md:text-4xl print:text-xl font-display font-bold leading-tight print:leading-tight">
              {data.title}
            </h1>
          </EditableSection>

          <EditableSection sectionKey="tagline" onUpdate={onUpdateSection}>
            <p className="text-[var(--theme-text-light)] text-lg print:text-xs italic font-light max-w-2xl mx-auto print:mt-0.5">
              {data.tagline}
            </p>
          </EditableSection>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="p-4 md:p-6 print:p-2 print:px-3 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 print:gap-2">
        
        {/* Left Column: Summary & Key Stats */}
        <div className="md:col-span-7 space-y-4 print:space-y-2">
          
          {/* Summary Box */}
          <section>
            <h2 className="text-xs print:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 print:mb-0.5">
              Overview
            </h2>
            <EditableSection sectionKey="summary" onUpdate={onUpdateSection}>
              <p className="text-gray-700 leading-relaxed text-base print:text-xs print:leading-tight">
                {data.summary}
              </p>
            </EditableSection>
          </section>

          {/* Primary Statistic */}
          <EditableSection sectionKey="primaryStat" onUpdate={onUpdateSection}>
            <section className="bg-[var(--theme-surface)] rounded-xl print:rounded-lg p-4 print:p-2 border border-gray-100 transition-colors duration-300">
              <div className="flex items-start justify-between mb-1 print:mb-0.5">
                <div className="p-1.5 print:p-1 bg-white rounded-lg text-[var(--theme-secondary)] shadow-sm">
                  <TrendingUp size={18} className="print:w-3 print:h-3" />
                </div>
                <span className="text-xs print:text-[9px] font-bold text-[var(--theme-secondary)] uppercase tracking-widest">Key Metric</span>
              </div>
              <div className="text-3xl print:text-xl font-bold text-[var(--theme-primary)] mb-1 print:mb-0.5 tracking-tight">
                {data.primaryStat.value}
              </div>
              <div className="text-sm print:text-[10px] text-[var(--theme-text-main)] font-medium opacity-80">
                {data.primaryStat.label}
              </div>
            </section>
          </EditableSection>

          {/* Chart Section */}
          <EditableSection sectionKey="chartData" onUpdate={onUpdateSection}>
            <section className="bg-white rounded-xl print:rounded-lg border border-gray-100 p-4 print:p-2 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-3 print:mb-1.5 text-base print:text-xs flex items-center gap-2">
                 <Hash size={16} className="print:w-3 print:h-3 text-[var(--theme-secondary)]" />
                 {data.chartTitle}
               </h3>
               <div className="h-48 print:h-36 w-full pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  {data.chartType === 'pie' ? (
                     <PieChart>
                      <Pie
                        data={data.chartData}
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={theme.chart[index % theme.chart.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  ) : (
                    <BarChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 9 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 9 }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={theme.chart[index % theme.chart.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
               </div>
            </section>
          </EditableSection>

        </div>

        {/* Right Column: Secondary Stats, List, Quote */}
        <div className="md:col-span-5 space-y-4 print:space-y-2">
          
          {/* Secondary Stats Grid */}
          <EditableSection sectionKey="secondaryStats" onUpdate={onUpdateSection}>
            <div className="grid grid-cols-1 gap-3 print:gap-1.5">
              {data.secondaryStats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50 p-3 print:p-1.5 rounded-lg print:rounded border border-gray-100 hover:border-[var(--theme-secondary)] transition-colors">
                  <div className="text-xl print:text-base font-bold text-gray-900 mb-0.5 print:mb-0">
                    {stat.value}
                  </div>
                  <div className="text-xs print:text-[9px] text-gray-500 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </EditableSection>

          {/* Topics Tags */}
          <EditableSection sectionKey="topics" onUpdate={onUpdateSection}>
            <div className="flex flex-wrap gap-1.5 print:gap-1">
              {data.topics.map((topic, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 print:px-1 print:py-0.5 bg-[var(--theme-surface)] text-[var(--theme-secondary)] text-xs print:text-[9px] font-bold rounded-full"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </EditableSection>

          {/* Key Takeaways */}
          <section>
            <h3 className="text-base print:text-xs font-bold text-gray-900 mb-2 print:mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="print:w-3 print:h-3 text-[var(--theme-secondary)]" />
              Key Takeaways
            </h3>
            <EditableSection sectionKey="keyTakeaways" onUpdate={onUpdateSection}>
              <ul className="space-y-2 print:space-y-0.5">
                {data.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex gap-2 print:gap-1 text-gray-600 text-xs print:text-[9px] leading-relaxed print:leading-tight">
                    <span className="w-1 h-1 print:w-0.5 print:h-0.5 bg-gray-300 rounded-full mt-1.5 print:mt-1 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </EditableSection>
          </section>

          {/* Quote */}
          <EditableSection sectionKey="quote" onUpdate={onUpdateSection}>
            <section className="bg-[var(--theme-primary)] text-white p-4 print:p-2 rounded-lg print:rounded relative overflow-hidden">
              <Quote size={32} className="print:w-5 print:h-5 absolute top-1 left-1 text-white opacity-10" />
              <div className="relative z-10 pt-1 print:pt-0.5">
                <blockquote className="text-sm print:text-[10px] font-serif italic mb-2 print:mb-1 text-gray-100 leading-snug">
                  "{data.quote.text}"
                </blockquote>
                <cite className="block text-right text-xs print:text-[9px] font-bold text-[var(--theme-secondary)] not-italic uppercase tracking-wider">
                  — {data.quote.author}
                </cite>
              </div>
            </section>
          </EditableSection>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 p-3 print:p-1 print:px-2 text-center border-t border-gray-100">
        <ProsperaLogo />
      </footer>
    </div>
  );
};