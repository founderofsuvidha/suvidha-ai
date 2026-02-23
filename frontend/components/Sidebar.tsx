import React from 'react';
import { Plus, MessageSquare, Settings, HelpCircle, Code, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-dark-lighter border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Code size={20} className="text-white" />
          </div>
          <a href="/available/"><h1 className="font-bold text-lg tracking-tight text-white">Suvidha<span className="text-primary">AI</span></h1></a>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="w-full flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium text-sm"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-2">Menu</div>
          <a href="/available/">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <LayoutDashboard size={18} className="text-slate-400" /> Dashboard
          </button>
          </a>
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-slate-800/50 text-white rounded-lg transition-colors text-sm font-medium">
            <MessageSquare size={18} className="text-primary" /> AI Chat
          </button>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-6">Recent</div>
          {/* Mock History */}
          <a href="/login/?for=new-account"><button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors text-sm truncate">
            <span className="truncate">Start Your Suvidha</span>
          </button>
          </a>
          <a href="/login/">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors text-sm truncate">
            <span className="truncate">Login</span>
          </button>
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1"><a href="/_author/">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <Settings size={18} /> Settings
          </button></a>
            <a href="/about/contact/">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
              <HelpCircle size={18} /> Help & Support
            </button>
            </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
