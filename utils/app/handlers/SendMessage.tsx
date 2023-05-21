import { MutableRefObject } from 'react';
import toast from 'react-hot-toast';

import { storageUpdateConversation } from '@/utils/app/storage/conversation';
import { storageCreateMessage } from '@/utils/app/storage/message';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { sendChatRequest } from '../chat';
import { injectKnowledgeOfPluginSystem } from '../plugins/systemPromptInjector';
import { messageReceiver } from './helpers/messageReceiver';

import { Database } from '@chatbot-ui/core';

export const sendHandlerFunction = async (
  user: User,
  message: Message,
  installedPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    homeDispatch({ field: 'loading', value: true });
    homeDispatch({ field: 'messageIsStreaming', value: true });

    let updatedConversation: Conversation;

    updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
    };

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

    // Saving the user message
    storageCreateMessage(
      database,
      user,
      selectedConversation,
      message,
      conversations,
    );

    let newPrompt = selectedConversation.prompt;

    // Make the chatbot aware of the installed plugins
    if (installedPlugins.length > 0) {
      newPrompt = injectKnowledgeOfPluginSystem(
        selectedConversation.prompt,
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
      return;
    }
    const data = response.body;
    if (!data) {
      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });
      return;
    }

    if (updatedConversation.messages.length === 1) {
      const { content } = message;
      const customName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;
      updatedConversation = {
        ...updatedConversation,
        name: customName,
      };

      // Saving the conversation name
      storageUpdateConversation(
        database,
        user,
        { ...selectedConversation, name: updatedConversation.name },
        conversations,
      );
    }
    homeDispatch({ field: 'loading', value: false });

    await messageReceiver(
      user,
      database,
      data,
      controller,
      installedPlugins,
      updatedConversation,
      conversations,
      stopConversationRef,
      apiKey,
      homeDispatch,
    );
  }
};
