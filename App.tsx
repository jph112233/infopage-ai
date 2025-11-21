import React, { useState } from 'react';
import { AppState, InfographicData, AppSettings, InfographicType } from './types';
import { analyzeDocument, updateInfographicSection, DEFAULT_PROMPTS, DEFAULT_MODEL, SCHEMA_PROPERTIES } from './services/openRouterService';
import { FileUpload } from './components/FileUpload';
import { LoadingScreen } from './components/LoadingScreen';
import { Infographic } from './components/Infographic';
import { SettingsPage } from './components/SettingsPage';
import { Layout, ArrowLeft, Printer, Download, Settings, FileText, DollarSign, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  // Store previous state to return to it from settings
  const [previousState, setPreviousState] = useState<AppState>(AppState.UPLOAD);
  
  const [data, setData] = useState<InfographicData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>({ 
    theme: 'corporate',
    model: DEFAULT_MODEL,
    prompts: { ...DEFAULT_PROMPTS }
  });

  const [selectedType, setSelectedType] = useState<InfographicType>('informational');

  const handleFileSelect = async (fileData: { base64: string, mimeType: string }) => {
    setState(AppState.ANALYZING);
    setError(null);
    try {
      // Get the prompt text based on the selected type from the main page
      const activePrompt = settings.prompts[selectedType];
      const result = await analyzeDocument(fileData.base64, fileData.mimeType, settings.model, activePrompt);
      setData(result);
      setState(AppState.RESULT);
    } catch (e) {
      console.error("Document analysis error:", e);
      const errorMessage = e instanceof Error ? e.message : "Failed to analyze the document. Please try again or use a different file.";
      setError(errorMessage);
      setState(AppState.ERROR);
    }
  };

  const handleSectionUpdate = async (sectionKey: string, instruction: string) => {
    if (!data) return;

    // Find current content for context
    const currentContent = (data as any)[sectionKey];

    try {
      const updatedContent = await updateInfographicSection(
        sectionKey as keyof typeof SCHEMA_PROPERTIES,
        currentContent,
        instruction,
        settings.model
      );

      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [sectionKey]: updatedContent
        };
      });
    } catch (e) {
      console.error("Failed to update section:", e);
      alert("Failed to update section. Please try again.");
    }
  };

  const handleReset = () => {
    setState(AppState.UPLOAD);
    setData(null);
    setError(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const openSettings = () => {
    if (state === AppState.SETTINGS) return;
    setPreviousState(state);
    setState(AppState.SETTINGS);
  };

  const closeSettings = () => {
    setState(previousState);
  };

  const TYPE_OPTIONS = [
    { id: 'informational', label: 'Informational', icon: FileText, desc: 'Facts, summaries & standard metrics' },
    { id: 'selling', label: 'Selling', icon: DollarSign, desc: 'Benefits, ROI & persuasive stats' },
    { id: 'project_wrapup', label: 'Project Wrapup', icon: Briefcase, desc: 'Outcomes, timelines & deliverables' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - Hidden in print */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-indigo-600 cursor-pointer" 
            onClick={() => {
                if (state === AppState.SETTINGS) closeSettings();
                else if (state === AppState.RESULT) handleReset();
                else if (state === AppState.ERROR) handleReset();
            }}
          >
            <Layout className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Infographify</span>
          </div>
          
          <div className="flex items-center gap-3">
            {state === AppState.RESULT && (
              <>
                <button 
                  onClick={handleReset}
                  className="hidden sm:block text-sm text-gray-500 hover:text-gray-800 font-medium px-3 py-2 transition-colors"
                >
                  New Upload
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <Printer size={16} />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>
              </>
            )}
            
            {state !== AppState.SETTINGS && state !== AppState.ANALYZING && (
              <button
                onClick={openSettings}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Settings"
              >
                <Settings size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 md:px-6 bg-gray-50/50">
        <div className="max-w-5xl mx-auto w-full">
          
          {state === AppState.SETTINGS && (
            <SettingsPage 
              settings={settings} 
              onSave={setSettings} 
              onBack={closeSettings} 
            />
          )}

          {state === AppState.UPLOAD && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
              <div className="text-center mb-10 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Turn PDFs into <span className={`text-${settings.theme === 'corporate' ? 'indigo' : settings.theme}-600 transition-colors duration-300`}>Visual Stories</span>
                </h1>
                <p className="text-xl text-gray-500">
                  Select your infographic style and upload a document.
                </p>
              </div>

              {/* Style Selector */}
              <div className="w-full max-w-3xl mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedType === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedType(option.id as InfographicType)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                          : 'border-white bg-white hover:border-gray-200 shadow-sm'
                      }`}
                    >
                      <div className={`p-3 rounded-full mb-3 ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{option.label}</span>
                      <span className="text-xs text-gray-500 text-center mt-1">{option.desc}</span>
                    </button>
                  );
                })}
              </div>

              <FileUpload onFileSelect={handleFileSelect} />
              
              {/* Demo Tags */}
              <div className="mt-12 flex gap-4 text-sm text-gray-400">
                <span>Research Papers</span>
                <span>•</span>
                <span>Annual Reports</span>
                <span>•</span>
                <span>Case Studies</span>
              </div>
            </div>
          )}

          {state === AppState.ANALYZING && (
            <LoadingScreen />
          )}

          {state === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
               <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                 <Layout size={32} className="transform rotate-12" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h3>
               <p className="text-gray-600 mb-6 max-w-md">{error}</p>
               <button 
                 onClick={handleReset}
                 className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-all"
               >
                 <ArrowLeft size={18} />
                 Try Again
               </button>
            </div>
          )}

          {state === AppState.RESULT && data && (
            <div className="animate-fade-in">
              <Infographic 
                data={data} 
                settings={settings} 
                onUpdateSection={handleSectionUpdate}
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;