import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import PhaseIndicator from '../components/PhaseIndicator';
import { ChatMessage as ChatMessageType, ChatState } from '../types/chat';

const { width: screenWidth } = Dimensions.get('window');

const ChatScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: '最近有什麼讓您感到困擾的事件或行為嗎？',
        isAI: true,
        timestamp: new Date(),
        phase: '初始探索',
      },
    ],
    currentPhase: '初始探索',
    isLoading: false,
    usageCount: 0,
    usageLimit: 50,
  });

  const [sidebarVisible, setSidebarVisible] = useState(
    screenWidth > 768 // 桌面版預設顯示側邊欄
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bgPrimary,
    },
    header: {
      padding: theme.spacing.md,
      paddingTop: insets.top + theme.spacing.md,
      backgroundColor: theme.colors.bgSecondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderColor,
    },
    headerText: {
      color: theme.colors.textPrimary,
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      flexDirection: 'row',
    },
    mainContent: {
      flex: 1,
      backgroundColor: theme.colors.bgPrimary,
    },
    chatContainer: {
      flex: 1,
      padding: theme.spacing.md,
    },
    thinkingIndicator: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.bgTertiary,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    thinkingText: {
      color: theme.colors.textPrimary,
      marginRight: theme.spacing.sm,
    },
    thinkingDots: {
      flexDirection: 'row',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.accentBlue,
      marginHorizontal: 2,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
  });

  // 模擬 AI 回應
  const simulateAIResponse = async (userMessage: string) => {
    setChatState(prev => ({ ...prev, isLoading: true }));

    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiResponses = [
      '我理解您的困擾，讓我們一起來分析這個情況。',
      '這是一個很好的觀察，您能告訴我更多細節嗎？',
      '根據您描述的情況，我建議我們從以下幾個角度來思考...',
      '您的感受是完全可以理解的，讓我們探索一下可能的解決方案。',
    ];

    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: randomResponse,
      isAI: true,
      timestamp: new Date(),
      phase: chatState.currentPhase,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: false,
      usageCount: prev.usageCount + 1,
    }));
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: message,
      isAI: false,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // 滾動到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // 模擬 AI 回應
    await simulateAIResponse(message);
  };

  const handleNewChat = () => {
    Alert.alert(
      '開始新對話',
      '確定要開始新的對話嗎？當前的對話記錄將會被清除。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確定',
          style: 'destructive',
          onPress: () => {
            setChatState(prev => ({
              ...prev,
              messages: [
                {
                  id: '1',
                  content: '最近有什麼讓您感到困擾的事件或行為嗎？',
                  isAI: true,
                  timestamp: new Date(),
                  phase: '初始探索',
                },
              ],
              currentPhase: '初始探索',
              usageCount: 0,
            }));
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} />
  );

  const renderThinkingIndicator = () => {
    if (!chatState.isLoading) return null;

    return (
      <View style={styles.thinkingIndicator}>
        <Text style={styles.thinkingText}>正在思考...</Text>
        <View style={styles.thinkingDots}>
          <View style={[styles.dot, { opacity: 0.3 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 1 }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SKOPOS</Text>
      </View>

      <View style={styles.content}>
        {sidebarVisible && (
          <Sidebar>
            <View style={{ padding: theme.spacing.md }}>
              <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
                側邊欄內容
              </Text>
            </View>
          </Sidebar>
        )}

        <View style={styles.mainContent}>
          <PhaseIndicator
            currentPhase={chatState.currentPhase}
            usageCount={chatState.usageCount}
            usageLimit={chatState.usageLimit}
          />

          <FlatList
            ref={flatListRef}
            data={chatState.messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderThinkingIndicator}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />

          <ChatInput
            onSendMessage={handleSendMessage}
            onNewChat={handleNewChat}
            isLoading={chatState.isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
