import { IconMistOff } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getTimestampWithTimezoneOffset } from '@/../chatbot-ui-core/utils/time';
import { LEARNING_URL } from '@/utils/app/const';

import { LearningFile } from '@/types/learning';

import HomeContext from '@/pages/api/home/home.context';

import { AddFileButton } from './components/AddFileButton';
import { AddURLButton } from './components/AddURLButton';
import { FileList } from './components/FilesList';
import Search from '@/components/Common/Search';

import LearningScreenContext from './LearningScreen.context';
import {
  LearningScreenInitialState,
  initialState,
} from './LearningScreen.state';

export const LearningScreen = () => {
  const { t } = useTranslation('sidebar');

  const learningScreenContextValue =
    useCreateReducer<LearningScreenInitialState>({
      initialState,
    });

  const {
    state: { searchQuery, filteredFiles },
    dispatch: learningScreenDispatch,
  } = learningScreenContextValue;

  const {
    state: { user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  // FILE OPERATIONS  --------------------------------------------
  const handleAddFile = async (file: Blob) => {};

  const handleAddLink = async (url: string, recurse: false) => {};

  const handleRemoveFile = async (fileId: string) => {};

  const fetchFiles = async (query: string) => {
    if (!query) {
      const response = await fetch(`${LEARNING_URL}`);
      if (response.ok) {
        const data = await response.json();
        learningScreenDispatch({
          field: 'filteredFiles',
          value: data,
        });
      }
    } else {
      const response = await fetch(`${LEARNING_URL}/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        learningScreenDispatch({
          field: 'filteredFiles',
          value: data,
        });
      }
    }
  };

  const files: LearningFile[] = [
    {
      id: '1',
      name: 'Atari Recursive',
      url: 'https://www.atari.com',
      type: 'link',
      tags: 'test',
      timestamp: 'May 21, 2023',
    },

    {
      id: '2',
      name: 'Research Paper',
      url: 'https://www.google.com',
      type: 'document',
      tags: 'test',
      timestamp: 'May 20, 2023',
    },
  ];

  // useEffect(() => {
  //   fetchFiles(searchQuery);
  // }, [searchQuery, learningScreenDispatch]);

  const doSearch = (query: string) =>
    learningScreenDispatch({ field: 'searchQuery', value: query });

  return (
    <LearningScreenContext.Provider
      value={{
        ...learningScreenContextValue,
        handleAddFile,
        handleAddLink,
        handleRemoveFile,
      }}
    >
      <div className="flex items-center gap-2">
        <AddFileButton />
        <AddURLButton />
      </div>
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchQuery}
        onSearch={doSearch}
      />
      <FileList files={files} />
    </LearningScreenContext.Provider>
  );
};
