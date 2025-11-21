import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Check, Edit3 } from 'lucide-react';

interface EditableSectionProps {
  sectionKey: string;
  onUpdate: (key: string, instruction: string) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const EditableSection: React.FC<EditableSectionProps> = ({ 
  sectionKey, 
  onUpdate, 
  children,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    if (!instruction.trim()) return;
    
    setIsLoading(true);
    try {
      await onUpdate(sectionKey, instruction);
      setIsEditing(false);
      setInstruction('');
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const corporateTheme = {
    primary: '#09122B',
    secondary: '#14B87C',
    surface: '#F5F7FA',
  };

  return (
    <div 
      className={`relative group rounded-lg transition-all duration-200 ${isEditing ? 'ring-2 z-20' : 'hover:ring-2'} ${className}`}
      style={isEditing ? {
        boxShadow: `0 0 0 2px ${corporateTheme.primary}`,
      } : {}}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (!isEditing) {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${corporateTheme.primary}50`;
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (!isEditing) {
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Content */}
      <div className={isEditing ? 'opacity-50 blur-[1px] pointer-events-none' : ''}>
        {children}
      </div>

      {/* Edit Trigger Button */}
      {!isEditing && isHovered && (
        <div className="absolute -top-3 -right-3 z-10 animate-fade-in no-print">
          <button 
            onClick={() => setIsEditing(true)}
            className="text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all"
            style={{ backgroundColor: corporateTheme.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0a1a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = corporateTheme.primary;
            }}
            title="AI Edit this section"
          >
            <Edit3 size={14} />
          </button>
        </div>
      )}

      {/* Editing Popup */}
      {isEditing && (
        <div 
          className="absolute top-0 left-full ml-4 w-72 bg-white rounded-xl shadow-2xl border p-4 z-30 animate-fade-in-up no-print"
          style={{ borderColor: corporateTheme.surface }}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: corporateTheme.primary }}>
              <Sparkles size={14} style={{ color: corporateTheme.primary }} />
              Edit with AI
            </h4>
            <button 
              onClick={() => {
                setIsEditing(false);
                setInstruction('');
              }}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={16} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">
            Describe how you want to change this section (e.g., "Make it punchier," "Focus on growth," "Fix the typo").
          </p>

          <textarea
            ref={textareaRef}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Instructions..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 outline-none resize-none h-24"
            style={{
              focusRingColor: corporateTheme.primary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = corporateTheme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${corporateTheme.primary}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading || !instruction.trim()}
            className="w-full py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            style={{ backgroundColor: corporateTheme.primary }}
            onMouseEnter={(e) => {
              if (!isLoading && instruction.trim()) {
                e.currentTarget.style.backgroundColor = '#0a1a3a';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = corporateTheme.primary;
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check size={16} />
                Regenerate
              </>
            )}
          </button>
          
          {/* Little triangle pointer pointing left to the content */}
          <div 
            className="absolute top-6 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b"
            style={{ borderColor: corporateTheme.surface }}
          ></div>
        </div>
      )}
    </div>
  );
};