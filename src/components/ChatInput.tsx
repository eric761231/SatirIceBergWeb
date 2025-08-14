import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onNewChat,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.bgSecondary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderColor,
    },
    inputArea: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    newChatButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.bgTertiary,
    },
    input: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.bgTertiary,
      borderRadius: theme.borderRadius.md,
      color: theme.colors.textPrimary,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.colors.borderColor,
    },
    sendButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.accentBlue,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 48,
      minHeight: 48,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.borderColor,
    },
    icon: {
      color: theme.colors.textPrimary,
    },
    sendIcon: {
      color: theme.colors.bgPrimary,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.inputArea}>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={onNewChat}
            disabled={isLoading}
          >
            <Icon name="add" size={20} style={styles.icon} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="輸入您的訊息..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={1000}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <Icon
              name="send"
              size={20}
              style={[
                styles.sendIcon,
                (!message.trim() || isLoading) && styles.icon,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;
