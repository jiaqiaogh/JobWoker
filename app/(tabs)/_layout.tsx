import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle:{
          display:'none'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:'地图'
        }}
      />

      <Tabs.Screen
        name="square"
        options={{
          title:'信息广场'
        }}
      />

      <Tabs.Screen
        name="publish-square"
        options={{
          href:null
        }}
      />

      <Tabs.Screen
        name="publish-job"
        options={{
          href:null
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href:null
        }}
      />
    </Tabs>
  );
}