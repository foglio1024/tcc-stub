const { TccInterface } = require("./lib/tcc-interface");
const { RpcServer } = require("./lib/rpc-server");
// const BadGui = require('../badGui');

class TccStub
{
    constructor(mod)
    {
        this.mod = mod;
        this.useLfg = false;
        if (mod.isClassic)
        {
            mod.log('TCC does not support classic servers.');
            return;
        }
        this.tcc = new TccInterface(mod);
        this.server = new RpcServer(this);
        this.server.start();
        this.installHooks();
        
        // soon (TM)
        //this.gui = new BadGui(mod);
        //this.mod.command.add('tcc-toggle-gpk', (guiName, bMode) => {
        //    this.gui.parse([{
        //        gpk: `OnGameEventShowUI,${guiName},${bMode}`
        //    }],"HideCharWindow");
        //});
    
    }

    installHooks()
    {
        // block ingame player menu
        this.mod.hook('S_ANSWER_INTERACTIVE', 2, () => { return false; });
        // block ingame lfg list
        this.mod.hook("S_SHOW_PARTY_MATCH_INFO", 1, () => { return !this.useLfg; });
        // block ingame lfg details
        this.mod.hook("S_PARTY_MEMBER_INFO", 3, () => { return !this.useLfg; });
        // block tcc messages from gpk file
        this.mod.hook('S_CHAT', 3, (p) => { return p.authorName != 'tccChatLink'; });
        // hook Command messages to display them in tcc {order: 999, filter:{fake:true}}
        this.mod.hook('S_PRIVATE_CHAT', 1, { order: 999, filter: { fake: true } }, p =>
        {
            var author = "";
            var text = p.message.toString();
            if (p.author == undefined)
            {
                var authorEnd = p.message.toString().indexOf(']');
                if (authorEnd != -1)
                {
                    author = text.substring(1, authorEnd);
                    text = text.substring(authorEnd + 2);
                }
            }
            else author = p.author;

            // handle chatMode from Chat2
            const chatModeParameter = ':tcc-chatMode:';
            let chatModeIdx = text.indexOf(chatModeParameter);
            if (chatModeIdx != -1)
            {
                // Unknown command ":tcc-chatMode:false" 
                let chatMode = text.indexOf(':true') != -1; // WTB <GPK Interface> /w me
                this.tcc.call('setChatMode', { 'chatMode': chatMode });
                return true;
            }

            // handle uiMode from Chat2
            const uiModeParameter = ':tcc-uiMode:';
            let uiModeIdx = text.indexOf(uiModeParameter);
            if (uiModeIdx != -1)
            {
                let uiMode = text.indexOf(':true') != -1; // WTB <GPK Interface> /w me
                this.tcc.call('setUiMode', { 'uiMode': uiMode });
                return true;
            }

            // handle normal proxy output (mostly /7 or /8)
            this.tcc.call('handleChatMessage', {
                'author': author,
                'channel': p.channel,
                'message': text
            });
            return true;
        });
        // register private proxy channels (like /7 and /8)
        this.mod.hook('S_JOIN_PRIVATE_CHANNEL', 'raw', { order: 999, filter: { fake: true } }, (code, data, fromServer) =>
        {
            this.tcc.call('handleRawPacket', {
                'direction': fromServer ? 2 : 1,
                'content': data.toString('hex')
            });
            return true;
        });
        // notify to Chat2 that proxy is active
        this.mod.hook('C_LOAD_TOPO_FIN', 'raw', () =>
        {
            this.mod.setTimeout(() =>
            {
                this.mod.send('S_CHAT', 3, {
                    channel: 18,
                    name: 'tccChatLink',
                    message: ':tcc-proxyOn:'
                })
            }, 2000);
            return true;
        });
    }

    destructor()
    {
        this.server.stop();
    }
}


module.exports = TccStub;