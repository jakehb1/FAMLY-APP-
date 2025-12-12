import { registerRootComponent } from 'expo';

import App from './App';

// #region agent log
console.log('[DEBUG] index.ts: registerRootComponent called');
fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.ts:8',message:'registerRootComponent called',data:{appName:'App'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// #region agent log
console.log('[DEBUG] index.ts: registerRootComponent completed');
fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.ts:14',message:'registerRootComponent completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion
