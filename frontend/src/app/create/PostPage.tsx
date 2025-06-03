'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './PostPage.module.css';
import axios from 'axios';
import useData from '@/hook/useData';
import Image from 'next/image';
import { Autocomplete } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

const CreatePost = () => {
  const { user, userId } = useData();
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    tags: '',
    location: '',
    visibility: '',
    postedBy: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, postedBy: userId }));
    }
  }, [userId]);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setFormData((prev) => ({
        ...prev,
        location: place?.formatted_address || '',
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file.size > 10 * 1024 * 1024) {
      alert('Please upload an image less than 10 MB.');
      return;
    }
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return alert('Please upload an image');
    if (!formData.postedBy) return alert('User ID is missing. Please try again.');

    const data = new FormData();
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('postedBy', formData.postedBy);
    data.append('visibility', formData.visibility);
    data.append('image', image);

    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    tagsArray.forEach((tag) => data.append('tags[]', tag));

    console.log(image.name, image.type, image.size);

    try {
      const res = await axios.post(
        `http://localhost:7050/api/v1/post/create?user_id=${formData.postedBy}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      router.push('/');
      setFormData({
        description: '',
        tags: '',
        location: '',
        visibility: 'public',
        postedBy: userId || '',
      });
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <p className={styles.heading}>Create New Post</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.image_div}>
            {preview ? (
              <img src={preview} alt="Preview" className={styles.preview} />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                required
              />
            )}
          </div>

          <div className={styles.input_form_div}>
            <div className={styles.profile_div}>
              <Image
                src={user.profile || '/images/profilelogo.png'}
                alt="Profile"
                width={500}
                height={500}
                priority
                className={styles.profile_photo}
              />
              <p className={styles.profile_name}>i_am_{user.name}</p>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Caption"
              className={styles.textarea}
            />

            <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceChanged}>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Add Location"
                required
                className={styles.location}
              />
            </Autocomplete>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className={styles.location}
            />

            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="" disabled>Accessibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends-only">Friends-only</option>
            </select>
            <button type="submit" className={styles.button}>Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
