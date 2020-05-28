import React, { useEffect, useState, useCallback } from 'react';
import Youtube from 'react-youtube';
import './video.css';
import { Button, Alert } from 'react-bootstrap';

const axios = require('axios').default;
// const apiUrl = 'https://randomvideos.herokuapp.com/api/youtube';
const apiUrl = 'http://localhost:5000/api/youtube';

const FORBIDDEN = 'forbidden';

const Video = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState();
  const [videos, setVideos] = useState();

  const getMostPopularVideos = useCallback(async () => {
    const { data } = await axios.get(apiUrl);
    return data;
  });

  const getRandomVideoIndex = useCallback(async (videosLength) => {
    let isNumber = false;
    while (!isNumber) {
      const random = Math.floor(Math.random() * videosLength);
      let forbiddensLocalStorage = JSON.parse(localStorage.getItem(FORBIDDEN));
      if (!forbiddensLocalStorage) {
        localStorage.setItem(FORBIDDEN, JSON.stringify([]));
        forbiddensLocalStorage = [];
      }

      const isForbidden = forbiddensLocalStorage.filter(
        (forbidden) => forbidden === random
      );

      if (isForbidden.length <= 0) {
        localStorage.setItem(
          FORBIDDEN,
          JSON.stringify([...forbiddensLocalStorage, random])
        );
        isNumber = true;
        return random;
      } else if (forbiddensLocalStorage.length === videosLength) {
        localStorage.setItem(FORBIDDEN, JSON.stringify([]));
        isNumber = true;
      } else {
        isNumber = false;
      }
    }
  }, []);

  useEffect(() => {
    const getf = async () => {
      const data = await getMostPopularVideos();
      const index = await getRandomVideoIndex(data.items.length);
      setVideos(data);
      setVideo(data.items[index]);
      setIsLoading(false);
    };
    getf();
  }, []);

  const handleClick = async () => {
    const index = await getRandomVideoIndex(videos.items.length);
    setVideo(videos.items[index]);
  };

  if (isLoading) return <p>Yükleniyor....</p>;
  return (
    <>
      <Button onClick={handleClick} className="bt" disabled={!video}>
        {video
          ? 'Kendimi şanslı hissediyorum :)'
          : 'Bugünlük tüm şansınızı tükettiniz :('}
      </Button>
      <div className="videoWrapper">
        {/* {videoIndex} */}
        {video && (
          <Youtube videoId={video.id} opts={{ height: '562', width: '349' }} />
        )}
        {!video && <div className="last"></div>}
      </div>
    </>
  );
};

export default Video;
