import {optimize} from './engine.js';
self.onmessage=e=>{try{self.postMessage({result:optimize(e.data.state,e.data.modules,e.data.limit)});}catch(error){self.postMessage({error:error.message});}};
