import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export function SheetHandle() {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
      <View
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: t.line.strong,
          opacity: 0.4,
        }}
      />
    </View>
  );
}
