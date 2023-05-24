import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { LearningResponse, Namespace } from '@/types/learning';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import { LEARNING_URL } from '../../const';
import { storageCreateMessage } from '../../storage/message';

import { Database } from '@chatbot-ui/core';
import { v4 as uuidv4 } from 'uuid';

export async function namespaceMessageSender(
  user: User,
  namespace: Namespace,
  database: Database,
  updatedConversation: Conversation,
  conversations: Conversation[],
  homeDispatch: React.Dispatch<any>,
) {
  const query = generateQuery(updatedConversation);
  const url = `${LEARNING_URL}/query?query=${query}&namespace=${namespace.namespace}&index=secondmuse`;
  const response = await fetch(url, { method: 'POST' });
  if (response.ok) {
    const body = await response.json();
    const learningResponse = body as LearningResponse;

    const content = learningResponse.message;

    const assistantMessageId = uuidv4();
    const responseMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: content,
      timestamp: getTimestampWithTimezoneOffset(),
    };

    // Saving the response message
    const { single, all } = storageCreateMessage(
      database,
      user,
      updatedConversation,
      responseMessage,
      conversations,
    );

    homeDispatch({
      field: 'selectedConversation',
      value: single,
    });

    homeDispatch({ field: 'conversations', value: all });
  }

  homeDispatch({ field: 'loading', value: false });
  homeDispatch({ field: 'messageIsStreaming', value: false });

  return;
}

const generateQuery = (conversation: Conversation) => {
  let query = '';

  for (const message of conversation.messages) {
    if (message.role === 'user') {
      query += `
user:
${message.content}
${message.timestamp}


`;
    } else if (message.role === 'assistant') {
      query += `
assistant:
${message.content}
${message.timestamp}


`;
    }
  }

  console.log(query);

  return query.trim();
};
