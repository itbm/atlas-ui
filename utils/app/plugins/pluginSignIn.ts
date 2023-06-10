import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { PluginCall } from '@/types/plugin';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { v4 as uuidv4 } from 'uuid';

export const addPluginSignInBox = async (
  call: PluginCall,
  conversation: Conversation,
  homeDispatch: React.Dispatch<any>,
) => {
  const assistantMessageId = uuidv4();
  conversation.messages.push({
    id: assistantMessageId,
    role: 'auth',
    content: `${JSON.stringify(call)}`,
    plugin: call.plugin.manifest.id,
    timestamp: getTimestampWithTimezoneOffset(),
  });
  const length = conversation.messages.length;

  homeDispatch({
    field: 'selectedConversation',
    value: conversation,
  });

  return conversation.messages[length - 1];
};
