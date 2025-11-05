import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Animated,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, spacing } from '../config/theme';
import * as Location from 'expo-location';

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Merhaba! Haklarınız ve yasal süreçler hakkında sorularınızı yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const scrollViewRef = useRef(null);
  const inputContainerBottom = useRef(new Animated.Value(0)).current;

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard listener
  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        const keyboardHeight = e.endCoordinates.height;
        const bottomOffset =
          Platform.OS === 'android' ? keyboardHeight * 0.15 + spacing.md : 0;

        Animated.timing(inputContainerBottom, {
          toValue: bottomOffset,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(scrollToBottom, 100);
        });
      }
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(inputContainerBottom, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Konum alma
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Konum izni reddedildi');
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (err) {
        setLocationError('Konum alınamadı');
      }
    })();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const API_URL = 'http://<YOUR_LAN_IP>:8000/chat'; // kendi LAN IP'n

      const body = {
        question: text.trim(),
        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : null,
      };

      console.log('Gönderilen body:', body);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Hatası: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.answer) throw new Error('API beklenen yanıtı döndürmedi.');

      //  Yer bilgisi varsa özel render, yoksa normal text
      const hasPlaceData = data.place || data.places;

      let answerContent;

      if (hasPlaceData) {
        // Tek yer veya çoklu yer render
        const places = data.places || [data.place];

        answerContent = (
          <View>
            {/* Ana mesaj text'i */}
            <Text style={styles.assistantText}>{data.answer}</Text>

            {/* Her yer için harita butonu */}
            {places.map((place, idx) => (
              place && place.maps_link && (
                <TouchableOpacity
                  key={idx}
                  style={styles.mapButton}
                  onPress={() => Linking.openURL(place.maps_link)}
                >
                  <MaterialCommunityIcons name="map-marker" size={18} color="white" />
                  <Text style={styles.mapButtonText}>
                    {places.length > 1 ? `${idx + 1}. Haritada Gör` : '🗺️ Haritada Gör'}
                  </Text>
                </TouchableOpacity>
              )
            ))}
          </View>
        );
      } else {
        // Normal text mesaj
        answerContent = <Text>{data.answer}</Text>;
      }

      const assistantMessage = { role: 'assistant', content: answerContent };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Hata:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Üzgünüm, bir hata oluştu: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(inputText);
  const handleSuggestedQuestion = (q) => sendMessage(q);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="robot" size={32} color={theme.light.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Destek Asistanı</Text>
            <Text style={styles.headerSubtitle}>Haklarınız hakkında soru sorun</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
          <Text style={{ color: 'gray' }}>
            {locationError
              ? locationError
              : location
              ? 'Konum alındı ✅'
              : 'Konum alınıyor...'}
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {message.role === 'assistant' && (
                <MaterialCommunityIcons
                  name="robot"
                  size={24}
                  color={theme.light.primary}
                  style={styles.messageIcon}
                />
              )}
              <View
                style={[
                  styles.messageContent,
                  message.role === 'user'
                    ? styles.userMessageContent
                    : styles.assistantMessageContent,
                ]}
              >
                {typeof message.content === 'string' ? (
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userText : styles.assistantText,
                    ]}
                    onPress={() => {
                      if (message.content.includes('https://')) {
                        const link = message.content.match(/https:\/\/\S+/)?.[0];
                        if (link) Linking.openURL(link);
                      }
                    }}
                  >
                    {message.content}
                  </Text>
                ) : (
                  message.content
                )}
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <MaterialCommunityIcons
                name="robot"
                size={24}
                color={theme.light.primary}
                style={styles.messageIcon}
              />
              <View style={styles.messageContent}>
                <ActivityIndicator size="small" color={theme.light.primary} />
                <Text style={styles.loadingText}>Yanıt hazırlanıyor...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <Animated.View style={[styles.inputContainer, { bottom: inputContainerBottom }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Sorunuzu yazın..."
              placeholderTextColor={theme.light.mutedForeground}
              multiline
              maxLength={500}
              editable={!isLoading}
              onSubmitEditing={handleSend}
              onFocus={scrollToBottom}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={!inputText.trim() || isLoading ? theme.light.mutedForeground : 'white'}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.light.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.light.border,
    backgroundColor: theme.light.card,
  },
  headerText: { marginLeft: spacing.md, flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.light.foreground },
  headerSubtitle: { fontSize: 14, color: theme.light.mutedForeground, marginTop: 2 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.lg, paddingBottom: 120 },
  messageBubble: { flexDirection: 'row', marginBottom: spacing.md, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  assistantBubble: { alignSelf: 'flex-start' },
  messageIcon: { marginTop: 4, marginHorizontal: spacing.sm },
  messageContent: { flex: 1, padding: spacing.md, borderRadius: 12 },
  userMessageContent: { backgroundColor: theme.light.primary },
  assistantMessageContent: {
    backgroundColor: theme.light.card,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  userText: { color: 'white' },
  assistantText: { color: theme.light.foreground },
  messageText: { fontSize: 15, lineHeight: 22 },
  loadingText: {
    fontSize: 14,
    color: theme.light.mutedForeground,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.light.border,
    backgroundColor: theme.light.card,
    position: 'relative',
  },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end' },
  input: {
    flex: 1,
    backgroundColor: theme.light.background,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: theme.light.foreground,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: { backgroundColor: theme.light.muted },

  // Harita butonu stilleri
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  mapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});
