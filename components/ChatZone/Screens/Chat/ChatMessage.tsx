import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconRobot,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { FC, memo, useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { executeApiCall } from '@/utils/app/plugins/autoExecutor';
import { findPluginById } from '@/utils/app/plugins/finder';
import { storageDeleteMessages } from '@/utils/app/storage/messages';

import { InstalledPlugin, PluginCall } from '@/types/plugin';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import { CodeBlock } from '@/components/Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '@/components/Markdown/MemoizedReactMarkdown';

import ChatContext from './Chat.context';

import querystring from 'querystring';
import rehypeMathjax from 'rehype-mathjax';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export interface Props {
  message: Message;
  messageIndex: number;
  onEdit?: (conversation: Conversation, editedMessage: Message) => void;
}

export const ChatMessage: FC<Props> = memo(
  ({ message, messageIndex, onEdit }) => {
    const { t } = useTranslation('chat');

    const { handleRetryPlugin } = useContext(ChatContext);

    const {
      state: {
        selectedConversation,
        conversations,
        messageIsStreaming,
        database,
        user,
        installedPlugins,
      },
      dispatch: homeDispatch,
    } = useContext(HomeContext);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [messageContent, setMessageContent] = useState(message.content);
    const [messagedCopied, setMessageCopied] = useState(false);

    const [plugin, setPlugin] = useState<InstalledPlugin | undefined>();
    const [authUrl, setAuthUrl] = useState<string | undefined>();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setMessageContent(event.target.value);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const handleEditMessage = () => {
      if (message.content != messageContent) {
        if (selectedConversation && onEdit) {
          onEdit(selectedConversation, { ...message, content: messageContent });
        }
      }
      setIsEditing(false);
    };

    const handleDeleteMessage = () => {
      if (!selectedConversation) return;

      const { messages } = selectedConversation;
      const findIndex = messages.findIndex((elm) => elm === message);

      let messagesToBeDeleted = [];
      if (findIndex < 0) return;

      if (
        findIndex < messages.length - 1 &&
        messages[findIndex + 1].role === 'assistant'
      ) {
        messagesToBeDeleted.push(
          messages[findIndex].id,
          messages[findIndex + 1].id,
        );
        messages.splice(findIndex, 2);
      } else {
        messagesToBeDeleted.push(messages[findIndex].id);
        messages.splice(findIndex, 1);
      }

      const { single, all } = storageDeleteMessages(
        database,
        user,
        messagesToBeDeleted,
        selectedConversation,
        messages,
        conversations,
      );
      homeDispatch({ field: 'selectedConversation', value: single });
      homeDispatch({ field: 'conversations', value: all });
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
        e.preventDefault();
        handleEditMessage();
      }
    };

    const copyOnClick = () => {
      if (!navigator.clipboard) return;

      navigator.clipboard.writeText(message.content).then(() => {
        setMessageCopied(true);
        setTimeout(() => {
          setMessageCopied(false);
        }, 2000);
      });
    };

    useEffect(() => {
      setMessageContent(message.content);
    }, [message.content]);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [isEditing]);

    useEffect(() => {
      if (message.plugin && !plugin) {
        const plugin = findPluginById(message.plugin, installedPlugins);
        setPlugin(plugin);

        if (plugin) {
          const url = `${
            plugin.manifest.auth.authorization_url
          }?${querystring.stringify({
            scope: plugin.manifest.auth.scope,
          })}`;
          setAuthUrl(url);
        }
      }
    }, [message.plugin, installedPlugins, plugin]);

    return (
      <div
        className={`sm:px-4 lg:px-8
        ${
          message.role === 'assistant'
            ? 'bg-gray-200 text-gray-800 dark:bg-[#444654] dark:text-gray-100'
            : 'bg-theme-light text-gray-800 dark:bg-theme-dark dark:text-gray-100'
        }`}
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className="group relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
          <div className="min-w-[40px] text-right font-bold">
            {message.role === 'assistant' && !plugin?.manifest.logo_url && (
              <IconRobot size={30} />
            )}
            {message.role === 'assistant' && plugin?.manifest.logo_url && (
              <Image
                alt={'Plugin Logo'}
                src={plugin?.manifest.logo_url}
                width={30}
                height={30}
              />
            )}
            {message.role === 'auth' && plugin?.manifest.logo_url && (
              <Image
                alt={'Plugin Logo'}
                src={plugin?.manifest.logo_url}
                width={30}
                height={30}
              />
            )}
            {message.role === 'user' && <IconUser size={30} />}
          </div>

          <div className="prose mt-[-2px] w-full dark:prose-invert">
            {message.role === 'user' && (
              <div className="flex w-full">
                {isEditing ? (
                  <div className="flex w-full flex-col">
                    <textarea
                      ref={textareaRef}
                      className="w-full resize-none whitespace-pre-wrap border-none bg-theme-light dark:bg-theme-dark"
                      value={messageContent}
                      onChange={handleInputChange}
                      onKeyDown={handlePressEnter}
                      onCompositionStart={() => setIsTyping(true)}
                      onCompositionEnd={() => setIsTyping(false)}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        padding: '0',
                        margin: '0',
                        overflow: 'hidden',
                      }}
                    />

                    <div className="mt-10 flex justify-center space-x-4">
                      <button
                        className="h-[40px] rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white enabled:hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleEditMessage}
                        disabled={messageContent.trim().length <= 0}
                      >
                        {t('Save & Submit')}
                      </button>
                      <button
                        className="h-[40px] rounded-md border border-neutral-300 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        onClick={() => {
                          setMessageContent(message.content);
                          setIsEditing(false);
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
                    {message.content}
                  </div>
                )}

                {!isEditing && (
                  <div className="md:-mr-8 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={toggleEditing}
                    >
                      <IconEdit size={20} />
                    </button>
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={handleDeleteMessage}
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {message.role === 'assistant' && (
              <div className="flex flex-row">
                <MemoizedReactMarkdown
                  className="prose dark:prose-invert flex-1"
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeMathjax, rehypeRaw]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      if (children.length) {
                        if (children[0] == '▍') {
                          return (
                            <span className="animate-pulse cursor-default mt-1">
                              ▍
                            </span>
                          );
                        }

                        children[0] = (children[0] as string).replace(
                          '`▍`',
                          '▍',
                        );
                      }

                      const match = /language-(\w+)/.exec(className || '');

                      return !inline ? (
                        <CodeBlock
                          key={Math.random()}
                          language={(match && match[1]) || ''}
                          value={String(children).replace(/\n$/, '')}
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                          {children}
                        </table>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="break-words border border-black px-3 py-1 dark:border-white">
                          {children}
                        </td>
                      );
                    },
                    a({ children, ...props }) {
                      return (
                        <a {...props} target="_blank">
                          {children}
                        </a>
                      );
                    },
                    img({ src, alt, width, height }) {
                      if (!width && !height) {
                        width = '1024px';
                        height = '1024px';
                      }
                      return (
                        <img
                          src={src!}
                          alt={alt!}
                          width={parseInt(width as string)}
                          height={parseInt(height as string)}
                          className="m-1"
                        />
                      );
                    },
                  }}
                >
                  {`${message.content}${
                    messageIsStreaming &&
                    messageIndex ==
                      (selectedConversation?.messages.length ?? 0) - 1
                      ? '`▍`'
                      : ''
                  }`}
                </MemoizedReactMarkdown>

                <div className="md:-mr-8 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                  {messagedCopied ? (
                    <IconCheck
                      size={20}
                      className="text-green-500 dark:text-green-400"
                    />
                  ) : (
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={copyOnClick}
                    >
                      <IconCopy size={20} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {message.role === 'auth' && (
              <div className="flex flex-row">
                <a
                  target="_blank"
                  href={authUrl}
                  className="flex flex-shrink cursor-pointer items-center gap-3 rounded-md border
                  border-theme-border-light dark:border-theme-border-dark p-1 text-sm
                  text-black dark:text-white transition-colors
                  duration-200 hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
                >
                  Login
                </a>
                &nbsp;to use&nbsp;{message.plugin}.&nbsp;
                <button
                  className="flex flex-shrink cursor-pointer items-center gap-3 rounded-md border
                  border-theme-border-light dark:border-theme-border-dark p-1 text-sm
                  text-black dark:text-white transition-colors
                  duration-200 hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
                  onClick={() => handleRetryPlugin(message)}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
ChatMessage.displayName = 'ChatMessage';
