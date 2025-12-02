import React, { useState } from 'react';
import { UploadedFile, VeoPromptData, AnalysisStatus } from './types';
import { FileUpload } from './components/FileUpload';
import { PromptResult } from './components/PromptResult';
import { analyzeMedia } from './services/geminiService';
import { Sparkles, Aperture, RefreshCw, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [result, setResult] = useState<VeoPromptData | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);

  const handleFileSelect = async (uploadedFile: UploadedFile) => {
    setFile(uploadedFile);
    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);

    try {
      const data = await analyzeMedia(uploadedFile.data, uploadedFile.mimeType);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-veo-500/30">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-veo-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-veo-300 text-xs font-mono tracking-wider mb-2">
            <Sparkles size={12} />
            <span>POWERED BY GOOGLE GEMINI 2.5</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center justify-center gap-4">
            <Aperture className="text-veo-500 w-10 h-10 md:w-12 md:h-12" />
            Veo Reverse Architect
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Upload an image or video to generate a high-fidelity, cinematic prompt optimized for Google Veo creation.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="w-full glass-panel rounded-2xl p-1 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="bg-zinc-950/80 rounded-xl p-6 md:p-8 min-h-[400px] flex flex-col items-center">
            
            {/* Input Section */}
            {status === AnalysisStatus.IDLE && (
              <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500">
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            )}

            {/* Loading Section */}
            {status === AnalysisStatus.ANALYZING && file && (
              <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in duration-500 w-full">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
                   {file.type === 'video' ? (
                    <video src={file.previewUrl} className="w-full h-full object-cover opacity-50" autoPlay muted loop />
                  ) : (
                    <img src={file.previewUrl} alt="Preview" className="w-full h-full object-cover opacity-50" />
                  )}
                  {/* Scanning Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-veo-500/20 to-transparent w-full h-[20%] animate-[scan_2s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-veo-400 animate-spin drop-shadow-[0_0_15px_rgba(77,109,186,0.5)]" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium text-white">Analyzing Cinematography...</h3>
                  <p className="text-zinc-500 text-sm font-mono">Deconstructing light, composition, and subject</p>
                </div>
              </div>
            )}

            {/* Error Section */}
            {status === AnalysisStatus.ERROR && (
               <div className="text-center py-12 space-y-4">
                 <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400 mb-2">
                   <RefreshCw className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-medium text-white">Analysis Failed</h3>
                 <p className="text-zinc-400 max-w-md mx-auto">
                   We couldn't process this file. It might be too large or the format is unsupported.
                 </p>
                 <button 
                  onClick={handleReset}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors mt-4"
                 >
                   Try Again
                 </button>
               </div>
            )}

            {/* Result Section */}
            {status === AnalysisStatus.COMPLETE && result && (
              <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Preview */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-lg overflow-hidden border border-zinc-800 shadow-lg relative group">
                      {file?.type === 'video' ? (
                        <video src={file.previewUrl} className="w-full h-auto" controls />
                      ) : (
                        <img src={file?.previewUrl} alt="Original" className="w-full h-auto" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end p-4">
                         <span className="text-xs font-mono text-zinc-300">SOURCE MEDIA</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleReset}
                      className="w-full py-3 flex items-center justify-center gap-2 border border-zinc-700 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors"
                    >
                      <RefreshCw size={14} />
                      Analyze New Media
                    </button>
                  </div>

                  {/* Right Column: Prompt Data */}
                  <div className="lg:col-span-2">
                    <PromptResult data={result} />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <footer className="mt-12 text-center text-zinc-600 text-sm">
          <p>Strictly adheres to Veo prompting formula.</p>
        </footer>

      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-200%); }
          100% { transform: translateY(600%); }
        }
      `}</style>
    </div>
  );
};

export default App;
