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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Adım kontrolü: 1 -> Mail iste, 2 -> Kod ve Yeni Şifre gir
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 1. AŞAMA: Mailine Kod Gönder
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Uyarı", "Lütfen e-posta adresinizi girin.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.2.228:5069/api/auth/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Doğrulama kodu e-posta adresinize gönderildi!");
        setStep(2); // 2. aşamaya geç (Kod ve şifre girme ekranı)
      } else {
        Alert.alert("Hata", data.message || "Bu e-posta adresi bulunamadı.");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  // 2. AŞAMA: Kodu Onayla ve Şifreyi Değiştir
  const handleVerifyAndReset = async () => {
    if (!code || !newPassword) {
      Alert.alert("Uyarı", "Lütfen doğrulama kodunu ve yeni şifrenizi girin.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.2.228:5069/api/auth/verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.", [
          { text: "Giriş Yap", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Hata", data.message || "Kod hatalı veya süresi dolmuş.");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Şifre Sıfırlama</Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? "Kayıtlı e-posta adresini gir, mailine 6 haneli doğrulama kodu gönderelim." 
                : `${email} adresine gönderilen kodu ve yeni şifreni gir.`}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {step === 1 ? (
              <>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="E-Posta Adresi"
                    placeholderTextColor="#777"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Kod Gönder</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputWrapper}>
                  <Ionicons name="key-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="6 Haneli Doğrulama Kodu"
                    placeholderTextColor="#777"
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Yeni Şifre"
                    placeholderTextColor="#777"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleVerifyAndReset} disabled={loading}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Şifreyi Güncelle</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.backText}>Giriş ekranına dön</Text>
          </TouchableOpacity>

        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  keyboardView: { flex: 1, justifyContent: 'center' },
  contentContainer: { paddingHorizontal: 24, width: '100%', maxWidth: 500, alignSelf: 'center' },
  headerContainer: { marginBottom: 30, alignItems: 'center' },
  title: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#AAA', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  formContainer: { width: '100%' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 16, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  button: { backgroundColor: '#E50914', height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  backText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' }
});