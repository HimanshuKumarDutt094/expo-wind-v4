#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to execute shell commands
function runCommand(command, options = {}) {
  try {
    console.log(`Running command: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Failed to run command: ${command}`);
    process.exit(1);
  }
}

// Step 1: Check and Enable Corepack
function enableCorepack() {
  try {
    execSync('corepack --version', { stdio: 'ignore' });
  } catch {
    console.log('Corepack not found. Installing...');
    runCommand('npm install -g corepack');
  }
  runCommand('corepack enable');
}

// Step 2: Create an Expo project using Yarn
function createExpoProject(projectName) {
  runCommand(`yarn create expo-app ${projectName}`);
}

// Step 3: Install NativeWind and dependencies
function installNativeWind(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  // Ensure the project directory exists
  if (!fs.existsSync(projectPath)) {
    console.error(`Project directory ${projectPath} does not exist.`);
    process.exit(1);
  }

  // Change into the project directory if not already there
  if (process.cwd() !== projectPath) {
    process.chdir(projectPath);
  }

  runCommand('yarn add nativewind@^4.0.1 react-native-reanimated tailwindcss @react-native-async-storage/async-storage');

}

// Step 4: Create configuration files
function setupConfigurations(projectName) {
  const projectPath = path.join(process.cwd());

  // Ensure the project directory exists
  if (!fs.existsSync(projectPath)) {
    console.error(`Project directory ${projectPath} does not exist.`);
    process.exit(1);
  }

  // Change into the project directory if not already there
  if (process.cwd() !== projectPath) {
    process.chdir(projectPath);
  }

  // Create or update configuration files
  const configFiles = [
    {
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
    },
    {
      path: 'global.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
    },
    {
      path: 'babel.config.js',
      content: `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
`,
    },
    {
      path: 'metro.config.js',
      content: `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
`,
    },
    {
      path: 'nativewind-env.d.ts',
      content: `/// <reference types="nativewind/types" />
`,
    },{path:"./app/(tabs)/explore.tsx",content:`import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons
          size={310}
          name="code-slash"
          style={{ color: "#808080" }}
          className="bottom-[90px]
    left-[-35px]
    absolute"
        />
      }
    >
      <ThemedView className="flex-row gap-2">
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          and{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
          in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the{" "}
          <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
          provide files for different screen densities
        </ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText>{" "}
          to see how to load{" "}
          <ThemedText style={{ fontFamily: "SpaceMono" }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{" "}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook
          lets you inspect what the user's current color scheme is, and so you
          can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{" "}
          <ThemedText type="defaultSemiBold">
            components/HelloWave.tsx
          </ThemedText>{" "}
          component uses the powerful{" "}
          <ThemedText type="defaultSemiBold">
            react-native-reanimated
          </ThemedText>{" "}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The{" "}
              <ThemedText type="defaultSemiBold">
                components/ParallaxScrollView.tsx
              </ThemedText>{" "}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}
`},{
path:"./app/(tabs)/index.tsx",
content:`import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          className="absolute w-[290px] h-[178px] bottom-0 left-0"
        />
      }
    >
      <ThemedView  className="flex-row items-center gap-2">
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle" className="bg-red-500">
          Step 1: Try it
        </ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
`
},
{
path:"./context/authentication-context.tsx",
content:`
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

interface User {
  token: string | undefined;
  userId: string | undefined;
  isLoading: boolean;
  isError: boolean;

  setToken: (v: string | undefined) => void;
}

interface AuthenticationContextProps {
  children: React.ReactNode;
}

const AuthContext = createContext<User | undefined>(undefined);
SplashScreen.preventAutoHideAsync();
export const AuthenticationContext: React.FC<AuthenticationContextProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const isUserAuthenticated = async () => {
      try {
        const authToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("getting token", authToken, "getting userId", storedUserId);
        if (authToken && storedUserId) {
          setToken(authToken);
          setUserId(storedUserId);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };

    isUserAuthenticated();
  }, []);

  const handleSetToken = async (v: string | undefined) => {
    try {
      if (v) {
        await AsyncStorage.setItem("token", v);
        console.log("setting token", v);
      } else {
        await AsyncStorage.removeItem("token");
      }
      setToken(v);
    } catch {
      setIsError(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, isLoading, isError, setToken: handleSetToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): {
  token: string | undefined;
  isLoading: boolean;
  isError: boolean;
  userId: string | undefined;
  setToken: (v: string | undefined) => void;
} => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside the Provider");
  }

  return authContextValue;
};

`}
  ];
fs.mkdirSync("context")
  configFiles.forEach(({ path, content }) => {
    fs.writeFileSync(path, content);
  });


  // Update app/_layout.tsx
  const layoutTsxPath = path.join('app', '_layout.tsx');
 
  const updatedLayoutTsx = `import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticationContext } from "../context/authentication-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthenticationContext>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthenticationContext>
    </ThemeProvider>
  );
}

`;
  fs.writeFileSync(layoutTsxPath, updatedLayoutTsx);
}

// Main function to execute setup
function main() {
  const projectName = process.argv[2];
  if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
  }

  enableCorepack();
  createExpoProject(projectName);
  
  // Wait for the project to be created before proceeding
  const projectPath = path.join(process.cwd(), projectName);
  if (!fs.existsSync(projectPath)) {
    console.error(`Project creation failed. Directory ${projectPath} does not exist.`);
    process.exit(1);
  }

  installNativeWind(projectName);
  setupConfigurations(projectName);

  console.log('Setup complete!');
}

main();

