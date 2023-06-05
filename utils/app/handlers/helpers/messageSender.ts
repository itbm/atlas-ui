import toast from 'react-hot-toast';

import { InstalledPlugin } from '@/types/plugin';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { sendChatRequest } from '../../chat';
import { injectKnowledgeOfPluginSystem } from '../../plugins/awarenessInjectorPrompt';

export async function messageSender(
  updatedConversation: Conversation,
  installedPlugins: InstalledPlugin[],
  selectedConversation: Conversation,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) {
  console.log('selectedConversation', selectedConversation);

  let newPrompt = selectedConversation.systemPrompt;

  // Make the chatbot aware of the installed plugins
  if (installedPlugins.length > 0) {
    newPrompt = injectKnowledgeOfPluginSystem(
      selectedConversation.systemPrompt,
      installedPlugins,
    );
  }

  const pluginInjectedConversation = {
    ...updatedConversation,
    prompt: newPrompt,
  };

  const { response, controller } = await sendChatRequest(
    pluginInjectedConversation,
    apiKey,
  );

  if (!response.ok) {
    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });
    toast.error(response.statusText);
    return { data: null, controller: null };
  }
  const data = response.body;
  if (!data) {
    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });
    return { data: null, controller: null };
  }

  homeDispatch({ field: 'loading', value: false });
  return { data, controller };
}
