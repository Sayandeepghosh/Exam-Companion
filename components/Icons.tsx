import React from 'react';

export interface IconProps {
  isActive?: boolean;
  className?: string;
}

const MaterialIcon: React.FC<{ children: string; isActive?: boolean; className?: string; }> = ({ children, isActive, className = '' }) => (
    <span className={`material-symbols-outlined ${isActive ? 'fill' : ''} ${className}`}>
        {children}
    </span>
);

export const HomeIcon = (props: IconProps) => <MaterialIcon {...props}>home</MaterialIcon>;
export const ExamIcon = (props: IconProps) => <MaterialIcon {...props}>article</MaterialIcon>;
export const NotesIcon = (props: IconProps) => <MaterialIcon {...props}>edit_note</MaterialIcon>;
export const TableIcon = (props: IconProps) => <MaterialIcon {...props}>calculate</MaterialIcon>;
export const RevisionIcon = (props: IconProps) => <MaterialIcon {...props}>style</MaterialIcon>;
export const QuizIcon = (props: IconProps) => <MaterialIcon {...props}>quiz</MaterialIcon>;
export const ProgressIcon = (props: IconProps) => <MaterialIcon {...props}>trending_up</MaterialIcon>;
export const TestbookIcon = (props: IconProps) => <MaterialIcon {...props}>school</MaterialIcon>;
export const FormulaIcon = (props: IconProps) => <MaterialIcon {...props}>functions</MaterialIcon>;
export const PuzzleIcon = (props: IconProps) => <MaterialIcon {...props}>extension</MaterialIcon>;
export const FocusIcon = (props: IconProps) => <MaterialIcon {...props}>center_focus_strong</MaterialIcon>;
export const SunIcon = (props: IconProps) => <MaterialIcon {...props}>light_mode</MaterialIcon>;
export const MoonIcon = (props: IconProps) => <MaterialIcon {...props}>dark_mode</MaterialIcon>;
export const MenuIcon = (props: IconProps) => <MaterialIcon {...props}>menu</MaterialIcon>;
export const CloseIcon = (props: IconProps) => <MaterialIcon {...props}>close</MaterialIcon>;
export const CameraIcon = (props: IconProps) => <MaterialIcon {...props}>photo_camera</MaterialIcon>;
export const TextIcon = (props: IconProps) => <MaterialIcon {...props}>title</MaterialIcon>;
export const ImageIcon = (props: IconProps) => <MaterialIcon {...props}>image</MaterialIcon>;
export const MicIcon = (props: IconProps) => <MaterialIcon {...props}>mic</MaterialIcon>;
export const TrashIcon = (props: IconProps) => <MaterialIcon {...props} className="text-on-surface-variant group-hover:text-error dark:group-hover:text-error">delete</MaterialIcon>;