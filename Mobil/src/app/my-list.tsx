import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyListScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.2.228:5069/api/UserInteraction/watchlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      }
    } catch (error) {
      console.error("Liste çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => router.push({
        pathname: '/movie/[id]',
        params: {
          id: String(item.id || item.Id),
          title: String(item.title || item.Title || ''),
          description: String(item.description || item.Description || ''),
          videoUrl: String(item.videoUrl || item.VideoUrl || ''),
          imageUrl: String(item.imageUrl || item.ImageUrl || ''),
          category: String(item.category || item.Category || ''),
        }
      })}
    >
      <Image source={{ uri: item.imageUrl || item.ImageUrl }} style={styles.movieImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title || item.Title}</Text>
        <Text style={styles.movieCategory}>{item.category || item.Category}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" style={{ marginRight: 10 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İzleme Listem</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 50 }} />
      ) : movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMovie}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={60} color="#444" />
          <Text style={styles.emptyText}>Listen şu an boş.</Text>
          <Text style={styles.emptySubText}>İzlemek istediğin filmleri buraya ekleyebilirsin.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backButton: { marginRight: 16 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  movieCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F0F0F', marginBottom: 12, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#1A1A1A' },
  movieImage: { width: 80, height: 120, resizeMode: 'cover' },
  movieInfo: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  movieTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  movieCategory: { color: '#888', fontSize: 13 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubText: { color: '#888', fontSize: 14, textAlign: 'center' }
});