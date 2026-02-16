import React from 'react';
import "../../styles/ImageUpload.css";

export default function ImageUpload({ selectFeature }) {
    
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        
        if (file && file.type.startsWith("image/")) {
            // Create a temporary local URL for the file
            const imgUrl = URL.createObjectURL(file);

            // Add it to your stickers array
            selectFeature(prev => ({
                ...prev,
                stickers: [
                    ...prev.stickers,
                    { 
                        url: imgUrl, 
                        x: 50, 
                        y: 50, 
                        width: 150, 
                        height: 150,
                        isUserUploaded: true // Helpful for later filtering
                    }
                ]
            }));
        }
    };

    return (
        <div className="UploadContainer">
            <label className="CustomUploadBtn">
                <span>Click to Upload Photo</span>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    hidden 
                />
            </label>
            <p>Supported: JPG, PNG, WEBP</p>
        </div>
    );
}