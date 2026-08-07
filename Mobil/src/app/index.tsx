import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Text, FlatList, Image, useWindowDimensions, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';

// ANDROID İÇİN LAYOUT ANIMATION İZNİ
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const subCategories = [
  { id: '2', name: 'Action', label: ' Aksiyon' },
  { id: '3', name: 'Comedy', label: ' Komedi' },
  { id: '4', name: 'Drama', label: ' Dram' },
  { id: '5', name: 'Science Fiction', label: ' Bilim Kurgu' },
  { id: '6', name: 'Horror', label: ' Korku' },
  { id: '7', name: 'Animation', label: ' Animasyon' },
];

export default function Home() {
  const router = useRouter();
  const pathname = usePathname(); 
  const { width } = useWindowDimensions();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Menüde dinamik isim göstermek için state eklendi
  const [userName, setUserName] = useState("Kullanıcı");

  const dynamicCardWidth = Math.max(width / 4.5, 130);
  const dynamicCardHeight = dynamicCardWidth * 1.4;

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadMoviesAndUser = async () => {
        try {
          setLoading(true);
          let token = await AsyncStorage.getItem('userToken');
      
          if (!token) {
            await new Promise(resolve => setTimeout(resolve, 150));
            token = await AsyncStorage.getItem('userToken');
          }

          if (!token) {
            console.log("Token bulunamadı, izinsiz giriş engellendi!");
            if (isMounted) setLoading(false);
            router.replace('/login');
            return;
          }

          // 1. Filmleri Çek
          const response = await fetch('http://192.168.2.228:5069/api/movie', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 401) {
            console.log("Token süresi dolmuş veya geçersiz, login sayfasına atılıyor...");
            await AsyncStorage.removeItem('userToken');
            if (isMounted) setLoading(false);
            router.replace('/login');
            return;
          }

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          
          if (isMounted) {
            if (Array.isArray(data)) {
              setMovies(data);
            } else {
              setMovies([]);
            }
          }

          // 2. Kullanıcı Adını Çek (Menüde dinamik yazması için)
          const userResponse = await fetch('http://192.168.2.228:5069/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (isMounted && userData?.name) {
              setUserName(userData.name);
            }
          }

        } catch (error) {
          console.error("Veri çekerken hata oluştu: ", error);
          if (isMounted) setMovies([]);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadMoviesAndUser();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const trendingMovies = movies.slice(0, 20);
  const mostWatchedMovies = movies.slice(20, 40);

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

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.movieCard, { width: dynamicCardWidth }]} 
      activeOpacity={0.7}
      onPress={() => handleMoviePress(item)}
    >
      <Image 
        source={{ uri: item.imageUrl || item.ImageUrl }} 
        style={[styles.movieImage, { height: dynamicCardHeight }]} 
      />
      <View style={styles.movieTitleContainer}>
        <Text style={[styles.movieTitle, { fontSize: dynamicCardWidth > 200 ? 16 : 12 }]} numberOfLines={1}>
          {item.title || item.Title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const toggleCategories = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await AsyncStorage.removeItem('userToken');
    console.log("Token temizlendi, çıkış yapılıyor...");
    router.replace('/login');
  };

  const isRouteActive = (route: string) => pathname === route;

  return (
    <View style={styles.mainContainer}>
      
      {/* --- 1. KATMAN: ZİFİRİ SİYAH ARKA PLAN VE DKZ LOGOSU --- */}
      <View style={styles.watermarkContainer}>
        <Image 
          source={require('./assets/images/dkz-logo.png')} 
          style={{ width: width * 0.7, height: width * 0.7 }} 
          resizeMode="contain"
          blurRadius={12} 
        />
      </View>

      {/* --- 2. KATMAN: SAYFA İÇERİKLERİ --- */}
      <View style={styles.contentContainer}>
        <Header onMenuPress={() => setMenuVisible(true)} />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          <HeroBanner movies={movies} />
          
          {loading ? (
             <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 50 }} />
          ) : (
            <>
              {/* GÜNDEMDEKİLER LİSTESİ */}
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>🔥 Gündemdekiler</Text>
                <FlatList
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies}
                  keyExtractor={(item, index) => (item.id || item.Id ? (item.id || item.Id).toString() : index.toString())}
                  renderItem={renderMovieItem}
                  contentContainerStyle={styles.flatListContent}
                />
              </View>

              {/* EN ÇOK İZLENENLER LİSTESİ */}
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>🏆 En Çok İzlenenler</Text>
                <FlatList
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  data={mostWatchedMovies}
                  keyExtractor={(item, index) => (item.id || item.Id ? (item.id || item.Id).toString() : index.toString())}
                  renderItem={renderMovieItem}
                  contentContainerStyle={styles.flatListContent}
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* --- NETFLIX TARZI GELİŞMİŞ MENÜ --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.drawerContainer}>
              
              <View style={styles.drawerProfileHeader}>
                <TouchableOpacity 
                  style={styles.profileInfoRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push('/profile');
                  }}
                >
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }} 
                    style={styles.profileAvatar} 
                  />
                  <View>
                    {/* DİNAMİK KULLANICI ADI BURAYA BAĞLANDI */}
                    <Text style={styles.profileName}>{userName}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#B3B3B3" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }}>
                
                {/* ARAMA MENÜSÜ */}
                <TouchableOpacity 
                  style={styles.mainMenuItem} 
                  onPress={() => { setMenuVisible(false); router.push('/search'); }}
                >
                  <View style={styles.menuItemRow}>
                    <Ionicons name="search" size={22} color={isRouteActive('/search') ? '#FFFFFF' : '#B3B3B3'} style={styles.menuIcon} />
                    <Text style={[styles.mainMenuText, isRouteActive('/search') && styles.activeMenuText]}>Arama</Text>
                  </View>
                  {isRouteActive('/search') && <View style={styles.activeIndicator} />}
                </TouchableOpacity>

                {/* KATEGORİLER MENÜSÜ */}
                <TouchableOpacity 
                  style={styles.mainMenuItem} 
                  onPress={toggleCategories}
                >
                  <View style={styles.menuItemRow}>
                    <Ionicons name="film-outline" size={22} color="#B3B3B3" style={styles.menuIcon} />
                    <Text style={styles.mainMenuText}>Kategoriler</Text>
                  </View>
                  <Ionicons name={isCategoriesOpen ? "chevron-down" : "chevron-forward"} size={18} color="#666" />
                </TouchableOpacity>

                {isCategoriesOpen && (
                      <View style={styles.subMenuContainer}>
                          {subCategories.map((item) => (
                    <TouchableOpacity 
                    key={item.id} 
                           style={styles.subCategoryItem}
                    onPress={() => {
                       setMenuVisible(false);
                             router.push({
                            pathname: '/category/[name]',
                        params: { 
                               name: item.label,
                              englishKey: item.name 
                                } 
                                   });
                      }}
                           >
                                    <Text style={styles.subCategoryText}>{item.label}</Text>
                                    </TouchableOpacity>
                              ))}
                          </View>
                      )}

                {/* İLETİŞİM MENÜSÜ */}
                <TouchableOpacity 
                   style={styles.mainMenuItem} 
                   onPress={() => { setMenuVisible(false); router.push('/iletisim'); }}
                >
                  <View style={styles.menuItemRow}>
                    <Ionicons name="mail-outline" size={22} color={isRouteActive('/iletisim') ? '#FFFFFF' : '#B3B3B3'} style={styles.menuIcon} />
                    <Text style={[styles.mainMenuText, isRouteActive('/iletisim') && styles.activeMenuText]}>İletişim</Text>
                  </View>
                  {isRouteActive('/iletisim') && <View style={styles.activeIndicator} />}
                </TouchableOpacity>

                {/* HAKKIMIZDA MENÜSÜ */}
                <TouchableOpacity 
                  style={styles.mainMenuItem} 
                  onPress={() => { setMenuVisible(false); router.push('/hakkimizda'); }}
                >
                  <View style={styles.menuItemRow}>
                    <Ionicons name="information-circle-outline" size={22} color={isRouteActive('/hakkimizda') ? '#FFFFFF' : '#B3B3B3'} style={styles.menuIcon} />
                    <Text style={[styles.mainMenuText, isRouteActive('/hakkimizda') && styles.activeMenuText]}>Hakkımızda</Text>
                  </View>
                  {isRouteActive('/hakkimizda') && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                
                {/* ÇIKIŞ YAP BUTONU */}
                <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                  <View style={styles.menuItemRow}>
                    <Ionicons name="log-out-outline" size={22} color="#E50914" style={styles.menuIcon} />
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                  </View>
                </TouchableOpacity>

              </ScrollView>
              
              {/* ALT BİLGİ (FOOTER) */}
              <View style={styles.drawerFooter}>
                <Text style={styles.footerText}>DKZ VOD Platform - v1.0.0</Text>
              </View>

            </View>

            <TouchableOpacity 
              style={styles.drawerCloseArea} 
              activeOpacity={1} 
              onPress={() => setMenuVisible(false)} 
            />
          </View>
        </Modal>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000000' },
  watermarkContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', opacity: 0.20 },
  contentContainer: { flex: 1, backgroundColor: 'transparent' }, 
  
  listContainer: { marginTop: 24 },
  listTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 16, marginBottom: 12 },
  flatListContent: { paddingHorizontal: 12 },
  movieCard: { marginHorizontal: 6, borderRadius: 10, overflow: 'hidden', backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#1A1A1A' }, 
  movieImage: { width: '100%', resizeMode: 'cover' },
  movieTitleContainer: { padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.85)', position: 'absolute', bottom: 0, width: '100%' },
  movieTitle: { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', flexDirection: 'row' },
  drawerContainer: { width: '75%', height: '100%', backgroundColor: '#000000' }, 
  
  drawerProfileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  profileInfoRow: { flexDirection: 'row', alignItems: 'center' },
  profileAvatar: { width: 44, height: 44, borderRadius: 4, marginRight: 12 }, 
  profileName: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' }, 
  closeButton: { padding: 4 },

  mainMenuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 },
  menuItemRow: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 16 },
  mainMenuText: { color: '#E5E5E5', fontSize: 17, fontWeight: '500' }, 
  
  activeMenuText: { color: '#FFFFFF', fontWeight: 'bold' },
  activeIndicator: { width: 4, height: 24, backgroundColor: '#E50914', borderRadius: 2 },
  
  logoutItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, marginTop: 10, borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  logoutText: { color: '#E50914', fontSize: 17, fontWeight: 'bold' },

  subMenuContainer: { backgroundColor: '#000000', paddingLeft: 58, paddingBottom: 10 }, 
  subCategoryItem: { paddingVertical: 12 },
  subCategoryText: { color: '#808080', fontSize: 15, fontWeight: '400' },
  
  drawerFooter: { paddingVertical: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  footerText: { color: '#4D4D4D', fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },

  drawerCloseArea: { flex: 2 },
});