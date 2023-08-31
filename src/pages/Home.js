import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [breedNames, setBreedNames] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [favoriteDogs, setFavoriteDogs] = useState([]);

  useEffect(() => {
    const fetchBreedData = async () => {
      try {
        const res = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await res.json();
        const names = Object.keys(data.message);
        setBreedNames(names);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBreedData();
  }, []);

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const promises = breedNames.map(async (name) => {
          const res = await fetch(`https://dog.ceo/api/breed/${name}/images/random`);
          const data = await res.json();
          return { name, image: data.message, isFavorite: false };
        });
        const dogData = await Promise.all(promises);
        setDogs(dogData);
      } catch (error) {
        console.error(error);
      }
    };

    if (breedNames.length > 0) {
      fetchDogData();
    }
  }, [breedNames]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDogs(dogs);
    } else {
      const filtered = dogs.filter(dog => dog.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredDogs(filtered);
    }
  }, [searchQuery, dogs]);

  const toggleFavorite = (name) => {
    setDogs(prevDogs =>
      prevDogs.map(dog =>
        dog.name === name ? { ...dog, isFavorite: !dog.isFavorite } : dog
      )
    );
  };

  useEffect(() => {
    setFavoriteDogs(dogs.filter(dog => dog.isFavorite));
  }, [dogs]);

  return (
    <section className="p-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="flex items-center justify-center text-white text-center px-5 text-3xl font-bold lg:text-5xl">
          Dog Search
        </h1>
        <p className="my-8 text-white">
          API USED :{' '}
          <a
            href="https://dog.ceo/"
            className="text-indigo-600 underline active:text-orange-400"
          >
            Dog.ceo
          </a>
        </p>

        <form className="max-w-xl mx-auto flex" autoComplete="off">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for a dog breed"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-4 rounded shadow w-full bg-slate-400 placeholder-white text-white"
          />
        </form>
      </div>
      {favoriteDogs.length > 0 && !searchQuery && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white">Favorites</h2>
          <div className="grid grid-cols-3 gap-6">
            {favoriteDogs.map((dog, index) => (
              <article key={index} className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-white">{dog.name}</h2>
                {dog.image && (
                  <div className="relative">
                    <img
                      src={dog.image}
                      alt={`${dog.name} breed`}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 p-2 rounded-full text-xs bg-red-500 text-white"
                      onClick={() => toggleFavorite(dog.name)}
                    >
                      Unfavorite
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-6 my-10">
        {filteredDogs.map((dog, index) => (
          <article key={index} className="mb-6 hover:bg-slate-600 transition-all duration-200">
            <Link to={`/${dog.name}`} className="text-white">
              <h2 className="text-xl font-semibold mb-2">{dog.name}</h2>
            </Link>
            {dog.image && (
              <div className="relative">
                <img
                  src={dog.image}
                  alt={`${dog.name} breed`}
                  loading="lazy"
                  className="w-full h-72 object-cover"
                />
                <button
                  className={`absolute top-2 right-2 p-2 rounded-full text-xs ${
                    dog.isFavorite ? 'bg-red-500 text-white' : 'bg-white'
                  }`}
                  onClick={() => toggleFavorite(dog.name)}
                >
                  <span
                    className={`${
                      dog.isFavorite ? 'text-red-500' : 'text-gray-800'
                    } transition-colors duration-300 ease-in-out fas fa-heart`}
                  ></span>
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
