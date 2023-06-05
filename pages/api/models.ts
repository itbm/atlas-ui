import { getAvailableAnthropicModels } from '@/utils/server/ai_vendors/anthropic/getModels';
import { getAvailableOpenAIModels } from '@/utils/server/ai_vendors/openai/getModels';

import { AiModel } from '@chatbot-ui/core/types/ai-models';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { key } = (await req.json()) as {
      key: string;
    };

    const models: AiModel[] = [];
    const { error: openaiError, data: openaiModels } =
      await getAvailableOpenAIModels(key);
    if (openaiError) {
      console.error('Error getting OpenAI models');
    } else {
      models.push(...(openaiModels as AiModel[]));
    }

    const { data: anthropicModels } = await getAvailableAnthropicModels();
    models.push(...(anthropicModels as AiModel[]));

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error getting available models', { status: 500 });
  }
};

export default handler;
