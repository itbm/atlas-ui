import { IconDeviceLaptop } from '@tabler/icons-react';
import { FC, useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';

import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  systemPrompts: SystemPrompt[];
}

export const SystemPromptSelect = () => {
  const { t } = useTranslation('systemPrompt');

  const {
    state: { selectedConversation, defaultSystemPromptId, systemPrompts },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const content = injectedSystemPrompts.filter(
      (prompt) => prompt.id === e.target.value,
    )[0].content;

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'prompt',
        value: content,
      });
  };

  const builtInSystemPrompt: SystemPrompt = {
    id: '0',
    name: 'Built-in',
    content: DEFAULT_SYSTEM_PROMPT,
  };
  const injectedSystemPrompts = [builtInSystemPrompt, ...systemPrompts];

  const conversationPromptId =
    injectedSystemPrompts.filter(
      (prompt) => prompt.content === selectedConversation?.prompt,
    )[0]?.id || builtInSystemPrompt.id;
  return (
    <div
      className={`w-full rounded-sm border border-theme-border-light dark:border-theme-border-dark
      bg-transparent text-black dark:text-white`}
    >
      <select
        className="text-left w-full bg-transparent p-1"
        value={conversationPromptId}
        onChange={handleChange}
      >
        {injectedSystemPrompts.map((prompt) => (
          <option
            key={prompt.id}
            value={prompt.id}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {prompt.id === defaultSystemPromptId
              ? `${t('Default')} (${prompt.name})`
              : prompt.name}
          </option>
        ))}
      </select>
    </div>
  );
};