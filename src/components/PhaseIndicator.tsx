import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PhaseIndicatorProps {
  currentPhase: string;
  usageCount: number;
  usageLimit: number;
}

const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  currentPhase,
  usageCount,
  usageLimit,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.bgSecondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderColor,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    phaseText: {
      color: theme.colors.textPrimary,
      fontSize: 14,
    },
    usageText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    phaseHighlight: {
      color: theme.colors.accentBlue,
      fontWeight: '500',
    },
    usageHighlight: {
      color: theme.colors.accentBlue,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.phaseText}>
            目前階段：<Text style={styles.phaseHighlight}>{currentPhase}</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.usageText}>
            今日使用：<Text style={styles.usageHighlight}>{usageCount}</Text>/{usageLimit} 次
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PhaseIndicator;
