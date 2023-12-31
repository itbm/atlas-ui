import {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { editMessageHandler } from '@/utils/app/handlers/EditMessage';
import { regenerateMessageHandler } from '@/utils/app/handlers/RegenerateMessage';
import { retryPluginHandlerFunction } from '@/utils/app/handlers/RetryPlugin';
import { sendHandlerFunction } from '@/utils/app/handlers/SendMessage';
import { throttle } from '@/utils/data/throttle';

import { InstalledPlugin } from '@/types/plugin';
import { Message } from '@chatbot-ui/core/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import { ErrorMessageDiv } from '../../../Common/ErrorMessageDiv';
import ChatContext from './Chat.context';
import { ChatInitialState, initialState } from './Chat.state';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { MemoizedChatMessage } from './MemoizedChatMessage';

interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat = memo(({ stopConversationRef }: Props) => {
  const { t } = useTranslation('chat');

  const chatContextValue = useCreateReducer<ChatInitialState>({
    initialState,
  });

  const {
    state: {
      selectedConversation,
      conversations,
      database,
      apiKey,
      serverSideApiKeyIsSet,
      modelError,
      loading,
      builtInSystemPrompts,
      user,
      installedPlugins,
      selectedNamespace,
      models,
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);

  const getRandomQuote = useCallback(() => {
    const quotes = [
      "Let's get started...",
      'A good day to start learning.',
      "Let's start learning.",
      "Let's build something.",
      'Try experimenting.',
      'Try something new.',
      'Try something different.',
      'Make something unique.',
      'Try something creative.',
      'Make something innovative.',
      'Create something original.',
      'Create something fresh.',
      'Try something novel.',
      'Try something unusual.',
      'Try something unconventional.',
      'Life is a learning process.',
      'Life is short, learn something new.',
      'Learning is a treasure that will follow its owner everywhere.',
      'Learning is not attained by chance, it must be sought for with ardor and diligence.',
      'Learning is not a spectator sport.',
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const [quote, setQuote] = useState<string>(getRandomQuote());
  const [lastConversation, setLastConversation] =
    useState(selectedConversation);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(sendHandlerFunction, [
    apiKey,
    conversations,
    homeDispatch,
    selectedConversation,
    stopConversationRef,
    database,
  ]);

  const handleEdit = useCallback(editMessageHandler, [
    apiKey,
    conversations,
    homeDispatch,
    selectedConversation,
    stopConversationRef,
    database,
  ]);

  const handleRegenerate = useCallback(regenerateMessageHandler, [
    apiKey,
    conversations,
    homeDispatch,
    selectedConversation,
    stopConversationRef,
    database,
  ]);

  const handleRetryPlugin = (message: Message) => {
    retryPluginHandlerFunction(
      user,
      models,
      message,
      installedPlugins,
      stopConversationRef,
      selectedConversation,
      conversations,
      database,
      apiKey,
      homeDispatch,
    );
  };

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    throttledScrollDown();
    selectedConversation &&
      setCurrentMessage(
        selectedConversation.messages[selectedConversation.messages.length - 2],
      );
  }, [selectedConversation, throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  useEffect(() => {
    if (lastConversation && selectedConversation) {
      if (lastConversation.id !== selectedConversation.id) {
        setLastConversation(selectedConversation);
        setQuote(getRandomQuote());
      }
    }
  }, [selectedConversation, getRandomQuote, lastConversation]);

  return (
    <ChatContext.Provider value={{ ...chatContextValue, handleRetryPlugin }}>
      <div
        className="relative flex-1 overflow-hidden bg-theme-light dark:bg-theme-dark
      "
      >
        {!(apiKey || serverSideApiKeyIsSet) ? (
          <div className="mx-auto flex h-full w-[300px] flex-col justify-center space-y-6 sm:w-[600px]">
            <div className="text-center text-4xl font-bold text-black dark:text-white">
              Welcome to Atlas UI
            </div>
          </div>
        ) : modelError ? (
          <ErrorMessageDiv error={modelError} />
        ) : (
          <>
            <div
              className="max-h-full h-full overflow-x-hidden"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              {selectedConversation?.messages.length === 0 ? (
                <div className="h-full w-full px-4 flex flex-col self-center items-center align-middle justify-center select-none">
                  <div className="text-center text-black dark:text-white mb-2 text-xl font-light">
                    {quote}
                  </div>
                  <div className="animate-zoom-pulse-slow">
                    <div className="flex flex-row self-center items-center align-middle justify-center">
                      <div
                        className="absolute h-[52px] w-[36px] z-0 right-[-20px] font-bold text-2xl
                        text-neutral-700 dark:text-neutral-300 rounded-r-2xl shadow-xl
                        bg-[#d8d9db] dark:bg-[#58595b]"
                      ></div>
                      <div
                        className="h-[54px] z-10 flex flex-row self-center items-start align-middle justify-center
                          w-fit bg-[#e7eaf5] dark:bg-[#1b1f23] rounded-2xl px-2 py-1 shadow-xl"
                      >
                        <div
                          className="flex flex-row self-center items-end align-middle justify-center text-transparent 
                          bg-gradient-to-r from-fuchsia-700 via-violet-900 to-indigo-500
                          dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
                          bg-clip-text bg-175% animate-bg-pan-fast rotate-0"
                        >
                          <div className="text-5xl font-semibold">ATLAS</div>
                        </div>
                      </div>
                      <div
                        className="absolute -rotate-90 right-[-21px] font-mono font-normal text-lg
                        text-[#ff9532] dark:text-[#c7e33a]"
                      >
                        UI
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {selectedConversation?.messages.map((message, index) => (
                    <MemoizedChatMessage
                      key={index}
                      message={message}
                      messageIndex={index}
                      onEdit={(conversation, editedMessage) => {
                        setCurrentMessage(editedMessage);
                        // discard edited message and the ones that come after then resend
                        handleEdit(
                          user,
                          models,
                          installedPlugins,
                          editedMessage,
                          index,
                          stopConversationRef,
                          builtInSystemPrompts,
                          conversation,
                          conversations,
                          database,
                          apiKey,
                          homeDispatch,
                        );
                      }}
                    />
                  ))}

                  {loading && <ChatLoader />}

                  <div
                    className="h-[100px] sm:h-[162px] bg-theme-light dark:bg-theme-dark"
                    ref={messagesEndRef}
                  />
                </>
              )}
            </div>

            <ChatInput
              stopConversationRef={stopConversationRef}
              textareaRef={textareaRef}
              onSend={(conversation, message) => {
                setCurrentMessage(message);
                handleSend(
                  user,
                  models,
                  selectedNamespace,
                  message,
                  installedPlugins,
                  stopConversationRef,
                  builtInSystemPrompts,
                  conversation,
                  conversations,
                  database,
                  apiKey,
                  homeDispatch,
                );
              }}
              onScrollDownClick={handleScrollDown}
              onRegenerate={(conversation) => {
                if (currentMessage) {
                  handleRegenerate(
                    user,
                    models,
                    installedPlugins,
                    stopConversationRef,
                    builtInSystemPrompts,
                    conversation,
                    conversations,
                    database,
                    apiKey,
                    homeDispatch,
                  );
                }
              }}
              showScrollDownButton={showScrollDownButton}
            />
          </>
        )}
      </div>
    </ChatContext.Provider>
  );
});
Chat.displayName = 'Chat';
