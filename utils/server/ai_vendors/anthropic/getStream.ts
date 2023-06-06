import { ANTHROPIC_API_KEY, ANTHROPIC_API_URL } from '@/utils/app/const';

import { AiModel } from '@chatbot-ui/core/types/ai-models';
import { Message } from '@chatbot-ui/core/types/chat';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export async function streamAnthropic(
  model: AiModel,
  systemPrompt: string,
  temperature: number,
  apiKey: string,
  messages: Message[],
  tokenCount: number,
) {
  if (!apiKey) {
    if (!ANTHROPIC_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = ANTHROPIC_API_KEY;
    }
  }

  let prompt = systemPrompt;

  let parsedMessages = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    const parsedMessage = `\n\n${
      messages[i].role === 'user' ? 'Human' : 'Assistant'
    }: ${messages[i].content}`;
    parsedMessages = parsedMessage + parsedMessages;
  }

  prompt += parsedMessages;

  prompt += '\n\nAssistant:';

  // console.log('prompt', prompt);

  let url = `${ANTHROPIC_API_URL}/complete`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    method: 'POST',
    body: JSON.stringify({
      prompt: prompt,
      model: model.id,
      max_tokens_to_sample: model.tokenLimit - tokenCount,
      stop_sequences: ['\n\nUser:'],
      temperature: temperature,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      return { error: result.error };
    } else {
      throw new Error(
        `Anthropic API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          try {
            const json = JSON.parse(data);
            if (json.stop_reason != null) {
              controller.close();
              return;
            }
            const text = json.completion;
            console.log('completion', text);
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return { stream: stream };
}
