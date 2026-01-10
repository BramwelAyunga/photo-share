import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaTimes, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const MediaUploadPage = () => {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [peopleInput, setPeopleInput] = useState('');
    const [people, setPeople] = useState([]);
    const [visibility, setVisibility] = useState('public');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (formData) => {
            return axios.post('/api/media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: (data) => {
            navigate(`/media/${data.data.id}`);
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Upload failed');
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    const addPerson = () => {
        if (peopleInput.trim() && !people.includes(peopleInput.trim())) {
            setPeople([...people, peopleInput.trim()]);
            setPeopleInput('');
        }
    };

    const removePerson = (personToRemove) => {
        setPeople(people.filter(p => p !== personToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPerson();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!image) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('caption', caption);
        formData.append('location', location);
        formData.append('people', JSON.stringify(people));
        formData.append('visibility', visibility);
        formData.append('image', image);

        mutation.mutate(formData);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold dark:text-white">Create New Post</h1>
                <span className="text-sm text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    Creator Mode
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Area */}
                <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                        dragActive 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {preview ? (
                        <div className="relative">
                            <img src={preview} alt="Preview" className="max-h-80 mx-auto rounded-lg"/>
                            <button 
                                type="button"
                                onClick={() => { setImage(null); setPreview(null); }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <div className="py-8">
                            <FaCamera className="text-5xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop your image here</p>
                            <p className="text-gray-400 text-sm mb-4">or</p>
                            <label className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
                                Select Image
                                <input 
                                    type="file" 
                                    onChange={handleImageChange} 
                                    accept="image/*" 
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        placeholder="Give your photo a title" 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Caption */}
                <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Caption
                    </label>
                    <textarea 
                        id="caption" 
                        value={caption} 
                        onChange={(e) => setCaption(e.target.value)} 
                        rows="3" 
                        placeholder="Write a caption for your photo..." 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaMapMarkerAlt className="inline mr-1" /> Location
                    </label>
                    <input 
                        type="text" 
                        id="location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="Where was this photo taken?" 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* People Present */}
                <div>
                    <label htmlFor="people" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaUsers className="inline mr-1" /> People Present
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text" 
                            id="people" 
                            value={peopleInput} 
                            onChange={(e) => setPeopleInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Tag people in this photo" 
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                            type="button" 
                            onClick={addPerson}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    {people.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {people.map((person, index) => (
                                <span 
                                    key={index} 
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                                >
                                    {person}
                                    <button 
                                        type="button" 
                                        onClick={() => removePerson(person)}
                                        className="hover:text-red-500"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Visibility */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Visibility
                    </label>
                    <div className="flex gap-4">
                        <label className={`flex-1 cursor-pointer p-4 border rounded-lg text-center transition-colors ${
                            visibility === 'public' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                        }`}>
                            <input 
                                type="radio" 
                                name="visibility" 
                                value="public" 
                                checked={visibility === 'public'}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="hidden"
                            />
                            <span className="block text-2xl mb-1">🌍</span>
                            <span className="font-medium">Public</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anyone can view</p>
                        </label>
                        <label className={`flex-1 cursor-pointer p-4 border rounded-lg text-center transition-colors ${
                            visibility === 'private' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                        }`}>
                            <input 
                                type="radio" 
                                name="visibility" 
                                value="private" 
                                checked={visibility === 'private'}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="hidden"
                            />
                            <span className="block text-2xl mb-1">🔒</span>
                            <span className="font-medium">Private</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only you can view</p>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={mutation.isPending || !image} 
                    className="w-full py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Uploading...
                        </span>
                    ) : (
                        'Share Photo'
                    )}
                </button>
            </form>
        </div>
    );
};

export default MediaUploadPage;
