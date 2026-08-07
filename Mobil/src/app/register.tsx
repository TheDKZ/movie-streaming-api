import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Animated, 
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Yükleme (Loading) state'i eklendi
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleRegister = async () => {
    // 1. Boş alan kontrolü
    if (!name || !email || !password) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Backend'deki Register API'sine istek atıyoruz (IP ve Port numarası login ile aynı)
      const response = await fetch('http://192.168.2.228:5069/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Backend'in beklediği modele göre burayı gönderiyoruz (Genelde Name, Email, Password şeklindedir)
        body: JSON.stringify({ 
          name: name, 
          email: email, 
          password: password 
        }),
      });

      // Eğer API text dönüyorsa patlamaması için ufak bir kontrol
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        // Kayıt başarılıysa kullanıcıya bilgi verip giriş yapması için Login sayfasına yönlendiriyoruz
        Alert.alert('Başarılı', 'Hesabın başarıyla oluşturuldu! Şimdi giriş yapabilirsin.');
        router.replace('/login');
      } else {
        // Backend'den gelen bir hata mesajı varsa onu göster (örneğin "Bu e-posta zaten kullanımda")
        Alert.alert('Kayıt Başarısız', data.message || typeof data === 'string' ? data : 'Bir hata oluştu.');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamıyor. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.watermarkContainer}>
        <Image 
          source={require('./assets/images/dkz-logo.png')} 
          style={styles.watermarkLogo} 
          resizeMode="contain"
          blurRadius={15} 
        />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View 
          style={[
            styles.contentContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.headerContainer}>
            <Image 
              source={require('./assets/images/dkz-logo.png')} 
              style={styles.brandLogo} 
              resizeMode="contain" 
            />
            <Text style={styles.subtitle}>Aramıza katıl ve içeriklerin tadını çıkar.</Text>
          </View>

          <View style={styles.formContainer}>
            
            {/* Ad Soyad Input */}
            <View style={[styles.inputWrapper, focusedInput === 'name' && styles.inputWrapperFocused]}>
              <Ionicons name="person-outline" size={20} color={focusedInput === 'name' ? '#E50914' : '#888'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#777"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* E-Posta Input */}
            <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}>
              <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? '#E50914' : '#888'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-Posta Adresi"
                placeholderTextColor="#777"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Şifre Input */}
            <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? '#E50914' : '#888'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre Oluştur"
                placeholderTextColor="#777"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Kayıt Ol Butonu ve Yükleme Durumu */}
            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.8} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Zaten bir hesabın var mı? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.signupText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  watermarkContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', opacity: 0.15 },
  watermarkLogo: { width: width * 0.8, height: width * 0.8 },
  keyboardView: { flex: 1, justifyContent: 'center' },
  contentContainer: { paddingHorizontal: 24, width: '100%', maxWidth: 500, alignSelf: 'center' },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  brandLogo: { width: 140, height: 140, marginBottom: 12 },
  subtitle: { color: '#AAAAAA', fontSize: 16, fontWeight: '500', textAlign: 'center' },
  formContainer: { width: '100%' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(26, 26, 26, 0.9)', borderRadius: 8, borderWidth: 1, borderColor: '#333333', marginBottom: 16, paddingHorizontal: 16, height: 56 },
  inputWrapperFocused: { borderColor: '#E50914', backgroundColor: 'rgba(20, 20, 20, 1)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16, height: '100%' },
  eyeIcon: { padding: 8 },
  loginButton: { backgroundColor: '#E50914', height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', shadowColor: '#E50914', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginTop: 10 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { color: '#888888', fontSize: 14 },
  signupText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});