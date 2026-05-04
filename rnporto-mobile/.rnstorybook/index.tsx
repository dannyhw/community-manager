import { view } from "./storybook.requires";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { registerRootComponent } from "expo";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: (s) => AsyncStorage.getItem(s),
    setItem: (k, s) => AsyncStorage.setItem(k, s),
  },
  enableWebsockets: true,
});

registerRootComponent(StorybookUIRoot);

export default StorybookUIRoot;
