import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Token desteği için eklendi

export default function CategoryScreen() {
  const router = useRouter();
  const { name, englishKey } = useLocalSearchParams(); // Hem Türkçe başlığı hem İngilizce anahtarı alıyoruz
  const { width } = useWindowDimensions();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cardWidth = (width - 48) / 2;
  const cardHeight = cardWidth * 1.4;

  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        // Hafızadan yetkilendirme token'ını alıyoruz
        const token = await AsyncStorage.getItem('userToken');

        const response = await fetch('http://192.168.2.228:5069/api/movie', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // GÜVENLİK KALKANI: Gelen verinin dizi olduğundan emin oluyoruz
        if (Array.isArray(data)) {
          // Arama yapılacak anahtar (Örn: "Action" veya gelen name değeri)
          const query = String(englishKey || name || '').toLowerCase().trim();
          
          const filtered = data.filter((movie: any) => {
            const cat = String(movie.category || movie.Category || '').toLowerCase().trim();
            return cat.includes(query) || query.includes(cat);
          });

          setMovies(filtered);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Kategori filmleri çekerken hata: ", error);
        setMovies([]); // Hata durumunda boş dizi atanarak patlama engellenir
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryMovies();
  }, [englishKey, name]);

  const handleMoviePress = (movie: any) => {
    const id = String(movie.id ?? movie.Id);
    router.push({
      pathname: '/movie/[id]',
      params: {
        id,
        title: String(movie.title ?? movie.Title ?? ''),
        description: String(movie.description ?? movie.Description ?? ''),
        videoUrl: String(movie.videoUrl ?? movie.VideoUrl ?? ''),
        imageUrl: String(movie.imageUrl ?? movie.ImageUrl ?? ''),
        category: String(movie.category ?? movie.Category ?? ''),
        imdbRating: String(movie.imdbRating ?? movie.ImdbRating ?? ''),
        duration: String(movie.duration ?? movie.Duration ?? ''),
        director: String(movie.director ?? movie.Director ?? ''),
        ageRating: String(movie.ageRating ?? movie.AgeRating ?? ''),
        descriptors: JSON.stringify(movie.descriptors || movie.Descriptors || []), 
        cast: JSON.stringify(movie.cast || movie.Cast || []), 
      },
    });
  };

  const renderGridItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.movieCard, { width: cardWidth }]} 
      activeOpacity={0.7}
      onPress={() => handleMoviePress(item)}
    >
      <Image source={{ uri: item.imageUrl || item.ImageUrl }} style={[styles.movieImage, { height: cardHeight }]} />
      <View style={styles.movieTitleContainer}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title || item.Title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ÜST BAŞLIK: Doğrudan menüden gelen Türkçe ve emojili başlık, net beyaz */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{String(name || 'Kategori')}</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="film-outline" size={60} color="#333" />
          <Text style={styles.emptyText}>Bu kategoride henüz film bulunmuyor.</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => (item.id || item.Id ? (item.id || item.Id).toString() : index.toString())}
          renderItem={renderGridItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  backButton: { marginRight: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }, 

  listContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  
  movieCard: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#1A1A1A' },
  movieImage: { width: '100%', resizeMode: 'cover' },
  movieTitleContainer: { padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.85)' },
  movieTitle: { color: '#FFFFFF', fontWeight: '600', fontSize: 13, textAlign: 'center' },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { color: '#555', fontSize: 15, textAlign: 'center', marginTop: 16 },
});