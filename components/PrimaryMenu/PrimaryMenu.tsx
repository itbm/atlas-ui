import {
  IconApps,
  IconBrain,
  IconBulb,
  IconDeviceLaptop,
  IconMessages,
} from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';
import { Conversations } from './components/Menu/components/Screens/Conversations/Conversations';
import { LearningScreen } from './components/Menu/components/Screens/Learning/LearningScreen';
import { PluginCatalog } from './components/Menu/components/Screens/Plugins/PluginCatalog';
import Prompts from './components/Menu/components/Screens/Prompts/Prompts';
import SystemPrompts from './components/Menu/components/Screens/SystemPrompts/SystemPrompts';

import PrimaryMenuContext from './PrimaryMenu.context';
import { PrimaryMenuInitialState, initialState } from './PrimaryMenu.state';

export const PrimaryMenu = () => {
  const primaryMenuContextValue = useCreateReducer<PrimaryMenuInitialState>({
    initialState,
  });

  const icons = [
    <IconMessages size={28} key={0} />,
    <IconBulb size={28} key={1} />,
    <IconDeviceLaptop size={28} key={2} />,
    <IconApps size={28} key={3} />,
    <IconBrain size={28} key={4} />,
  ];

  const screens = [
    <Conversations key={0} />,
    <Prompts key={1} />,
    <SystemPrompts key={2} />,
    <PluginCatalog key={3} />,
    <LearningScreen key={4} />,
  ];

  return (
    <PrimaryMenuContext.Provider value={primaryMenuContextValue}>
      <ActivityBar icons={icons}></ActivityBar>
      <Menu screens={screens}></Menu>
    </PrimaryMenuContext.Provider>
  );
};
