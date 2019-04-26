class RpcHandler
{
    constructor(tcc_stub)
    {
        this.tcc_stub = tcc_stub;
    }

    handle(request)
    {
        //console.log(`${request.method}()`);
        return this[request.method](request.params);
    }
    pingStub(params)
    {
        return true;
    }
    getIsModAvailable(params)
    {
        return this.tcc_stub.mod.manager.isLoaded(params.modName);
    }
    resetInstance(params)
    {
        this.tcc_stub.mod.send('C_RESET_ALL_DUNGEON', 1, {});
    }
    requestPartyInfo(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_PARTY_INFO', 2, {
            playerId: params.listingId
        });
    }
    applyToGroup(params)
    {
        this.tcc_stub.mod.send('C_APPLY_PARTY', 1, {
            playerId: params.listingId
        });
    }
    friendUser(params)
    {
        this.tcc_stub.mod.send('C_ADD_FRIEND', 1, {
            name: params.userName,
            message: params.message
        });
    }
    unfriendUser(params)
    {
        this.tcc_stub.mod.send('C_DELETE_FRIEND', 1, {
            name: params.userName
        });
    }
    blockUser(params)
    {
        this.tcc_stub.mod.send('C_BLOCK_USER', 1, {
            name: params.userName
        });
    }
    unblockUser(params)
    {
        this.tcc_stub.mod.send('C_REMOVE_BLOCKED_USER', 1, {
            name: params.userName
        });
    }
    setInvitePower(params)
    {
        this.tcc_stub.mod.send('C_CHANGE_PARTY_MEMBER_AUTHORITY', 1, {
            serverId: params.serverId,
            playerId: params.playerId,
            canInvite: params.canInvite
        });
    }
    delegateLeader(params)
    {
        this.tcc_stub.mod.send('C_CHANGE_PARTY_MANAGER', 2, {
            serverId: params.serverId,
            playerId: params.playerId
        });
    }
    kickUser(params)
    {
        this.tcc_stub.mod.send('C_BAN_PARTY_MEMBER', 1, {
            serverId: params.serverId,
            playerId: params.playerId
        });
    }
    inspectUser(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_USER_PAPERDOLL_INFO', 1, {
            name: params.userName
        });
    }
    groupInviteUser(params)
    {
        var dataArray = new Buffer.alloc(1, Number(params.isRaid));
        this.tcc_stub.mod.send('C_REQUEST_CONTRACT', 1, {
            type: 4,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            name: params.userName,
            data: dataArray
        });
    }
    guildInviteUser(params)
    {
        this.tcc_stub.mod.send('C_INVITE_USER_TO_GUILD', 1, {
            unk1: 0,
            unk2: 0,
            name: params.userName
        });
    }
    acceptBrokerOffer(params)
    {
        const data = Buffer.alloc(30);
        data.writeUInt32LE(params.playerId, 0);
        data.writeUInt32LE(params.listingId, 4);
        this.tcc_stub.mod.send('C_REQUEST_CONTRACT', 1, {
            type: 35,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            name: '',
            data
        });
    }
    declineBrokerOffer(params)
    {
        this.tcc_stub.mod.send('C_TRADE_BROKER_REJECT_SUGGEST', 1, {
            playerId: params.playerId,
            listing: params.listingId
        });
    }
    declineUserGroupApply(params)
    {
        this.tcc_stub.mod.send('C_PARTY_APPLICATION_DENIED', 1, {
            pid: params.playerId
        });
    }
    publicizeListing(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_PARTY_MATCH_LINK', 1, {});
    }
    removeListing(params)
    {
        this.tcc_stub.mod.send('C_UNREGISTER_PARTY_INFO', 1, {
            unk1: 20,
            minLevel: 1,
            maxLevel: 65,
            unk3: 3,
            unk4: 0,
            unk5: 0,
            unk6: 0
        });
    }
    requestListings(params)
    {
        this.tcc_stub.mod.send("C_PARTY_MATCH_WINDOW_CLOSED", 1, {});
        let min = params.minLevel;
        let max = params.maxLevel;
        if (min > max)
            min = max;
        if (min < 1)
            min = 1;
        this.tcc_stub.mod.send("C_REQUEST_PARTY_MATCH_INFO", 1, {
            unk1: 0,
            minlvl: min,
            maxlvl: max,
            unk2: 3,
            unk3: 0,
            purpose: ""
        });
    }
    requestListingsPage(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_PARTY_MATCH_INFO_PAGE', 1, {
            page: params.page,
            unk1: 3,
            unk2: 0
        });
    }
    askInteractive(params)
    {
        this.tcc_stub.mod.send('C_ASK_INTERACTIVE', 2, {
            unk: 1,
            serverId: params.serverId,
            name: params.userName
        });
    }
    requestExTooltip(params)
    {
        this.tcc_stub.mod.send('C_SHOW_ITEM_TOOLTIP_EX', 2, {
            type: 17,
            id: params.itemUid,
            unk1: 0,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            unk5: -1,
            owner: params.ownerName
        });
    }
    requestNonDbItemInfo(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_NONDB_ITEM_INFO', 2, {
            item: params.itemId,
            unk1: 0,
            button: 0
        });
    }
    registerListing(params)
    {
        this.tcc_stub.mod.send('C_REGISTER_PARTY_INFO', 1, {
            isRaid: params.isRaid,
            message: params.message
        });
    }
    disbandGroup(params)
    {
        this.tcc_stub.mod.send('C_DISMISS_PARTY', 1, {});
    }
    leaveGroup(params)
    {
        this.tcc_stub.mod.send('C_LEAVE_PARTY', 1, {});
    }
    requestListingCandidates(params)
    {
        this.tcc_stub.mod.send('C_REQUEST_CANDIDATE_LIST', 1, {});
    }
    forceSystemMessage(params)
    {
        this.tcc_stub.mod.send("S_SYSTEM_MESSAGE", 1, {
            message: params.message
        });
    }
    invokeCommand(params)
    {
        this.tcc_stub.mod.command.exec(params.command);
    }
    returnToLobby(params)
    {
        this.tcc_stub.mod.send("C_RETURN_TO_LOBBY", 1, {});
    }
    chatLinkAction(params)
    {
        this.tcc_stub.mod.send('S_CHAT', 2, {
            channel: 18,
            authorID: 0,
            unk1: 0,
            gm: 0,
            founder: 0,
            authorName: 'tccChatLink',
            message: params.linkData
        });
    }
    initialize(params)
    {
        this.tcc_stub.useLfg = params.useLfg;
        console.log("TCC " + "LFG window " + (this.tcc_stub.useLfg ? "enabled" : "disabled") + ". Ingame LFG listings " + (this.tcc_stub.useLfg ? "will" : "won't") + " be blocked.");
        return true;
    }
}
exports.RpcHandler = RpcHandler;
