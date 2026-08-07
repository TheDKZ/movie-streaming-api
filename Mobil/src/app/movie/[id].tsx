import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, ImageBackground, FlatList, Image, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Token okumak için eklendi

// VERİTABANINDAKİ İNGİLİZCE KATEGORİLERİ TÜRKÇE KARŞILIKLARINA ÇEVİREN SÖZLÜK
const categoryTranslations: { [key: string]: string } = {
  'Action': 'Aksiyon',
  'Comedy': 'Komedi',
  'Drama': 'Dram',
  'Science Fiction': 'Bilim Kurgu',
  'Horror': 'Korku',
  'Animation': 'Animasyon',
};

export default function MovieDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const currentId = Array.isArray(params.id) ? params.id[0] : params.id;
  const title = Array.isArray(params.title) ? params.title[0] : params.title;
  const description = Array.isArray(params.description) ? params.description[0] : params.description;
  const videoUrl = Array.isArray(params.videoUrl) ? params.videoUrl[0] : params.videoUrl;
  const imageUrl = Array.isArray(params.imageUrl) ? params.imageUrl[0] : params.imageUrl;
  
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const rawCategory = categoryParam || 'Film Türü'; 

  // İNGİLİZCE GELEN KATEGORİYİ TÜRKÇEYE ÇEVİRİYORUZ (Sözlükte yoksa orijinalini basar)
  const category = categoryTranslations[rawCategory] || rawCategory;

  const imdbRating = (Array.isArray(params.imdbRating) ? params.imdbRating[0] : params.imdbRating) || (Array.isArray(params.ImdbRating) ? params.ImdbRating[0] : params.ImdbRating) || 'N/A';
  const duration = (Array.isArray(params.duration) ? params.duration[0] : params.duration) || (Array.isArray(params.Duration) ? params.Duration[0] : params.Duration) || 'Süre Yok';
  const director = (Array.isArray(params.director) ? params.director[0] : params.director) || (Array.isArray(params.Director) ? params.Director[0] : params.Director) || 'Bilinmiyor';
  const ageRating = (Array.isArray(params.ageRating) ? params.ageRating[0] : params.ageRating) || (Array.isArray(params.AgeRating) ? params.AgeRating[0] : params.AgeRating) || '13+';

  const descriptorsParam = Array.isArray(params.descriptors) ? params.descriptors[0] : params.descriptors;
  const descriptorsData = descriptorsParam ? JSON.parse(descriptorsParam) : [];

  const castParam = Array.isArray(params.cast) ? params.cast[0] : params.cast;
  const castData = castParam ? JSON.parse(castParam) : [];

  const videoId = typeof videoUrl === 'string' ? videoUrl.split('v=')[1] : null;

  const videoWidth = width > 1200 ? 1200 : width; 
  const videoHeight = videoWidth * (9 / 16); 

  const [inList, setInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // --- BENZER FİLMLERİ GETİRME ---
  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch('http://192.168.2.228:5069/api/movie', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (!response.ok) throw new Error(`HTTP Hata: ${response.status}`);

        const data = await response.json();
        
        if (Array.isArray(data)) {
          const filtered = data.filter((m: any) => 
            (m.category === rawCategory || m.Category === rawCategory) && 
            String(m.id ?? m.Id) !== String(currentId)
          );
          setSimilarMovies(filtered);
        } else {
          setSimilarMovies([]);
        }
      } catch (error) {
        console.error("Benzer filmler çekilirken hata oluştu: ", error);
        setSimilarMovies([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarMovies();
  }, [rawCategory, currentId]);

  // --- KULLANICI ETKİLEŞİMLERİNİ KONTROL ETME (Film sayfaya yüklendiğinde kalp dolu mu boş mu diye bakar) ---
  useEffect(() => {
    const fetchUserInteractions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        // Beğenilenleri kontrol et
        const likedRes = await fetch('http://192.168.2.228:5069/api/UserInteraction/liked-movies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (likedRes.ok) {
          const likedData = await likedRes.json();
          const isCurrentlyLiked = likedData.some((m: any) => String(m.id ?? m.Id) === String(currentId));
          setIsLiked(isCurrentlyLiked);
        }

        // İzleme listesini kontrol et
        const watchlistRes = await fetch('http://192.168.2.228:5069/api/UserInteraction/watchlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (watchlistRes.ok) {
          const watchlistData = await watchlistRes.json();
          const isCurrentlyInList = watchlistData.some((m: any) => String(m.id ?? m.Id) === String(currentId));
          setInList(isCurrentlyInList);
        }
      } catch (error) {
        console.error("Kullanıcı verileri çekilirken hata:", error);
      }
    };

    fetchUserInteractions();
  }, [currentId]);

  // --- LİSTEYE EKLE / ÇIKAR (TOGGLE) ---
  const handleWatchlistToggle = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Kullanıcıya anında hissiyat vermek için UI'ı hemen değiştiriyoruz (Optimistic Update)
      setInList(!inList);

      const response = await fetch(`http://192.168.2.228:5069/api/UserInteraction/watchlist/${currentId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Eğer sunucuda bir hata olursa UI'ı eski haline çeviriyoruz
      if (!response.ok) setInList(inList);
      
    } catch (error) {
      setInList(inList);
      console.error("Listeye eklenirken hata:", error);
    }
  };

  // --- BEĞEN / BEĞENME (TOGGLE) ---
  const handleLikeToggle = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsLiked(!isLiked); // Optimistic Update

      const response = await fetch(`http://192.168.2.228:5069/api/UserInteraction/like/${currentId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) setIsLiked(isLiked);
      
    } catch (error) {
      setIsLiked(isLiked);
      console.error("Beğenilirken hata:", error);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back(); 
    } else {
      router.push('/' as any); 
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title} filmini kesin izlemelisin! Harika bir film.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: imageUrl ? imageUrl.toString() : 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop' }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={40} color="#FFF" />
        </TouchableOpacity>
        <ScrollView style={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}> 
          <View style={[styles.playerContainer, { height: videoHeight, width: videoWidth }]}>
            {videoId ? (
              <YoutubePlayer
                height={videoHeight}
                width={videoWidth}
                play={true} 
                videoId={videoId}
                webViewStyle={{ opacity: 0.99 }} 
                initialPlayerParams={{ controls: 1, autoplay: 1 }} 
              />
            ) : (
              <View style={[styles.placeholder, { height: videoHeight }]}>
                <Text style={{color: '#666', fontSize: 16}}>Fragman bulunamadı.</Text>
              </View>
            )}
          </View>

          <View style={styles.detailsContainer}>
            
            {/* BAŞLIK */}
            <Text style={styles.title}>{title}</Text>
            
            {/* TEK VE AKICI KÜNYE SATIRI */}
            <View style={styles.metadataRow}>
              <Text style={styles.metadataText}>{duration}</Text>
              
              <View style={styles.categoryInlineBadge}>
                <Text style={styles.categoryInlineText}>{category}</Text>
              </View>
              
              <View style={styles.imdbContainer}>
                <Ionicons name="star" size={13} color="#FFD700" />
                <Text style={styles.imdbText}> {imdbRating}</Text>
              </View>

              {/* YUVARLAK YAŞ SEMBOLÜ */}
              <View style={styles.ageBadgeCircle}>
                <Text style={styles.ageBadgeText}>{ageRating}</Text>
              </View>

              {descriptorsData.map((desc: string, index: number) => {
                let iconName = 'alert-circle-outline';
                if (desc.includes('Şiddet')) {
                  iconName = 'flash-outline';
                } else if (desc.includes('Korku')) { 
                  iconName = 'warning-outline';
                } else if (desc.includes('Cinsellik')) {
                  iconName = 'male-female-outline';
                } else if (desc.includes('Olumsuz')) {
                  iconName = 'ban-outline';
                } else if (desc.includes('Genel')) {
                  iconName = 'people-outline';
                }

                return (
                  <View key={index} style={styles.descriptorBadge}>
                    <Ionicons 
                      name={iconName as any} 
                      size={11} 
                      color="#FFF" 
                      style={{ marginRight: 2 }}
                    />
                    <Text style={styles.descriptorText}>{desc}</Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.directorText}>Yönetmen: {director}</Text>

            <Text style={styles.description}>
              {description ? description : "Bu film için henüz bir açıklama girilmemiştir."}
            </Text>

            <View style={styles.actionRow}>
              {/* LİSTEM BUTONU (YENİLENDİ) */}
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleWatchlistToggle} 
              >
                <Ionicons 
                  name={inList ? "checkmark" : "add"} 
                  size={28} 
                  color={inList ? "#E50914" : "#FFF"} 
                />
                <Text style={[styles.actionText, inList && { color: '#E50914', fontWeight: 'bold' }]}>
                  Listem
                </Text>
              </TouchableOpacity>

              {/* BEĞEN BUTONU (YENİLENDİ) */}
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleLikeToggle} 
              >
                <Ionicons 
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                  size={24} 
                  color={isLiked ? "#E50914" : "#FFF"} 
                />
                <Text style={[styles.actionText, isLiked && { color: '#E50914', fontWeight: 'bold' }]}>
                  Beğen
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={24} color="#FFF" />
                <Text style={styles.actionText}>Paylaş</Text>
              </TouchableOpacity>
            </View>

            {castData && castData.length > 0 && (
              <View style={styles.castContainer}>
                <Text style={styles.castTitle}>Oyuncular</Text>
                <FlatList
                  horizontal
                  data={castData}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.actorCard}>
                      <Image 
                        source={{ uri: item.imageUrl || item.ImageUrl }} 
                        style={styles.actorImage} 
                      />
                      <Text style={styles.actorName} numberOfLines={1}>
                        {item.name || item.Name}
                      </Text>
                      <Text style={styles.characterName} numberOfLines={1}>
                        {item.characterName || item.CharacterName}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}

            <View style={styles.similarContainer}>
              <Text style={styles.similarTitle}>Benzer Filmler</Text>
              {loadingSimilar ? (
                <ActivityIndicator size="small" color="#E50914" style={{ marginTop: 20 }} />
              ) : similarMovies.length > 0 ? (
                <FlatList
                  horizontal
                  data={similarMovies}
                  keyExtractor={(item, index) => (item.id || item.Id ? (item.id || item.Id).toString() : index.toString())}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.similarMovieCard}
                      activeOpacity={0.7}
                      onPress={() => {
                        router.push({
                          pathname: '/movie/[id]',
                          params: {
                            id: String(item.id ?? item.Id),
                            title: String(item.title ?? item.Title ?? ''),
                            description: String(item.description ?? item.Description ?? ''),
                            videoUrl: String(item.videoUrl ?? item.VideoUrl ?? ''),
                            imageUrl: String(item.imageUrl ?? item.ImageUrl ?? ''),
                            category: String(item.category ?? item.Category ?? ''),
                            imdbRating: String(item.imdbRating ?? item.ImdbRating ?? ''),
                            duration: String(item.duration ?? item.Duration ?? ''),
                            director: String(item.director ?? item.Director ?? ''),
                            ageRating: String(item.ageRating ?? item.AgeRating ?? ''),
                            descriptors: JSON.stringify(item.descriptors || item.Descriptors || []),
                            cast: JSON.stringify(item.cast || item.Cast || []),
                          },
                        });
                      }}
                    >
                      <Image 
                        source={{ uri: item.imageUrl || item.ImageUrl }} 
                        style={styles.similarMovieImage} 
                      />
                      <Text style={styles.similarMovieTitle} numberOfLines={1}>
                        {item.title || item.Title}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.noSimilarText}>Bu kategoride başka film bulunamadı.</Text>
              )}
            </View>
            
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>©️ 2026 Durmuş Kaan Zıvalı (DKZ). Tüm hakları saklıdır.</Text>
            </View>

          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%', backgroundColor: '#000' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  scrollContainer: { flex: 1, paddingTop: 70 },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 999, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  playerContainer: { backgroundColor: '#000', alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10 },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  detailsContainer: { padding: 20, maxWidth: 1200, alignSelf: 'center', width: '100%', backgroundColor: 'transparent' },
  
  title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 12, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  
  metadataRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    marginBottom: 14,
  },
  metadataText: { color: '#DDD', fontSize: 13, marginRight: 8, marginBottom: 4, fontWeight: '500' },
  
  categoryInlineBadge: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.5)',
    marginRight: 8,
    marginBottom: 4,
  },
  categoryInlineText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },

  imdbContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4 }, 
  imdbText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  ageBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginRight: 6,
    marginBottom: 4,
  },
  ageBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  descriptorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  descriptorText: {
    color: '#CCC',
    fontSize: 9,
    fontWeight: '600',
  },

  directorText: { color: '#BBB', fontSize: 13, fontStyle: 'italic', marginBottom: 16 },
  description: { color: '#F1F1F1', fontSize: 15, lineHeight: 24, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, marginBottom: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10 },
  actionButton: { alignItems: 'center', marginRight: 35, width: 50 },
  actionText: { color: '#AAA', fontSize: 12, marginTop: 6, fontWeight: '500' },
  castContainer: { marginTop: 20, paddingBottom: 10 },
  castTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  actorCard: { alignItems: 'center', marginRight: 15, width: 75 },
  actorImage: { width: 64, height: 64, borderRadius: 32, marginBottom: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  actorName: { color: '#FFF', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  characterName: { color: '#AAA', fontSize: 10, textAlign: 'center', marginTop: 2 },
  similarContainer: { marginTop: 20, paddingBottom: 10 },
  similarTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  similarMovieCard: { marginRight: 12, width: 110, borderRadius: 8, overflow: 'hidden', backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#333' },
  similarMovieImage: { width: '100%', height: 150, resizeMode: 'cover' },
  similarMovieTitle: { color: '#FFF', fontSize: 12, fontWeight: '600', textAlign: 'center', padding: 6, backgroundColor: 'rgba(0, 0, 0, 0.85)' },
  noSimilarText: { color: '#888', fontSize: 13, fontStyle: 'italic' },
  footerContainer: { marginTop: 30, paddingBottom: 30, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 20 },
  footerText: { color: '#777', fontSize: 10, fontWeight: '400', letterSpacing: 0.5 },
});