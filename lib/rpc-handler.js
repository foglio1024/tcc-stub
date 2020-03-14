const fs = require('fs');

class RpcHandler
{
    constructor(tcc_stub)
    {
        this.tcc_stub = tcc_stub;
    }

    handle(request)
    {
        return this[request.method](request.params);
    }

    dumpSysMsg(params)
    {
        this.tcc_stub.debug(`Dumping sysmsg`);

        let ret = true;
        let sysmsg = "";
        let names = Object.keys(this.tcc_stub.mod.clientInterface.info.sysmsg);
        names.forEach(name =>
        {
            sysmsg += `${name} ${this.tcc_stub.mod.clientInterface.info.sysmsg[name]}${(names.indexOf(name) != names.length - 1 ? '\n' : '')}`;
        });
        fs.writeFile(params.path, sysmsg, function (err)
        {
            if (err)
            {
                this.tcc_stub.mod.log(err);
                ret = false;
            }
        });
        return ret;
    }

    pingStub(params)
    {
        this.tcc_stub.debug(`Ping received`);
        return true;
    }
    getIsModAvailable(params)
    {
        this.tcc_stub.debug(`Checking mod available: ${params.modName}`);
        return this.tcc_stub.mod.manager.isLoaded(params.modName);
    }
    resetInstance(params)
    {
        this.tcc_stub.mod.send('C_RESET_ALL_DUNGEON', 1, {});
        this.tcc_stub.debug('Sent C_RESET_ALL_DUNGEON');
    }
    requestPartyInfo(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_PARTY_INFO', 2, {
            playerId: params.listingId
        });
        this.tcc_stub.debug('Sent C_REQUEST_PARTY_INFO');
    }
    applyToGroup(params)
    {
        this.tcc_stub.mod.send('C_APPLY_PARTY', 1, {
            playerId: params.listingId
        });
        this.tcc_stub.debug(`Sent C_APPLY_PARTY { playerId : ${params.listingId}}`);
        return true;
    }
    friendUser(params)
    {
        this.tcc_stub.mod.send('C_ADD_FRIEND', 1, {
            name: params.userName,
            message: params.message
        });
        this.tcc_stub.debug(`Sent C_ADD_FRIEND`);
    }
    unfriendUser(params)
    {
        this.tcc_stub.mod.send('C_DELETE_FRIEND', 1, {
            name: params.userName
        });
        this.tcc_stub.debug(`Sent C_DELETE_FRIEND`);
    }
    blockUser(params)
    {
        this.tcc_stub.mod.send('C_BLOCK_USER', 1, {
            name: params.userName
        });
        this.tcc_stub.debug(`Sent C_BLOCK_USER`);
    }
    unblockUser(params)
    {
        this.tcc_stub.mod.send('C_REMOVE_BLOCKED_USER', 1, {
            name: params.userName
        });
        this.tcc_stub.debug(`Sent C_REMOVE_BLOCKED_USER`);
    }
    setInvitePower(params)
    {
        this.tcc_stub.mod.send('C_CHANGE_PARTY_MEMBER_AUTHORITY', 1, {
            serverId: params.serverId,
            playerId: params.playerId,
            canInvite: params.canInvite
        });
        this.tcc_stub.debug(`Sent C_CHANGE_PARTY_MEMBER_AUTHORITY`);
    }
    delegateLeader(params)
    {
        this.tcc_stub.mod.send('C_CHANGE_PARTY_MANAGER', 2, {
            serverId: params.serverId,
            playerId: params.playerId
        });
        this.tcc_stub.debug(`Sent C_CHANGE_PARTY_MANAGER`);
    }
    kickUser(params)
    {
        this.tcc_stub.mod.send('C_BAN_PARTY_MEMBER', 1, {
            serverId: params.serverId,
            playerId: params.playerId
        });
        this.tcc_stub.debug(`Sent C_BAN_PARTY_MEMBER`);
    }
    inspectUser(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_USER_PAPERDOLL_INFO', 3, {
            name: params.userName
        });
        this.tcc_stub.debug(`Sent C_REQUEST_USER_PAPERDOLL_INFO`);
    }
    inspectUserWithGameId(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_USER_PAPERDOLL_INFO_WITH_GAMEID', 3, {
            gameId: params.gameId
        });
        this.tcc_stub.debug(`Sent C_REQUEST_USER_PAPERDOLL_INFO`);
    }
    groupInviteUser(params)
    {
        var dataArray = new Buffer.alloc(1, Number(params.isRaid));
        this.tcc_stub.mod.send('C_REQUEST_CONTRACT', 1, {
            type: 4,
            name: params.userName,
            data: dataArray
        });
        this.tcc_stub.debug(`Sent C_REQUEST_CONTRACT`);
    }
    guildInviteUser(params)
    {
        this.tcc_stub.mod.send('C_INVITE_USER_TO_GUILD', 1, {
            name: params.userName
        });
        this.tcc_stub.debug(`Sent C_INVITE_USER_TO_GUILD`);
    }
    acceptBrokerOffer(params)
    {
        const data = Buffer.alloc(30);
        data.writeUInt32LE(params.playerId, 0);
        data.writeUInt32LE(params.listingId, 4);
        this.tcc_stub.mod.send('C_REQUEST_CONTRACT', 1, {
            type: 35,
            data
        });
        this.tcc_stub.debug(`Sent C_REQUEST_CONTRACT`);
    }
    declineBrokerOffer(params)
    {
        this.tcc_stub.mod.send('C_TRADE_BROKER_REJECT_SUGGEST', 1, {
            playerId: params.playerId,
            listing: params.listingId
        });
        this.tcc_stub.debug(`Sent C_TRADE_BROKER_REJECT_SUGGEST`);
    }
    declineUserGroupApply(params)
    {
        this.tcc_stub.mod.send('C_PARTY_APPLICATION_DENIED', 1, {
            pid: params.playerId
        });
        this.tcc_stub.debug(`Sent C_PARTY_APPLICATION_DENIED`);
    }
    publicizeListing(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_PARTY_MATCH_LINK', 1, {});
        this.tcc_stub.debug(`Sent C_REQUEST_PARTY_MATCH_LINK`);
    }
    removeListing(params)
    {
        this.tcc_stub.mod.send('C_UNREGISTER_PARTY_INFO', 1, {
            unk1: 20,
            minLevel: 1,
            maxLevel: 65,
            unk3: 3
        });
        this.tcc_stub.debug(`Sent C_UNREGISTER_PARTY_INFO`);
    }
    requestListings(params)
    {
        this.tcc_stub.mod.send("C_PARTY_MATCH_WINDOW_CLOSED", 1, {});
        this.tcc_stub.debug(`Sent C_PARTY_MATCH_WINDOW_CLOSED`);

        let min = params.minLevel;
        let max = params.maxLevel;
        if (min > max)
            min = max;
        if (min < 1)
            min = 1;
        this.tcc_stub.mod.send("C_REQUEST_PARTY_MATCH_INFO", 1, {
            minlvl: min,
            maxlvl: max,
            unk2: 3
        });
        this.tcc_stub.debug(`Sent C_REQUEST_PARTY_MATCH_INFO`);

    }
    requestListingsPage(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_PARTY_MATCH_INFO_PAGE', 1, {
            page: params.page,
            unk1: 3
        });
        this.tcc_stub.debug(`Sent C_REQUEST_PARTY_MATCH_INFO_PAGE`);
    }
    askInteractive(params)
    {
        this.tcc_stub.mod.send('C_ASK_INTERACTIVE', 2, {
            unk: 1,
            serverId: params.serverId,
            name: params.userName
        });
        this.tcc_stub.debug(`Sent C_ASK_INTERACTIVE { serverId: ${params.serverId}, name: ${params.userName} }`);
    }
    requestExTooltip(params)
    {
        this.tcc_stub.mod.send('C_SHOW_ITEM_TOOLTIP_EX', 3, {
            type: 17,
            id: params.itemUid,
            playerId: -1,
            owner: params.ownerName
        });
        this.tcc_stub.debug(`Sent C_SHOW_ITEM_TOOLTIP_EX`);

    }
    requestNonDbItemInfo(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_NONDB_ITEM_INFO', 2, {
            item: params.itemId
        });
        this.tcc_stub.debug(`Sent C_REQUEST_NONDB_ITEM_INFO`);
    }
    registerListing(params)
    {
        this.tcc_stub.mod.send('C_REGISTER_PARTY_INFO', 1, {
            isRaid: params.isRaid,
            message: params.message
        });
        this.tcc_stub.debug(`Sent C_REGISTER_PARTY_INFO`);
    }
    disbandGroup(params)
    {
        this.tcc_stub.mod.send('C_DISMISS_PARTY', 1, {});
        this.tcc_stub.debug(`Sent C_DISMISS_PARTY`);
    }
    leaveGroup(params)
    {
        this.tcc_stub.mod.send('C_LEAVE_PARTY', 1, {});
        this.tcc_stub.debug(`Sent C_LEAVE_PARTY`);
    }
    requestListingCandidates(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_CANDIDATE_LIST', 1, {});
        this.tcc_stub.debug(`Sent C_REQUEST_CANDIDATE_LIST`);
    }
    forceSystemMessage(params)
    {
        this.tcc_stub.mod.send("S_SYSTEM_MESSAGE", 1, {
            message: params.message
        });
        this.tcc_stub.debug(`Sent S_SYSTEM_MESSAGE`);
    }
    invokeCommand(params)
    {
        this.tcc_stub.mod.command.exec(params.command);
        this.tcc_stub.debug(`Invoking command: ${params.command}`);
    }
    returnToLobby(params)
    {
        this.tcc_stub.mod.send("C_RETURN_TO_LOBBY", 1, {});
        this.tcc_stub.debug(`Sent C_RETURN_TO_LOBBY`);
    }
    chatLinkAction(params)
    {
        this.tcc_stub.mod.send('S_CHAT', 3, {
            channel: 18,
            name: 'tccChatLink',
            message: params.linkData
        });
        this.tcc_stub.debug(`Calling chatLinkAction: ${params.linkData}`);
    }
    updateSetting(params) // bool only, send type if needed for other setting
    {
        let value = params.value == "True"; // JS PLS
        let name = params.name;
        this.tcc_stub[name] = value; 
        let msg = `${name} set to ${value}`;
        if (name == "useLfg")
        {
            msg = `TCC LFG window ${(value ? 'enabled' : 'disabled')}. Ingame LFG ${(value ? 'will' : "won't")} be blocked.`;
        }
        else if (name == "EnablePlayerMenu")
        {
            msg = `TCC player menu ${(value ? "enabled" : "disabled")}. Ingame player menu ${(value ? "will" : "won't")} be blocked.`;
        }
        else if (name == "ShowIngameChat")
        {
            this.tcc_stub.notifyShowIngameChatChanged();
        }
        this.tcc_stub.mod.log(msg);

    }
    initialize(params)
    {
        this.tcc_stub.useLfg = params.useLfg;
        this.tcc_stub.EnablePlayerMenu = params.EnablePlayerMenu;
        // this.tcc_stub.EnableProxy = params.EnableProxy;
        this.tcc_stub.EnableProxy = params.EnableProxy;
        this.tcc_stub.ShowIngameChat = params.ShowIngameChat;
        if (this.tcc_stub.useLfg) this.tcc_stub.mod.log("TCC LFG window enabled. Ingame LFG listings will be blocked.");
        if (this.tcc_stub.EnablePlayerMenu) this.tcc_stub.mod.log("TCC player menu enabled. Ingame player menu will be blocked.");
        return true;
    }
}
exports.RpcHandler = RpcHandler;
