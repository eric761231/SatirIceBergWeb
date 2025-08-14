import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: message.isAI ? 'flex-start' : 'flex-end',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: message.isAI 
        ? theme.colors.bgTertiary 
        : theme.colors.accentBlue,
    },
    messageText: {
      color: message.isAI 
        ? theme.colors.textPrimary 
        : theme.colors.bgPrimary,
      fontSize: 16,
      lineHeight: 24,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: message.isAI ? 'left' : 'right',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: message.isAI 
        ? theme.colors.accentBlue 
        : theme.colors.bgTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
    },
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {message.isAI && (
        <View style={styles.avatar}>
          <Text style={{ color: theme.colors.bgPrimary, fontSize: 16 }}>AI</Text>
        </View>
      )}
      
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {!message.isAI && (
        <View style={styles.avatar}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 16 }}>我</Text>
        </View>
      )}
    </View>
  );
};

export default ChatMessage;
