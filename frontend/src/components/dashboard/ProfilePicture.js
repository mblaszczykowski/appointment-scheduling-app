import React, {useEffect, useRef, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import {deepOrange} from '@mui/material/colors';

export default function ProfilePicture({firstName, lastName, onProfilePictureChange, profilePicture}) {
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);
    useEffect(() => {
        if (!previewUrl && profilePicture) {
            setPreviewUrl(profilePicture);
        }
    }, [profilePicture, previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result.substring(0, reader.result.length); // need this so result can be treated as string
                setPreviewUrl(result);
                onProfilePictureChange(file)
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="image-container" onClick={handleAvatarClick}>
            <input
                type="file"
                style={{display: 'none'}}
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
            />
            {previewUrl ? (
                <div className="round-image">
                    <img
                        src={previewUrl}
                        alt="Profile Preview"
                    />
                </div>
            ) : (
                <Avatar
                    sx={{bgcolor: deepOrange[500], width: 118, height: 118, fontSize: 50, cursor: 'pointer'}}
                >
                    {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
                </Avatar>
            )}
            <div className="overlay-text">Change Profile Picture</div>
        </div>
    );
}