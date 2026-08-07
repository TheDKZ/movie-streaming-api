import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

const VIDEO_WIDTH = width - 32; 
const VIDEO_HEIGHT = VIDEO_WIDTH * (9 / 16); 

export default function HeroBanner({ movies }: { movies: any[] }) {
  const [currentMovie, setCurrentMovie] = useState<any>(null);
  const [playing, setPlaying] = useState(false);

  const pickRandomMovie = useCallback(() => {
    if (movies && movies.length > 0) {
      setPlaying(false);
      const randomIndex = Math.floor(Math.random() * movies.length);
      setCurrentMovie(movies[randomIndex]);
    }
  }, [movies]);

  useEffect(() => {
    if (movies && movies.length > 0 && !currentMovie) {
      pickRandomMovie();
    }
  }, [movies, currentMovie, pickRandomMovie]);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      pickRandomMovie();
    }
  }, [pickRandomMovie]);

  if (!currentMovie) {
    return <View style={[styles.container, { height: VIDEO_HEIGHT, backgroundColor: '#000' }]} />;
  }

  let videoId = null;
  if (currentMovie.videoUrl) {
    const parts = currentMovie.videoUrl.split('v=');
    if (parts.length > 1) {
      videoId = parts[1].split('&')[0];
    }
  }

  return (
    <View style={styles.container}>
      
      <View style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}>
        {videoId ? (
          <YoutubePlayer
            height={VIDEO_HEIGHT} 
            width={VIDEO_WIDTH} 
            play={playing} 
            mute={true}
            videoId={videoId}
            onChangeState={onStateChange}
            onReady={() => {
              setTimeout(() => {
                setPlaying(true);
              }, 500);
            }} 
            webViewStyle={{ opacity: 0.99 }} 
            initialPlayerParams={{
              controls: 0, 
              modestbranding: 1,
              rel: 0, 
              playsinline: 1,
              mute: 1, 
            }}
            webViewProps={{
              mediaPlaybackRequiresUserAction: false,
              allowsInlineMediaPlayback: true,
            }}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.infoContainer}>
        {/* İŞTE BURAYI DEĞİŞTİRDİK */}
        <Text style={styles.nowPlayingText}>🎬 Günün Film Tavsiyesi</Text>
        <Text style={styles.movieTitle}>{currentMovie.title || currentMovie.Title}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 0,
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#111',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#0A0A0A',
    zIndex: 10,
  },
  nowPlayingText: {
    color: '#E50914',
    fontSize: 13, // Biraz daha belirgin olması için 1 tık büyüttüm
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase', // Yazıyı tamamen BÜYÜK HARF yapar, daha şık durur
    letterSpacing: 1, // Harfler arasına çok hafif boşluk ekler
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});