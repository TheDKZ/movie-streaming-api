import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HakkimizdaScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      
      {/* 1. KATMAN: ZİFİRİ SİYAH ARKA PLAN VE BLURLU DKZ LOGOSU */}
      <View style={styles.watermarkContainer}>
        <Image 
          source={require('./assets/images/dkz-logo.png')} 
          style={styles.watermarkLogo} 
          resizeMode="contain"
          blurRadius={12} 
        />
      </View>

      {/* 2. KATMAN: İÇERİK */}
      <SafeAreaView style={styles.contentContainer}>
        
        {/* Üst Bar (Geri Dön Tuşu ve Başlık) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hakkımızda</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* İçerik Alanı */}
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Dkz VoD Platformu</Text>
            <Text style={styles.subtitle}>Modern Dijital Yayıncılık Deneyimi</Text>
            
            <View style={styles.divider} />

            <Text style={styles.paragraph}>
              Bu uygulama, en güncel mobil teknolojiler ve güçlü bir backend altyapısı kullanılarak geliştirilmiş yenilikçi bir Video on Demand  platformudur.
            </Text>

            <Text style={styles.paragraph}>
              Kullanıcılarına kesintisiz içerik akışı, zengin kategori yönetimi, akıcı arayüz tasarımı ve kişiselleştirilmiş film listeleri sunmayı hedefler.
            </Text>

            <View style={styles.techBox}>
              <Text style={styles.techTitle}>🛠️ Kullanılan Teknolojiler</Text>
              <Text style={styles.techItem}>• React Native & Expo Router</Text>
              <Text style={styles.techItem}>• TypeScript & Modern UI/UX</Text>
              <Text style={styles.techItem}>• .NET Core  </Text>
              <Text style={styles.techItem}>• Superbase  </Text>
            </View>

            <Text style={styles.footerText}>© 2026 Tüm Hakları Saklıdır.</Text>
          </View>
        </ScrollView>
        
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  watermarkContainer: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    opacity: 0.20 
  },
  watermarkLogo: { 
    width: width * 0.7, 
    height: width * 0.7 
  },
  contentContainer: { 
    flex: 1, 
    backgroundColor: 'transparent' 
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(28, 28, 28, 0.85)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderRightColor: '#333',
    borderColor: '#262626',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  paragraph: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  techBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  techTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  techItem: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 4,
  },
  footerText: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});