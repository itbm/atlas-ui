import { IconMistOff } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { MARKETPLACE_URL } from '@/utils/app/const';
import { getManifest, getPluginApi } from '@/utils/app/plugins/marketplace';
import {
  localAddInstalledPlugin,
  localDeleteInstalledPlugin,
} from '@/utils/app/storage/local/plugins';

import { InstalledPlugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { PluginList } from './components/PluginList';
import Search from '@/components/Common/Search';

import PluginCatalogContext from './PluginCatalog.context';
import { PluginCatalogInitialState, initialState } from './PluginCatalog.state';

export const PluginCatalog = () => {
  const { t } = useTranslation('sidebar');

  const pluginCatalogContextValue = useCreateReducer<PluginCatalogInitialState>(
    {
      initialState,
    },
  );

  const {
    state: { searchQuery, filteredPlugins },
    dispatch: pluginCatalogDispatch,
  } = pluginCatalogContextValue;

  const {
    state: { user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  // PLUGIN OPERATIONS  --------------------------------------------
  const handleInstallPlugin = async (pluginId: string) => {
    const manifest = await getManifest(pluginId);

    if (!manifest) {
      console.log('Plugin manifest not found');
      return;
    }

    const pluginAPI = await getPluginApi(manifest.api.url);

    if (!pluginAPI) {
      console.log('Plugin API not found');
      return;
    }

    const installedPlugin: InstalledPlugin = {
      manifest: manifest,
      api: pluginAPI,
    };

    const updatedPlugins = localAddInstalledPlugin(user, installedPlugin);
    homeDispatch({ field: 'installedPlugins', value: updatedPlugins });
  };

  const handleUninstallPlugin = async (pluginId: string) => {
    const updatedPlugins = localDeleteInstalledPlugin(user, pluginId);
    homeDispatch({ field: 'installedPlugins', value: updatedPlugins });
  };

  const fetchPlugins = async (query: string) => {
    if (!query) {
      const response = await fetch(`${MARKETPLACE_URL}`);
      if (response.ok) {
        const data = await response.json();
        pluginCatalogDispatch({
          field: 'filteredPlugins',
          value: data,
        });
      }
    } else {
      const response = await fetch(`${MARKETPLACE_URL}/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        pluginCatalogDispatch({
          field: 'filteredPlugins',
          value: data,
        });
      }
    }
  };

  useEffect(() => {
    fetchPlugins(searchQuery);
  }, [searchQuery, pluginCatalogDispatch]);

  const doSearch = (query: string) =>
    pluginCatalogDispatch({ field: 'searchQuery', value: query });

  return (
    <PluginCatalogContext.Provider
      value={{
        ...pluginCatalogContextValue,
        handleInstallPlugin,
        handleUninstallPlugin,
      }}
    >
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchQuery}
        onSearch={doSearch}
      />

      <div className="flex-grow overflow-auto">
        {filteredPlugins?.length > 0 ? (
          <div className="pt-2">
            <PluginList plugins={filteredPlugins} />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">
              {t('No plugins found.')}
            </span>
          </div>
        )}
      </div>
    </PluginCatalogContext.Provider>
  );
};
