import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, Linking } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function IletisimScreen() {
  const router = useRouter();

  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Bağlantı açılamadı: ", err));
  };

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>İletişim</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>İletişim Bilgileri</Text>
            <Text style={styles.subtitle}>Benimle aşağıdaki kanallardan iletişime geçebilirsin.</Text>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactItem} onPress={() => handlePress('tel:+905555555555')}>
              <View style={styles.iconBox}>
                <Ionicons name="call-outline" size={20} color="#E50914" />
              </View>
              <View>
                <Text style={styles.label}>Telefon</Text>
                <Text style={styles.value}>+90 (555) 555 55 55</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={() => handlePress('mailto:durmuskaan@email.com')}>
              <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={20} color="#E50914" />
              </View>
              <View>
                <Text style={styles.label}>E-Posta</Text>
                <Text style={styles.value}>durmuskaan@email.com</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.socialHeader}>Sosyal Medya & Kod Repoları</Text>

            <TouchableOpacity style={styles.socialItem} onPress={() => handlePress('https://github.com')}>
              <FontAwesome name="github" size={22} color="#FFFFFF" style={styles.socialIcon} />
              <Text style={styles.socialText}>GitHub</Text>
              <Ionicons name="chevron-forward" size={16} color="#777" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialItem} onPress={() => handlePress('https://linkedin.com')}>
              <FontAwesome name="linkedin" size={22} color="#0A66C2" style={styles.socialIcon} />
              <Text style={styles.socialText}>LinkedIn</Text>
              <Ionicons name="chevron-forward" size={16} color="#777" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialItem} onPress={() => handlePress('https://twitter.com')}>
              <FontAwesome name="twitter" size={22} color="#1DA1F2" style={styles.socialIcon} />
              <Text style={styles.socialText}>Twitter (X)</Text>
              <Ionicons name="chevron-forward" size={16} color="#777" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialItem} onPress={() => handlePress('https://instagram.com')}>
              <FontAwesome name="instagram" size={22} color="#E1306C" style={styles.socialIcon} />
              <Text style={styles.socialText}>Instagram</Text>
              <Ionicons name="chevron-forward" size={16} color="#777" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

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

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  container: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: 'rgba(28, 28, 28, 0.85)', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#262626' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#AAAAAA', fontSize: 14, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(229, 9, 20, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  label: { color: '#888888', fontSize: 12 },
  value: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginTop: 2 },
  socialHeader: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  socialItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  socialIcon: { width: 28, textAlign: 'center', marginRight: 12 },
  socialText: { color: '#FFFFFF', fontSize: 15, fontWeight: '500' },
});