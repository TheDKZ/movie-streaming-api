import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Audio } from 'expo-av';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const router = useRouter();

  useEffect(() => {
    async function playIntroSound() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/images/intro.wav')
        );
        await sound.playAsync();
      } catch (error) {
        console.log("Ses çalınamadı detaylı hata: ", error);
      }
    }

    playIntroSound();

    // 1. DÜZELTME: Splash animasyonu oynarken arka planda çaktırmadan Login'e yönlendir.
    // Expo'nun kendi iç ayarlarını yapması için 100ms ufak bir gecikme veriyoruz.
    setTimeout(() => {
      router.replace('/login');
    }, 100);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false); // 2. Animasyon tamamen bitince DOM'dan kaldır
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      
      {/* ALT KATMAN: Uygulamanın ta kendisi (Arka planda hazırda bekler) */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="movie/[id]" />
        <Stack.Screen name="hakkimizda" />
        <Stack.Screen name="iletisim" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="search" />
      </Stack>

      {/* ÜST KATMAN: Splash Animasyonu (Z-Index ile en üstte durur) */}
      {isSplashVisible && (
        <Animated.View style={[styles.splashOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
            <Image 
              source={require('./assets/images/dkz-logo.png')} 
              style={styles.splashLogoImage}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject, // Tüm ekranı kapla
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Her şeyin üstünde durmasını sağlar
  },
  splashLogoImage: {
    width: 320,
    height: 320,
  },
});