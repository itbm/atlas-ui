import { IconDeviceLaptop } from '@tabler/icons-react';
import { FC, useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { getSavedSettingValue } from '@/utils/app/storage/local/settings';

import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import HomeContext from '@/pages/api/home/home.context';

export const SystemPromptSelect = () => {
  const { t } = useTranslation('systemPrompt');
  const {
    state: {
      selectedConversation,
      savedSettings,
      settings,
      systemPrompts,
      builtInSystemPrompts,
    },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const [availableSystemPrompts, setAvailableSystemPrompts] = useState<
    SystemPrompt[]
  >([]);
  const [defaultSystemPromptId, setDefaultSystemPromptId] = useState<
    string | null
  >(null);
  const [currentSystemPromptId, setCurrentSystemPromptId] = useState<string>(
    selectedConversation!.model.vendor,
  );

  useEffect(() => {
    if (selectedConversation && selectedConversation.systemPrompt) {
      setCurrentSystemPromptId(selectedConversation.systemPrompt.id);
    } else {
      setCurrentSystemPromptId(defaultSystemPromptId!);
    }
  }, [selectedConversation, defaultSystemPromptId]);

  const getDefaultSystemPrompt = useCallback(() => {
    const model = selectedConversation!.model;
    const sectionId = model.vendor.toLocaleLowerCase();
    const settingId = `${model.id}_default_system_prompt`;

    let systemPromptId = getSavedSettingValue(
      savedSettings,
      settings,
      sectionId,
      settingId,
    );

    if (!systemPromptId && builtInSystemPrompts.length > 0) {
      systemPromptId = builtInSystemPrompts.filter(
        (prompt) => prompt.name === `${model.vendor} Built-In`,
      )[0].id;
    }

    setDefaultSystemPromptId(systemPromptId);
  }, [savedSettings, settings, selectedConversation, builtInSystemPrompts]);

  useEffect(() => {
    getDefaultSystemPrompt();
  }, [availableSystemPrompts, getDefaultSystemPrompt, builtInSystemPrompts]);

  const getAvailableSystemPrompts = useCallback(() => {
    const model = selectedConversation!.model;

    const availablePrompts = systemPrompts.filter((prompt) =>
      prompt.models.includes(model.id),
    );

    const defaultSystemPrompt = builtInSystemPrompts.filter(
      (prompt) => prompt.name === `${model.vendor} Built-In`,
    )[0];

    if (defaultSystemPrompt) {
      availablePrompts.push(defaultSystemPrompt);
    }

    setAvailableSystemPrompts(availablePrompts);
  }, [selectedConversation, systemPrompts, builtInSystemPrompts]);

  useEffect(() => {
    if (systemPrompts) {
      getAvailableSystemPrompts();
    }
  }, [
    selectedConversation,
    systemPrompts,
    getAvailableSystemPrompts,
    builtInSystemPrompts,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const systemPrompt =
      systemPrompts.filter((prompt) => prompt.id === e.target.value)[0] || null;

    console.log('systemPrompt', systemPrompt);

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'systemPrompt',
        value: systemPrompt,
      });
  };

  return (
    <div
      className="
      w-full rounded-sm
      bg-transparent text-white
      bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
      dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
      bg-175% animate-bg-pan-slow appearance-none dark:bg-gray-700 hover:opacity-90
      "
    >
      <select
        className="text-left w-full bg-transparent p-1 text-sm"
        value={currentSystemPromptId}
        onChange={handleChange}
      >
        {availableSystemPrompts.map((prompt) => (
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
