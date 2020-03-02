import { buildIframeClient, PluginClient} from '@remixproject/plugin';

export class PipelinePlugin extends PluginClient {
  methods: ['loadChainLensWorkspace'];

  constructor(callbacks = {}) {
    super();
    this.onload();
    this.callbacks = callbacks;

    this.methods = ['loadChainLensWorkspace'];
  }

  loadChainLensWorkspace(pclasses) {
    return this.callbacks.loadChainLensWorkspace(pclasses);
  }
}

export async function createRemixClient(callbacks) {
  const plugin = new PipelinePlugin(callbacks);
  const pluginClient = buildIframeClient(plugin);
  await pluginClient.onload();
  return pluginClient;
}
