import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { usePlayer } from '@/components/AudioPlayer';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function FmScreen() {
  const { isPlaying, toggle, stop } = usePlayer();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Swahilipot FM</ThemedText>
      <ThemedText style={styles.subtitle}>Live coastal stories, music, and culture.</ThemedText>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Now Playing</ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => toggle(undefined, 'Swahilipot FM')} style={styles.playButton} accessibilityLabel="Play or pause stream">
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stop()} style={[styles.playButton, styles.stopButton]} accessibilityLabel="Stop stream">
            <Ionicons name="stop" size={18} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.cardBody}>{isPlaying ? 'Live — Swahilipot FM' : 'Stopped'}</ThemedText>
        </View>
      </View>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Shows</ThemedText>
        <ThemedText style={styles.cardBody}>List scheduled shows and hosts.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
