import React from 'react';
import { View } from 'react-native';
import type { Preview } from '@storybook/react-native';

import { ThemeProvider, useTheme } from '@/design-system';

function Bg({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: t.bg.canvas }}>
      {children}
    </View>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Bg>
          <Story />
        </Bg>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
