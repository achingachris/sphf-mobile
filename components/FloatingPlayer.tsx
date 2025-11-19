import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayer } from './AudioPlayer';

export default function FloatingPlayer() {
  const { isPlaying, toggle, stop, title } = usePlayer();

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title ?? 'Swahilipot FM'}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => toggle()} style={styles.button} accessibilityLabel="Play or pause">
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stop()} style={[styles.button, styles.stop]} accessibilityLabel="Stop">
            <Ionicons name="stop" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    minWidth: 200,
    maxWidth: 640,
    opacity: 0.95,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 18,
    marginLeft: 6,
  },
  stop: {
    backgroundColor: '#ef4444',
  },
});
