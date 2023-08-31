import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dog.css';

export default function Dog() {
  const [dogImages, setDogImages] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const fetchDogImages = async () => {
      try {
        const res = await fetch(`https://dog.ceo/api/breed/${name}/images`);
        const data = await res.json();
        if (data.status === 'success') {
          setDogImages(data.message.slice(0, 10));
        } else {
          console.error('Error fetching dog images');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDogImages();
  }, [name]);

  return (
    <section className="max-w-5xl mx-auto flex flex-col items-center min-h-screen">
      <Link to="/" className="back-button">
        Go Back
      </Link>
      <div className="grid grid-cols-3 gap-4">
        {dogImages.map((imageUrl, index) => (
          <div key={index} className="frame">
            <img
              src={imageUrl}
              alt={`Dog ${index + 1}`}
              className="dog-image"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
