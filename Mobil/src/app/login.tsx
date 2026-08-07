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
import AsyncStorage from '@react-native-async-storage/async-storage'; // Token kaydetmek için eklendi

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Yükleme durumu için state eklendi
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Backend'deki (yakında yazacağımız) Auth endpoint'ine istek atıyoruz
      const response = await fetch('http://192.168.2.228:5069/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // API'den dönen gizli bileti (Token) telefonun hafızasına kaydediyoruz
        await AsyncStorage.setItem('userToken', data.token);
        
        // Giriş başarılı, ana sayfaya yönlendir
        router.replace('/');
      } else {
        Alert.alert('Giriş Başarısız', data.message || 'E-posta veya şifre hatalı.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamıyor. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ARKA PLAN BLURLU DKZ LOGOSU */}
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
          {/* MERKEZE HİZALANMIŞ LOGO VE ALT BAŞLIK */}
          <View style={styles.headerContainer}>
            <Image 
              source={require('./assets/images/dkz-logo.png')} 
              style={styles.brandLogo} 
              resizeMode="contain" 
            />
            <Text style={styles.subtitle}>Dünyanın en iyi içeriklerine giriş yap.</Text>
          </View>

          {/* FORM ALANI */}
          <View style={styles.formContainer}>
            
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

            <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? '#E50914' : '#888'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
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

            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
              <Text style={styles.forgotPasswordText}>Şifreni mi unuttun?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.8} 
              onPress={handleLogin}
              disabled={isLoading} // Yüklenirken butona tekrar basılmasını engeller
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* KAYIT OL BÖLÜMÜ */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Platformda yeni misin? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signupText}>Şimdi Kayıt Ol.</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  watermarkContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
  },
  watermarkLogo: {
    width: width * 0.8,
    height: width * 0.8,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  
  /* BAŞLIK VE LOGO MERKEZLEME BÖLÜMÜ */
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center', 
  },
  brandLogo: {
    width: 140,  
    height: 140,
    marginBottom: 12, 
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', 
  },

  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: '#E50914',
    backgroundColor: 'rgba(20, 20, 20, 1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#B3B3B3',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#E50914',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#888888',
    fontSize: 14,
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});