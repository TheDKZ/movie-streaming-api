import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Dışarıdan gelecek verilerin tipini (props) belirliyoruz
interface CrouselProps {
  title: string;
  data: any[];
}

export default function ContentCrousel({ title, data }: CrouselProps) {
  const router = useRouter();

  // Her bir film afişine tıklandığında çalışacak yönlendirme fonksiyonu (Tüm detaylar eklendi)
  const handlePress = (movie: any) => {
    const movieId = String(movie.id ?? movie.Id);
    router.push({
      pathname: "/movie/[id]" as any,
      params: { 
        id: movieId,
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
      }
    });
  };

  // Listede her bir film için ekrana basılacak kart tasarımı
  const renderItem = ({ item }: { item: any }) => {
    // Büyük/küçük harf (camelCase veya PascalCase) uyumluluğu sağlandı
    const posterUrl = item.imageUrl || item.ImageUrl;
    const movieTitle = item.title || item.Title;
    const itemId = item.id || item.Id;

    return (
      <TouchableOpacity 
        style={styles.cardContainer} 
        activeOpacity={0.7} 
        onPress={() => handlePress(item)}
      >
        <Image 
          source={{ uri: posterUrl }} 
          style={styles.poster} 
          resizeMode="cover"
        />
        <Text style={styles.movieTitle} numberOfLines={1}>
          {movieTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  // Veri gelmediyse veya boşsa boş dön (hata vermemesi için)
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Kategori Başlığı */}
      <Text style={styles.headerTitle}>{title}</Text>
      
      {/* Yatay Kaydırılabilir Liste */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item.id || item.Id ? (item.id || item.Id).toString() : index.toString())}
        horizontal={true} // Yatay kaydırmayı açar
        showsHorizontalScrollIndicator={false} // Alt kısımdaki çirkin scroll çubuğunu gizler
        contentContainerStyle={{ paddingHorizontal: 16 }} // Kenarlardan biraz boşluk bırakır
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  cardContainer: {
    marginRight: 16,
    width: 120, // Afiş genişliği
  },
  poster: {
    width: 120,
    height: 180, // Afiş yüksekliği
    borderRadius: 8,
    backgroundColor: '#333', // Resim yüklenene kadar görünecek gri arka plan
  },
  movieTitle: {
    color: '#CCC',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});