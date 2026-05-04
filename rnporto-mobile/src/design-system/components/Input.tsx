import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type InputProps = TextInputProps & {
  label?: string;
  leading?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function Input({ label, leading, containerStyle, ...rest }: InputProps) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label ? (
        <Text variant="caption" color={t.fg.secondary}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: t.bg.elevated,
            borderColor: focused ? t.accent : t.line.divider,
            borderRadius: t.radius.md,
          },
        ]}
      >
        {leading ? <View style={{ marginRight: 8 }}>{leading}</View> : null}
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={t.fg.tertiary}
          style={[
            {
              flex: 1,
              color: t.fg.primary,
              fontFamily: t.fonts.sans,
              fontSize: 15,
              lineHeight: 20,
              padding: 0,
            },
            rest.style,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
