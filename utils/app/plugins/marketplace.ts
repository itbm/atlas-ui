import { PluginManifest, PluginOpenApi } from '@/types/plugin';

import { MARKETPLACE_URL } from '../const';

import * as yaml from 'js-yaml';

export const getManifest = async (pluginId: string) => {
  const response = await fetch(`${MARKETPLACE_URL}/install`, {
    method: 'POST',
    body: JSON.stringify({
      plugin_id: pluginId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return;
  }

  const manifest: PluginManifest = await response.json();

  return manifest;
};

export const getPluginApi = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return;
  }

  const rawPluginApi = await response.text();

  const pluginApi: PluginOpenApi = yaml.load(rawPluginApi) as PluginOpenApi;

  console.log('pluginApi:', pluginApi);

  return pluginApi;
};
