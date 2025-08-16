import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Note, NoteBlock, NoteBlockType } from '../../types';
import Card from '../../components/Card';
import { TextIcon, ImageIcon, MicIcon, CameraIcon, TrashIcon } from '../../components/Icons';

const MasonryLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {React.Children.map(children, child => (
                <div className="mb-4 break-inside-avoid">
                    {child}
                </div>
            ))}
        </div>
    )
};


const NotesScreen: React.FC = () => {
    const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
        setIsCreatingNewNote(false);
    };

    const handleCreateNewNote = () => {
        const newNote: Note = {
            id: Date.now(),
            title: 'New Note',
            blocks: [{ id: Date.now(), type: 'text', content: '' }],
            createdAt: Date.now(),
        };
        setSelectedNote(newNote);
        setIsCreatingNewNote(true);
    };

    const handleSaveNote = (noteToSave: Note) => {
        if (isCreatingNewNote) {
            setNotes(prev => [noteToSave, ...prev]);
        } else {
            setNotes(prev => prev.map(n => n.id === noteToSave.id ? noteToSave : n));
        }
        setSelectedNote(null);
        setIsCreatingNewNote(false);
    };

    const handleDeleteNote = (noteId: number) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(prev => prev.filter(n => n.id !== noteId));
            setSelectedNote(null);
        }
    };

    if (selectedNote) {
        return (
            <NoteEditor 
                note={selectedNote} 
                onSave={handleSaveNote} 
                onDelete={handleDeleteNote}
                onBack={() => setSelectedNote(null)}
            />
        );
    }

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            <h1 className="text-3xl font-bold mb-6">Notes</h1>
            {notes.length > 0 ? (
                <MasonryLayout>
                    {notes.sort((a,b) => b.createdAt - a.createdAt).map(note => (
                        <Card key={note.id} onClick={() => handleSelectNote(note)} variant="outlined" className="cursor-pointer animate-fade-in">
                            <h2 className="font-medium text-lg mb-2">{note.title}</h2>
                            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant line-clamp-6">
                                {note.blocks.find(b => b.type === 'text')?.content || 'Contains media...'}
                            </p>
                            <p className="text-xs text-outline dark:text-dark-outline mt-4">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                        </Card>
                    ))}
                </MasonryLayout>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 dark:text-dark-on-surface-variant/50">lightbulb</span>
                    <h2 className="text-xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant mt-4">No Notes Yet</h2>
                    <p className="text-on-surface-variant/80 dark:text-dark-on-surface-variant/80 mt-1">Tap the '+' button to get started.</p>
                </div>
            )}
            
            <button 
                onClick={handleCreateNewNote} 
                className="fixed bottom-28 right-6 md:bottom-8 md:right-8 bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary w-16 h-16 rounded-2xl shadow-elevation-3 hover:shadow-elevation-4 flex items-center justify-center transition-all transform hover:scale-105"
                aria-label="Create new note"
            >
                <span className="material-symbols-outlined text-4xl">add</span>
            </button>
        </div>
    );
};


const NoteEditor: React.FC<{ note: Note, onSave: (note: Note) => void, onDelete: (noteId: number) => void, onBack: () => void }> = ({ note, onSave, onDelete, onBack }) => {
    const [editedNote, setEditedNote] = useState<Note>(note);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioChunks = useRef<Blob[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    useEffect(() => {
        return () => { 
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const updateBlockContent = (blockId: number, content: string) => {
        setEditedNote(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => b.id === blockId ? { ...b, content } : b)
        }));
    };

    const addBlock = (type: NoteBlockType) => {
        if (type === 'image') {
            imageInputRef.current?.click();
            return;
        }
        const newBlock: NoteBlock = { id: Date.now(), type, content: '' };
        setEditedNote(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    };

    const deleteBlock = (blockId: number) => {
        setEditedNote(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== blockId) }));
    };

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newBlock: NoteBlock = { id: Date.now(), type: 'image', content: reader.result as string };
            setEditedNote(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
        };
        reader.readAsDataURL(file);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setIsCameraOpen(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access camera.");
        }
    };
    
    const handleCapture = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const newBlock: NoteBlock = { id: Date.now(), type: 'image', content: dataUrl };
        setEditedNote(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
        stopCamera();
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };


    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorder?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);
                recorder.ondataavailable = e => audioChunks.current.push(e.data);
                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const newBlock: NoteBlock = { id: Date.now(), type: 'audio', content: reader.result as string };
                        setEditedNote(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
                    };
                    reader.readAsDataURL(audioBlob);
                    audioChunks.current = [];
                    stream.getTracks().forEach(track => track.stop());
                };
                recorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Could not access microphone. Please check permissions.");
            }
        }
    };

    return (
        <div className="animate-fade-in space-y-4 pb-24">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-1 text-primary dark:text-dark-primary font-medium p-2 -ml-2 rounded-full hover:bg-primary-container/50 dark:hover:bg-dark-primary-container/50 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>Back</span>
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => onDelete(note.id)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/50 text-on-surface-variant hover:text-error dark:hover:text-error transition-colors">
                        <TrashIcon />
                    </button>
                    <button onClick={() => onSave(editedNote)} className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium py-2 px-5 rounded-full hover:opacity-90 transition shadow-sm">Save</button>
                </div>
            </div>
            <div className="space-y-4">
                <input
                    type="text"
                    value={editedNote.title}
                    onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Note Title"
                    className="w-full text-2xl font-bold bg-transparent focus:outline-none mb-2"
                />
                <div className="space-y-4">
                    {editedNote.blocks.map(block => (
                        <div key={block.id} className="group relative">
                             <button onClick={() => deleteBlock(block.id)} className="absolute -top-2 -right-2 bg-surface dark:bg-dark-surface p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-outline/20 dark:border-dark-outline/20">
                                <TrashIcon />
                            </button>
                            {block.type === 'text' && (
                                <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                    placeholder="Start typing..."
                                    className="w-full p-3 border-2 border-transparent focus:border-primary dark:focus:border-dark-primary rounded-lg bg-surface-variant/30 dark:bg-dark-surface-variant/30 focus:outline-none min-h-[120px] transition-colors"
                                    rows={5}
                                />
                            )}
                            {block.type === 'image' && <img src={block.content} alt="note content" className="rounded-lg max-w-full h-auto border border-outline/20 dark:border-dark-outline/20" />}
                            {block.type === 'audio' && <audio src={block.content} controls className="w-full" />}
                        </div>
                    ))}
                </div>
            </div>
            
             <div className="fixed bottom-0 left-0 right-0 md:left-80 z-10 p-2">
                <div className="bg-surface/90 dark:bg-dark-surface/90 backdrop-blur-lg rounded-2xl shadow-lg border border-outline/20 dark:border-dark-outline/20 max-w-md mx-auto">
                     <div className="flex items-center justify-around p-1">
                        <button onClick={() => addBlock('text')} className="flex flex-col items-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl transition-colors"><TextIcon /><span className="text-xs mt-1">Text</span></button>
                        <button onClick={() => addBlock('image')} className="flex flex-col items-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl transition-colors"><ImageIcon /><span className="text-xs mt-1">Upload</span></button>
                         <button onClick={startCamera} className="flex flex-col items-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl transition-colors"><CameraIcon /><span className="text-xs mt-1">Camera</span></button>
                        <button onClick={toggleRecording} className={`flex flex-col items-center hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl transition-colors ${isRecording ? 'text-error' : 'text-on-surface-variant dark:text-dark-on-surface-variant'}`}><MicIcon /><span className="text-xs mt-1">{isRecording ? 'Stop' : 'Record'}</span></button>
                     </div>
                </div>
            </div>
            
            <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="hidden" />
            
            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl h-auto rounded-lg mb-6" />
                    <div className="flex space-x-4">
                        <button onClick={handleCapture} className="bg-primary text-on-primary font-bold py-3 px-6 rounded-full">Capture</button>
                        <button onClick={stopCamera} className="bg-secondary text-on-secondary font-bold py-3 px-6 rounded-full">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default NotesScreen;