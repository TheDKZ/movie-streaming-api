import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Tıklanabilirliği garantilemek için hitSlop ekledik */}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Image 
          source={require('../app/assets/images/dkz-logo.png')} 
          style={styles.logoImage}
          resizeMode="contain" 
        />
        
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 10, // Menü butonunun her zaman en üstte kalmasını sağlar
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent', 
  },
  menuButton: {
    padding: 10, // Parmakla dokunma alanını genişlettik
  },
  logoImage: {
    height: 90, 
    width: 180, 
  },
  placeholder: {
    width: 40,
  },
});