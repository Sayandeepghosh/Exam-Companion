import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Note, NoteBlock, NoteBlockType } from '../../types';
import Card from '../../components/Card';
import { TextIcon, ImageIcon, MicIcon, CameraIcon, TrashIcon } from '../../components/Icons';

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Notes</h1>
                <button onClick={handleCreateNewNote} className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium py-2.5 px-6 rounded-2xl hover:opacity-90 transition">
                    New Note
                </button>
            </div>
            {notes.length > 0 ? (
                <div className="space-y-4">
                    {notes.sort((a,b) => b.createdAt - a.createdAt).map(note => (
                        <Card key={note.id} onClick={() => handleSelectNote(note)} className="cursor-pointer">
                            <h2 className="font-medium text-lg truncate">{note.title}</h2>
                            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant">No Notes Yet</h2>
                    <p className="text-on-surface-variant/80 dark:text-dark-on-surface-variant/80 mt-2">Tap 'New Note' to get started.</p>
                </div>
            )}
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
        return () => { // Cleanup camera stream
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
        <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-primary dark:text-dark-primary font-medium">&larr; Back to Notes</button>
                <button onClick={() => onSave(editedNote)} className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium py-2 px-4 rounded-full hover:opacity-90 transition">Save</button>
            </div>
            <Card className="!p-0">
                <div className="p-4">
                    <input
                        type="text"
                        value={editedNote.title}
                        onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Note Title"
                        className="w-full text-2xl font-bold bg-transparent focus:outline-none mb-4 pb-2 border-b border-outline/30 dark:border-dark-outline/30"
                    />
                    <div className="space-y-4">
                        {editedNote.blocks.map(block => (
                            <div key={block.id} className="group relative">
                                 <button onClick={() => deleteBlock(block.id)} className="absolute -top-2 -right-2 bg-surface dark:bg-dark-surface p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon />
                                </button>
                                {block.type === 'text' && (
                                    <textarea
                                        value={block.content}
                                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                        placeholder="Start typing..."
                                        className="w-full p-2 border border-transparent focus:border-outline dark:focus:border-dark-outline rounded-md bg-surface-variant/30 dark:bg-dark-surface-variant/30 focus:outline-none min-h-[100px]"
                                    />
                                )}
                                {block.type === 'image' && <img src={block.content} alt="note content" className="rounded-lg max-w-full h-auto" />}
                                {block.type === 'audio' && <audio src={block.content} controls className="w-full" />}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
             <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10">
                <div className="bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg rounded-2xl shadow-lg border border-outline/20 dark:border-dark-outline/20">
                     <div className="flex items-center justify-around p-2">
                        <button onClick={() => addBlock('text')} className="flex flex-col items-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl"><TextIcon /><span className="text-xs mt-1">Text</span></button>
                        <button onClick={() => addBlock('image')} className="flex flex-col items-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl"><ImageIcon /><span className="text-xs mt-1">Upload</span></button>
                         <button onClick={startCamera} className="flex flex-col items-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl"><CameraIcon /><span className="text-xs mt-1">Camera</span></button>
                        <button onClick={toggleRecording} className={`flex flex-col items-center hover:text-primary dark:hover:text-dark-primary w-16 h-16 justify-center rounded-xl ${isRecording ? 'text-error' : 'text-on-surface-variant dark:text-dark-on-surface-variant'}`}><MicIcon /><span className="text-xs mt-1">{isRecording ? 'Stop' : 'Record'}</span></button>
                     </div>
                </div>
            </div>
            <button onClick={() => onDelete(note.id)} className="w-full text-center text-sm text-error hover:underline pt-4">
                Delete Note
            </button>
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
