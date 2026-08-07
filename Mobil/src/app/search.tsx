import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Token desteği için eklendi

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [allMovies, setAllMovies] = useState<any[]>([]); 
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesForSearch = async () => {
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

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // GÜVENLİK KALKANI: Gelen verinin dizi olduğundan emin oluyoruz
        if (Array.isArray(data)) {
          setAllMovies(data);
        } else {
          setAllMovies([]);
        }
      } catch (error) {
        console.error("API'den veri çekerken hata: ", error);
        setAllMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesForSearch();
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredMovies([]);
      return;
    }

    const lowerCaseQuery = text.toLowerCase();
    const results = allMovies.filter((movie) => {
      const title = movie.title || movie.Title || '';
      return title.toLowerCase().includes(lowerCaseQuery);
    });

    setFilteredMovies(results);
  }, [allMovies]);

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

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultCard} 
      activeOpacity={0.7}
      onPress={() => handleMoviePress(item)}
    >
      <Image source={{ uri: item.imageUrl || item.ImageUrl }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>{item.title || item.Title}</Text>
        <Text style={styles.resultCategory}>{item.category || item.Category || 'Kategori Yok'}</Text>
        
        <View style={styles.resultMetrics}>
          <Ionicons name="star" size={14} color="#F5C518" style={{ marginRight: 4 }} />
          <Text style={styles.metricText}>{item.imdbRating || item.ImdbRating || 'N/A'}</Text>
          <Text style={styles.metricSeparator}>•</Text>
          <Text style={styles.metricText}>{item.duration || item.Duration || 'Bilinmiyor'}</Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#666" style={{ alignSelf: 'center', marginLeft: 10 }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      
      {/* 1. KATMAN: ZİFİRİ SİYAH ARKA PLAN VE MERKEZDEKİ BLURLU LOGO */}
      <View style={styles.watermarkContainer}>
        <Image 
          source={require('./assets/images/dkz-logo.png')} 
          style={styles.watermarkLogo} 
          resizeMode="contain"
          blurRadius={10} 
        />
      </View>
    
      {/* 2. KATMAN: İÇERİK */}
      <SafeAreaView style={styles.contentContainer}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Film Ara</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Film, dizi veya program ara..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus={true} 
              returnKeyType="search"
              selectionColor="#E50914"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#E50914" />
            </View>
          ) : searchQuery.length > 0 && filteredMovies.length === 0 ? (
            <View style={styles.centerContent}>
              <Ionicons name="film-outline" size={60} color="#333" />
              <Text style={styles.emptyText}>Aradığınız kriterlere uygun sonuç bulunamadı.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredMovies}
              keyExtractor={(item, index) => (item.id || item.Id ? (item.id || item.Id).toString() : index.toString())}
              renderItem={renderSearchResult}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" 
            />
          )}

        </KeyboardAvoidingView>
      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000000' }, 
  
  watermarkContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', opacity: 0.20 },
  watermarkLogo: { width: width * 0.7, height: width * 0.7 }, 

  contentContainer: { flex: 1, backgroundColor: 'transparent' }, 
  keyboardContainer: { flex: 1 },
  
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  backButton: { marginRight: 16 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111111', marginHorizontal: 16, borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#222' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 16, paddingVertical: 14 },
  clearButton: { padding: 4 },

  listContainer: { paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 40 },
  
  resultCard: { flexDirection: 'row', backgroundColor: '#0A0A0A', borderRadius: 8, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  resultImage: { width: 70, height: 100, borderRadius: 4, backgroundColor: '#111' },
  resultInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  resultTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  resultCategory: { color: '#888', fontSize: 13, marginBottom: 8 }, 
  resultMetrics: { flexDirection: 'row', alignItems: 'center' },
  metricText: { color: '#666', fontSize: 12 }, 
  metricSeparator: { color: '#333', marginHorizontal: 6, fontSize: 12 },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { color: '#555', fontSize: 15, textAlign: 'center', marginTop: 16, lineHeight: 22 },
});