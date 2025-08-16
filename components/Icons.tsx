import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const HomeIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const ExamIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const NotesIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
    </svg>
);

export const TableIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="8" y1="7" x2="16" y2="7"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
        <line x1="8" y1="17" x2="16" y2="17"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
    </svg>
);

export const RevisionIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const QuizIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9.5 13.5 1.5 1.5 3.5-3.5"></path>
    </svg>
);

export const ProgressIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
        <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>
);

export const TestbookIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const FormulaIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"></path>
        <path d="M8 9l4 4 4-4"></path>
        <path d="M12 17v-8"></path>
    </svg>
);

export const PuzzleIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M14 7V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
        <path d="M19 12h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2"></path>
        <path d="M5 12h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5"></path>
        <path d="M12 19v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
        <path d="M12 5h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"></path>
    </svg>
);

export const FocusIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="22" y1="12" x2="18" y2="12"></line>
    <line x1="6" y1="12" x2="2" y2="12"></line>
    <line x1="12" y1="6" x2="12" y2="2"></line>
    <line x1="12" y1="22" x2="12" y2="18"></line>
  </svg>
);

export const SunIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export const MoonIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

export const MenuIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export const CloseIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const CameraIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" className="w-5 h-5 mr-2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

export const TextIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M4 7V4h16v3"></path>
        <path d="M9 20h6"></path>
        <path d="M12 4v16"></path>
    </svg>
);

export const ImageIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const MicIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

export const TrashIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 hover:text-red-500">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);