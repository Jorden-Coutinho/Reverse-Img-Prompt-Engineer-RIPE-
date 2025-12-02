import React from 'react';
import { VeoPromptData } from '../types';
import { Copy, Check, Film, User, Zap, MapPin, Palette, Volume2, Ban } from 'lucide-react';

interface PromptResultProps {
  data: VeoPromptData;
}

const Section: React.FC<{ 
  title: string; 
  content: string; 
  icon: React.ReactNode; 
  className?: string 
}> = ({ title, content, icon, className = "" }) => (
  <div className={`p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 ${className}`}>
    <div className="flex items-center gap-2 mb-2 text-veo-300 font-mono text-xs uppercase tracking-widest">
      {icon}
      <span>{title}</span>
    </div>
    <p className="text-zinc-300 text-sm leading-relaxed">{content}</p>
  </div>
);

export const PromptResult: React.FC<PromptResultProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  const fullPrompt = `CINEMATOGRAPHY: ${data.cinematography}\n\nSUBJECT: ${data.subject}\n\nACTION: ${data.action}\n\nCONTEXT & SETTING: ${data.context_setting}\n\nSTYLE & AMBIANCE: ${data.style_ambiance}\n\nAUDIO: ${data.audio}\n\nNEGATIVE PROMPT: ${data.negative_prompt}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white tracking-tight">Generated Veo Prompt</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-veo-100 bg-veo-600/20 hover:bg-veo-600/40 border border-veo-500/30 rounded-md transition-all hover:scale-105 active:scale-95"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Full Prompt'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section 
          title="Cinematography" 
          content={data.cinematography} 
          icon={<Film size={14} />} 
          className="md:col-span-2 bg-gradient-to-br from-zinc-900/80 to-veo-900/10"
        />
        
        <Section 
          title="Subject" 
          content={data.subject} 
          icon={<User size={14} />} 
        />
        
        <Section 
          title="Action" 
          content={data.action} 
          icon={<Zap size={14} />} 
        />
        
        <Section 
          title="Context & Setting" 
          content={data.context_setting} 
          icon={<MapPin size={14} />} 
        />
        
        <Section 
          title="Style & Ambiance" 
          content={data.style_ambiance} 
          icon={<Palette size={14} />} 
        />

        {data.audio && (
          <Section 
            title="Audio" 
            content={data.audio} 
            icon={<Volume2 size={14} />} 
            className="md:col-span-2"
          />
        )}
        
        <Section 
          title="Negative Prompt" 
          content={data.negative_prompt} 
          icon={<Ban size={14} />} 
          className="md:col-span-2 border-red-900/20 bg-red-950/5"
        />
      </div>
    </div>
  );
};
