import { withContracts } from '../generated/test';
let neoline;
let neolineN3;

describe('Token', () => {
    test('has name, symbol and decimals properties', async () => {
      await withContracts(async ({ token }) => {
        const [name, symbol, decimals] = await Promise.all([token.name(), token.symbol(), token.decimals()]);
        expect(name).toEqual('Eon');
        expect(symbol).toEqual('EON');
        expect(decimals.toNumber()).toEqual(8);
      });
    });
  });  

function initDapi() {
    const initCommonDapi = new Promise((resolve, reject) => {
        window.addEventListener('NEOLine.NEO.EVENT.READY', () => {
            neoline = new NEOLine.Init();
            if (neoline) {
                resolve(neoline);
            } else {
                reject('common dAPI method failed to load.');
            }
        });
    });
    const initN3Dapi = new Promise((resolve, reject) => {
        window.addEventListener('NEOLine.N3.EVENT.READY', () => {
            neolineN3 = new NEOLineN3.Init();
            if (neolineN3) {
                resolve(neolineN3);
            } else {
                reject('N3 dAPI method failed to load.');
            }
        });
    });
    initCommonDapi.then(() => {
        console.log('The common dAPI method is loaded.');
        return initN3Dapi;
    }).then(() => {
        console.log('The N3 dAPI method is loaded.');
    }).catch((err) => {
        console.log(err);
    })
};

initDapi();