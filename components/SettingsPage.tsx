import React, { useState } from 'react';
import { ArrowLeft, Bot, Cpu, RotateCcw, Info, FileText, DollarSign, Briefcase } from 'lucide-react';
import { AppSettings, InfographicType } from '../types';
import { DEFAULT_PROMPTS } from '../services/openRouterService';

interface SettingsPageProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onBack: () => void;
}

const AI_MODELS = [
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Balanced speed and quality (Default)' },
  { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', desc: 'Fastest response, lightweight' },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Highest reasoning capability' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<InfographicType>('informational');
  
  const handleChange = (key: keyof AppSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  const handlePromptChange = (type: InfographicType, text: string) => {
    onSave({
      ...settings,
      prompts: {
        ...settings.prompts,
        [type]: text
      }
    });
  };

  const resetPrompt = (type: InfographicType) => {
    handlePromptChange(type, DEFAULT_PROMPTS[type]);
  };

  const TABS = [
    { id: 'informational', label: 'Informational', icon: FileText },
    { id: 'selling', label: 'Selling', icon: DollarSign },
    { id: 'project_wrapup', label: 'Project Wrapup', icon: Briefcase },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* AI Configuration Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#09122B15', color: '#09122B' }}>
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Model Configuration</h2>
                <p className="text-gray-500 text-sm">Select the intelligence engine</p>
              </div>
            </div>

            <div className="space-y-4">
              {AI_MODELS.map((model) => (
                <label 
                  key={model.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.model === model.id 
                      ? '' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  style={settings.model === model.id ? {
                    borderColor: '#09122B',
                    backgroundColor: '#09122B0D'
                  } : {}}
                >
                  <div className="pt-1">
                    <input 
                      type="radio" 
                      name="aiModel" 
                      value={model.id}
                      checked={settings.model === model.id}
                      onChange={() => handleChange('model', model.id)}
                      className="w-5 h-5 border-gray-300"
                      style={{
                        accentColor: '#09122B',
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">System Prompts</h2>
                <p className="text-gray-500 text-xs">Configure instructions for each mode</p>
              </div>
            </div>

            {/* Prompt Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as InfographicType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                  Editing: {TABS.find(t => t.id === activeTab)?.label} Prompt
                </span>
                <button 
                  onClick={() => resetPrompt(activeTab)}
                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
                  title="Reset to default"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>

              <textarea 
                value={settings.prompts[activeTab]}
                onChange={(e) => handlePromptChange(activeTab, e.target.value)}
                className="w-full h-64 p-4 rounded-xl border border-gray-200 font-mono text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
              />
              <p className="mt-2 text-xs text-gray-400">
                Ensure strict JSON schema rules are maintained to prevent errors.
              </p>
            </div>
          </div>
        </div>

        {/* AI Usage Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Info size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">When is the AI used?</h2>
                <p className="text-gray-500 text-sm">Understanding the generation pipeline</p>
              </div>
            </div>

            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 py-2">
              {[
                { title: '1. Document Analysis', desc: 'The AI reads the raw text from your uploaded PDF to understand context, tone, and structure.' },
                { title: '2. Statistical Extraction', desc: 'It identifies numerical data points, distinguishing between primary metrics and supporting figures.' },
                { title: '3. Summarization', desc: 'Complex paragraphs are condensed into a concise executive summary and punchy bullet points.' },
                { title: '4. Data Structuring', desc: 'The unstructured text is converted into a strict JSON format that our visualization engine can render.' }
              ].map((step, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-100 border-2 border-green-500"></div>
                  <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
        </div>

        <div className="flex justify-end sticky bottom-6">
           <button 
             onClick={onBack}
             className="shadow-lg px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95"
           >
             Save & Close
           </button>
        </div>

      </div>
    </div>
  );
};