import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Şifre modal state'leri
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch('http://192.168.2.228:5069/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); 
      } else {
        await AsyncStorage.removeItem('userToken');
        router.replace('/login');
      }
    } catch (error) {
      console.error("Profil çekilirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      "Emin misin? Bu işlem geri alınamaz ve tüm verilerin kalıcı olarak silinir.",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Evet, Sil", 
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              const response = await fetch('http://192.168.2.228:5069/api/auth/me', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });

              if (response.ok) {
                await AsyncStorage.removeItem('userToken');
                router.replace('/login');
              }
            } catch (error) {
              Alert.alert("Hata", "Bağlantı sorunu yaşandı.");
            }
          }
        }
      ]
    );
  };

  // --- ŞİFRE DEĞİŞTİRME BACKEND ENTEGRASYONU ---
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.2.228:5069/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", data.message || "Şifreniz başarıyla güncellendi.");
        setOldPassword('');
        setNewPassword('');
        setPasswordModalVisible(false);
      } else {
        Alert.alert("Hata", data.message || "Mevcut şifreniz hatalı!");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profilim</Text>
      </View>

      <View style={styles.content}>
        {/* PROFİL KARTI */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.name || "Kullanıcı Adı"}</Text>
            <Text style={styles.userEmail}>{userData?.email || "E-Posta Yükleniyor..."}</Text>
          </View>
        </View>

        {/* FİLM KÜTÜPHANEM */}
        <Text style={styles.sectionTitle}>Kütüphanem</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-list')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="bookmark-outline" size={22} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Listem</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/liked-movies')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="heart-outline" size={22} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Beğendiğim Filmler</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* HESAP AYARLARI */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Hesap Ayarları</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setPasswordModalVisible(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={22} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Şifreyi Değiştir</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleDeleteAccount}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={22} color="#E50914" style={styles.menuIcon} />
              <Text style={styles.deleteText}>Hesabımı Sil</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ŞİFRE MODALI */}
      <Modal visible={isPasswordModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Mevcut Şifre" placeholderTextColor="#666" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Yeni Şifre" placeholderTextColor="#666" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword} disabled={isChangingPassword}>
              {isChangingPassword ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>Şifreyi Güncelle</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backButton: { marginRight: 16 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F0F0F', padding: 20, borderRadius: 12, marginBottom: 30, borderWidth: 1, borderColor: '#1A1A1A' },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userInfo: { flex: 1 },
  userName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { color: '#888', fontSize: 14 },

  sectionTitle: { color: '#888', fontSize: 14, fontWeight: '600', marginBottom: 10, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },
  menuContainer: { backgroundColor: '#0F0F0F', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#1A1A1A' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 12 },
  menuText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  deleteText: { color: '#E50914', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0F0F0F', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: '#1A1A1A' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  inputWrapper: { backgroundColor: '#1A1A1A', borderRadius: 8, marginBottom: 16, paddingHorizontal: 16, height: 56, justifyContent: 'center' },
  input: { color: '#FFF', fontSize: 16 },
  saveButton: { backgroundColor: '#E50914', height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});