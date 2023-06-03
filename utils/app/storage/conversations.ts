import { User } from '@chatbot-ui/core/types/auth';
import { Conversation } from '@chatbot-ui/core/types/chat';

import { Database } from '@chatbot-ui/core';

export const storageGetConversations = async (
  database: Database,
  user: User,
) => {
  return await database.getConversations(user);
};

export const storageUpdateConversations = async (
  database: Database,
  user: User,
  conversations: Conversation[],
) => {
  await database.updateConversations(user, conversations).then((success) => {
    if (!success) {
      console.error('Failed to update conversations');
    }
  });
};

export const storageDeleteConversations = async (
  database: Database,
  user: User,
) => {
  database.deleteConversations(user).then((success) => {
    if (!success) {
      console.error('Failed to delete conversations');
    }
  });
};
