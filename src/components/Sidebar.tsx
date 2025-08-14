import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
const MINI_SIDEBAR_WIDTH = 56;
const FULL_SIDEBAR_WIDTH = 280;

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth] = useState(new Animated.Value(FULL_SIDEBAR_WIDTH));

  const toggleSidebar = () => {
    const toValue = isCollapsed ? FULL_SIDEBAR_WIDTH : MINI_SIDEBAR_WIDTH;
    
    Animated.timing(sidebarWidth, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsCollapsed(!isCollapsed);
  };

  const styles = StyleSheet.create({
    sidebar: {
      width: sidebarWidth,
      backgroundColor: theme.colors.bgSecondary,
      borderRightWidth: 1,
      borderRightColor: theme.colors.borderColor,
      height: '100%',
    },
    header: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderColor,
      alignItems: 'center',
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.accentBlue,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    userName: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
    },
    toggleButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.bgTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    miniContent: {
      alignItems: 'center',
      paddingTop: 60,
    },
  });

  return (
    <Animated.View style={styles.sidebar}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
        <Icon
          name={isCollapsed ? 'menu' : 'chevron-left'}
          size={20}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.userAvatar}>
          <Icon name="person" size={24} color={theme.colors.textPrimary} />
        </View>
        {!isCollapsed && (
          <Text style={styles.userName}>用戶</Text>
        )}
      </View>

      <View style={[styles.content, isCollapsed && styles.miniContent]}>
        {isCollapsed ? (
          <View style={styles.miniContent}>
            <Icon name="chat" size={24} color={theme.colors.textSecondary} />
            <Icon name="history" size={24} color={theme.colors.textSecondary} style={{ marginTop: 16 }} />
            <Icon name="settings" size={24} color={theme.colors.textSecondary} style={{ marginTop: 16 }} />
          </View>
        ) : (
          children
        )}
      </View>
    </Animated.View>
  );
};

export default Sidebar;
