
const http = require('http');

const tccInterface = function () {
    this.nextId = 0;
    this.invokeMethod = function (method, params) {
        let request = {
            'jsonrpc': '2.0',
            'method': method,
            'params': params,
            'id': nextId++
        };

        const options = {
            hostname: '127.0.0.51',
            port: 9551,
            method: 'POST',
            path: '/',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': request.length
            }
        }
        const req = http.request(options, (res) => { /* doing nothing */ });
        req.on('error', (error) => console.error(error));
        req.write(request);
        req.end();
    }
}
module.exports = function (mod) {
    if (mod.isClassic) {
        console.log('TCC does not support classic servers.');
        return;
    }
    const receiver = http.createServer((req, res) => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
                let jReq = JSON.parse(body);
                this[jReq.method]();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('ok');
            });
        }
    });
    
    receiver.listen(9550, '127.0.0.50', () => {
        console.log('Listening');
    });

    this.requestPartyInfo = function (params) {
        mod.send('C_REQUEST_PARTY_INFO', 2, {
            playerId: params.listingId
        });
    };
    this.applyToGroup = function (params) {
        mod.send('C_APPLY_PARTY', 1, {
            playerId: params.listingId
        });
    };
    this.friendUser = function (params) {
        mod.send('C_ADD_FRIEND', 1, {
            name: params.userName,
            message: params.message
        });
    };
    this.unfriendUser = function (params) {
        mod.send('C_DELETE_FRIEND', 1, {
            name: params.userName
        });
    };
    this.blockUser = function (params) {
        mod.send('C_BLOCK_USER', 1, {
            name: params.userName
        });
    };
    this.unblockUser = function (params) {
        mod.send('C_REMOVE_BLOCKED_USER', 1, {
            name: params.userName
        });
    };
    this.setInvitePower = function (params) {
        mod.send('C_CHANGE_PARTY_MEMBER_AUTHORITY', 1, {
            serverId: params.serverId,
            playerId: params.playerId,
            canInvite: params.canInvite
        });
    };
    this.delegateLeader = function (params) {
        mod.send('C_CHANGE_PARTY_MANAGER', 2, {
            serverId: params.serverId,
            playerId: params.playerId
        });
    };
    this.kickUser = function (params) {
        mod.send('C_BAN_PARTY_MEMBER', 1, {
            serverId: params.serverId,
            playerId: params.playerId
        });
    };
    this.inspectUser = function (params) {
        mod.send('C_REQUEST_USER_PAPERDOLL_INFO', 1, {
            name: params.userName
        });
    };
    this.groupInviteUser = function (params) {
        var dataArray = new Buffer.alloc(1, Number(params.isRaid));
        mod.send('C_REQUEST_CONTRACT', 1, {
            type: 4,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            name: params.userName,
            data: dataArray
        });
    };
    this.guildInviteUser = function (params) {
        mod.send('C_INVITE_USER_TO_GUILD', 1, {
            unk1: 0,
            unk2: 0,
            name: params.userName
        });
    };
    this.acceptBrokerOffer = function (params) {
        const data = Buffer.alloc(30);
        data.writeUInt32LE(params.playerId, 0);
        data.writeUInt32LE(params.listingId, 4);
        mod.send('C_REQUEST_CONTRACT', 1, {
            type: 35,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            name: '',
            data
        });
    };
    this.declineBrokerOffer = function (params) {
        mod.send('C_TRADE_BROKER_REJECT_SUGGEST', 1, {
            playerId: params.playerId,
            listing: params.listingId
        });
    };
    this.declineUserGroupApply = function (params) {
        mod.send('C_PARTY_APPLICATION_DENIED', 1, {
            pid: params.playerId
        });
    };
    this.publicizeListing = function (params) {
        mod.send('C_REQUEST_PARTY_MATCH_LINK', 1, {});
    };
    this.removeListing = function (params) {
        mod.send('C_UNREGISTER_PARTY_INFO', 1, {
            unk1: 20,
            minLevel: 1,
            maxLevel: 65,
            unk3: 3,
            unk4: 0,
            unk5: 0,
            unk6: 0
        });
    };
    this.requestListings = function (params) {
        mod.send("C_PARTY_MATCH_WINDOW_CLOSED", 1, {});
        let min = params.minLevel;
        let max = params.maxLevel;
        if (min > max) min = max;
        if (min < 1) min = 1;
        mod.send("C_REQUEST_PARTY_MATCH_INFO", 1, {
            unk1: 0,
            minlvl: min,
            maxlvl: max,
            unk2: 3,
            unk3: 0,
            purpose: ""
        });
    };
    this.askInteractive = function (params) {
        mod.send('C_ASK_INTERACTIVE', 2, {
            unk: 1,
            serverId: params.serverId,
            name: params.userName
        });
    };
    this.requestExTooltip = function (params) {
        mod.send('C_SHOW_ITEM_TOOLTIP_EX', 2, {
            type: 17,
            id: params.itemUid,
            unk1: 0,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            unk5: -1,
            owner: params.ownerName
        });
    };
    this.requestNonDbItemInfo = function (params) {
        mod.send('C_REQUEST_NONDB_ITEM_INFO', 2, {
            item: params.itemId,
            unk1: 0,
            button: 0
        });
    };
    this.registerListing = function (params) {
        mod.send('C_REGISTER_PARTY_INFO', 1, {
            isRaid: params.isRaid,
            message: params.message
        });
    };
    this.disbandGroup = function (params) {
        mod.send('C_DISMISS_PARTY', 1, {});
    };
    this.leaveGroup = function (params) {
        mod.send('C_LEAVE_PARTY', 1, {});
    };
    this.requestListingCandidates = function (params) {
        mod.send('C_REQUEST_CANDIDATE_LIST', 1, {});
    };
    this.forceSystemMessage = function (params) {
        mod.send("S_SYSTEM_MESSAGE", 1, {
            message: params.message
        });
    };
    this.invokeCommand = function (params) {
        mod.command.exec(params.command);
    };
    this.returnToLobby = function (params) {
        mod.send("C_RETURN_TO_LOBBY", 1, {});
    };
    this.chatLinkAction = function (params) {
        mod.send('S_CHAT', 2, {
            channel: 18,
            authorID: 0,
            unk1: 0,
            gm: 0,
            founder: 0,
            authorName: 'tccChatLink',
            message: params.linkData
        });
    };
    this.initialize = function (params) {
        this.useLfg = params.useLfg;
        console.log(TAG + "TCC " + cyan("LFG window ") + (useLfg ? "enabled" : "disabled") + ". Ingame LFG listings " + (useLfg ? "will" : "won't") + " be blocked.");
        tccInterface.invokeMethod('setFpsUtilsAvailable', { 'fpsUtilsAvailable': mod.manager.isLoaded('fps-utils') });
    };

    mod.hook('S_ANSWER_INTERACTIVE', 2, (event) => { return false; });
    mod.hook("S_PARTY_MEMBER_INFO", 3, (event) => { return !useLfg; });
    mod.hook("S_SHOW_PARTY_MATCH_INFO", 1, (event) => { return !useLfg; });
    //block tcc messages from gpk file
    mod.hook('S_CHAT', 2, (event) => { return event.authorName != 'tccChatLink'; });
    //hook Command messages to display them in tcc {order: 999, filter:{fake:true}}
    mod.hook('S_PRIVATE_CHAT', 1, { order: 999, filter: { fake: true } }, event => {

        var author = "";
        var msg = event.message.toString();
        if (event.author == undefined) {
            var authorEnd = event.message.toString().indexOf(']');
            if (authorEnd != -1) {
                author = msg.substring(1, authorEnd);
                msg = msg.substring(authorEnd + 2);
            }
        }
        else author = event.author;

        // handle chatMode from Chat2
        const chatModeParameter = ':tcc-chatMode:';
        let chatModeIdx = msg.indexOf(chatModeParameter);
        if (chatModeIdx != -1) {
            let chatMode = Boolean(msg.replace(chatModeParameter, ''));
            tccInterface.invokeMethod('setChatMode', { 'chatMode': chatMode });
            return true;
        }

        // handle uiMode from Chat2
        const uiModeParameter = ':tcc-uiMode:';
        let uiModeIdx = msg.indexOf(uiModeParameter);
        if (uiModeIdx != -1) {
            let uiMode = Boolean(msg.replace(uiModeParameter, ''));
            tccInterface.invokeMethod('setUiMode', { 'uiMode': uiMode });
            return true;
        }

        // handle normal proxy output (mostly /7 or /8)
        tccInterface.invokeMethod('handleChatMessage', {
            'author': author,
            'channel': event.channel,
            'message': msg
        });
        return true;
    });
    mod.hook('S_JOIN_PRIVATE_CHANNEL', 'raw', { order: 999, filter: { fake: true } }, (code, data, fromServer) => {
        tccInterface.invokeMethod('handleRawPacket', {
            'direction': fromServer ? 2 : 1,
            'content': data.toString('hex')
        });
        return true;
    });

    mod.hook('C_LOAD_TOPO_FIN', 'raw', event => {
        mod.setTimeout(() => {
            mod.send('S_CHAT', 2, {
                channel: 18,
                authorID: 0,
                unk1: 0,
                gm: 0,
                founder: 0,
                authorName: 'tccChatLink',
                message: ':tcc-proxyOn:'
            })
        }, 2000);
        return true;
    });

    this.destructor = function (){
        receiver.close();
    }
}