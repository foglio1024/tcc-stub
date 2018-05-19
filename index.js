
var srv = false;
var tcc;
var commandChannel = -2 >>>0;
var useLfg = true;
const Command = require('command');
module.exports = function TccStub(dispatch) {

    var net = require('net');
    var HOST = '127.0.0.50';
    var PORT = 9550;
    const command = Command(dispatch);

    if(srv != false)
    {
        srv.close();
    }

    srv = net.createServer(function(sock){
        sock.setEncoding('utf8');
        console.log('TCC connected from: ' + sock.remoteAddress + ':' + sock.remotePort);
        sock.on('data',function(data){
            //handle request
            var request = data.toString();

            if(request.startsWith('ex_tooltip')){
                serveExTooltipRequest(request);
            }
            else if(request.startsWith('nondb_info')){
                serveNonDbInfoRequest(request);
            }
            else if(request.startsWith('ask_int')){
                servecAskInteractive(request);
            }
            else if(request.startsWith('inspect')){
                serveInspect(request);
            }
            else if(request.startsWith('inv_party')){
                servePartyInvite(request);
            }
            else if(request.startsWith('inv_guild')){
                serveGuildInvite(request);
            }
            else if(request.startsWith('friend_req')){
                serveFriendRequest(request);
            }
            else if(request.startsWith('unfriend')){
                serveUnfriendUser(request);
            }
            else if(request.startsWith('block')){
                serveBlockUser(request);
            }
            else if(request.startsWith('unblock')){
                serveUnblockUser(request);
            }
            else if(request.startsWith('tb_accept')){
                serveBrokerAccept(request);
            }
            else if(request.startsWith('tb_decline')){
                serveBrokerDecline(request);
            }
            else if(request.startsWith('lfg_party_req')){
                servePartyInfoRequest(request);
            }
            else if(request.startsWith('lfg_page_req')){
                serveLfgPageRequest(request);
            }
            else if(request.startsWith('lfg_apply_req')){
                serveApplyToLfgRequest(request);
            }
            else if(request.startsWith('apply_decline')){
                serveApplyDecline(request);
            }
            else if(request.startsWith('chat_link')){
                serveChatLink(request);
            }
			     else if(request.startsWith('loot_settings')){
                serveLootSettings(request);
            }
            else if(request.startsWith('power_change')){
                servePowerChange(request);
            }
            else if(request.startsWith('leader')){
                serveLeaderChange(request);
            }
			     else if(request.startsWith('kick')){
                serveKickMember(request);
            }
            else if(request.startsWith('leave_party')){
                serveLeavePartyRequest(request);
            }
			     else if(request.startsWith('lfg_register')){
                serveRegisterLfg(request);
            }
			     else if(request.startsWith('lfg_publicize')){
                servePublicizeLfg(request);
            }
			     else if(request.startsWith('lfg_remove')){
                serveRemoveLfg(request);
            }
			     else if(request.startsWith('lfg_request_list')){
                serveRequestLfgList(request);
            }
			     else if(request.startsWith('disband_group')){
                serveDisbandRequest(request);
            }
            else if(request.startsWith('reset_instance')){
                serveResetRequest(request);
            }
            else if(request.startsWith('request_candidates')){
                serveRequestCandidates(request);
            }
			     else if(request.startsWith('init_stub')){
                init(request);
            }
        });
        sock.on('close', function(data){
            srv.close();
            console.log('TCC disconnected: '+sock.remoteAddress+ ' ' +sock.remotePort);
        });

        tcc = sock;
    });
    srv.on('error', (e) => {
      if(e.code == 'EADDRINUSE'){
        setTimeout(() => {
          srv.close();
          srv.listen(PORT,HOST);
        }, 1000);
      }
    });
    srv.listen(PORT, HOST);
    console.log('Listening on '+ HOST +':'+ PORT);

	//init_stub&use_lfg=value
	function init(message){
		var lfgPar = "&use_lfg=";
		var useLfg = message.substring(message.indexOf(lfgPar) + lfgPar.length) == "true";
	}
    //ex_tooltip&uid=uid&name=name
    function serveExTooltipRequest(message){
        var itemUid = Number.parseInt(message.substring(message.indexOf('&uid=')+5, message.indexOf('&name=')));
        var senderName = message.substring(message.indexOf('&name=')+6);

        dispatch.toServer('C_SHOW_ITEM_TOOLTIP_EX',2,{
            type: 17,
            id: itemUid,
            unk1: 0,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            unk5: -1,
            owner: senderName
        });
        console.log("ex_tooltip sent");
    }
    //nondb_info&id=id
    function serveNonDbInfoRequest(message){
        var itemId = Number.parseInt(message.substring(message.indexOf('&id=') + 4));

        dispatch.toServer('C_REQUEST_NONDB_ITEM_INFO', 2,{
            item: itemId,
            unk1: 0,
            button: 0
        });
    }
    //ask_int&srvId=srvId&name=name
    function servecAskInteractive(message){
        var srvId = Number.parseInt(message.substring(message.indexOf('&srvId=')+7, message.indexOf('&name=')));
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_ASK_INTERACTIVE', 2,{
            unk: 1,
            serverId: srvId,
            name: targetName
        });
    }
    //inspect&name=name
    function serveInspect(message){
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, {
            name: targetName
        });
    }
    //inv_party&name=name&raid=raid
    function servePartyInvite(message){
        var targetName = message.substring(message.indexOf('&name=') + 6, message.indexOf('&raid='));
        var raidByte = Number.parseInt(message.substring(message.indexOf('&raid=') + 6));
        var dataArray = new Buffer.alloc(1, raidByte);

        dispatch.toServer('C_REQUEST_CONTRACT', 1,{
            type: 4,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            name: targetName,
            data: dataArray
        });
    }
    //inv_guild&name=name
    function serveGuildInvite(message){
        var targetName = message.substring(message.indexOf('&name=') + 6);
        dispatch.toServer('C_INVITE_USER_TO_GUILD', 1 ,{
            unk1: 0,
            unk2: 0,
            name: targetName,
        });
    }
    //friend_req&name=name&msg=msg
    function serveFriendRequest(message){
        var targetName = message.substring(message.indexOf('&name=') + 6, message.indexOf('&msg='));
        var msg = message.substring(message.indexOf('&msg=')+ 5);

        dispatch.toServer('C_ADD_FRIEND', 1,{
            name: targetName,
            message: msg
        })
    }
    //block&name=name
    function serveBlockUser(message){
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_BLOCK_USER', 1, {
            name: targetName
        });
    }
    //unblock&name=name
    function serveUnblockUser(message){
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_REMOVE_BLOCKED_USER', 1, {
            name: targetName
        });
    }
    //unfriend&name=name
    function serveUnfriendUser(message){
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_DELETE_FRIEND', 1, {
            name: targetName
        });
    }
    //tb_accept&player=playerId&listing=listingId
    function serveBrokerAccept(message){
        var playerId = message.substring(message.indexOf('&player=') + 8, message.indexOf('&listing'));
        var listingId = message.substring(message.indexOf('&listing=') + 9);
        const data = Buffer.alloc(30);
        data.writeUInt32LE(playerId, 0);
        data.writeUInt32LE(listingId, 4);

        dispatch.toServer('C_REQUEST_CONTRACT', 1,{
            type:35,
            unk2:0,
            unk3:0,
            unk4:0,
            name:'',
            data
        })
    }
    //tb_decline&player=playerId&listing=listingId
    function serveBrokerDecline(message){
        var pId = message.substring(message.indexOf('&player=') + 8, message.indexOf('&listing'));
        var listingId = message.substring(message.indexOf('&listing=') + 9);

        dispatch.toServer('C_TRADE_BROKER_REJECT_SUGGEST', 1,{
            playerId: pId,
            listing: listingId
        })
    }
    //lfg_party_req&id=lfgId
    function servePartyInfoRequest(message){
        var lfgId = Number.parseInt(message.substring(message.indexOf('&id=') + 4));

        dispatch.toServer('C_REQUEST_PARTY_INFO', 2, {
            playerId: lfgId
        })
    }
	//lfg_apply_req&id=lfgId
    function serveApplyToLfgRequest(message){
        var lfgId = Number.parseInt(message.substring(message.indexOf('&id=') + 4));
        dispatch.toServer('C_APPLY_PARTY', 1, {
            playerId: lfgId
        })
    }
    //apply_decline&player=playerId
    function serveApplyDecline(message){
        var playerId = message.substring(message.indexOf('&player=') + 8);

        dispatch.toServer('C_PARTY_APPLICATION_DENIED', 1,{
            pid: playerId
        })
    }
    //chat_link&:tcc:TYPE:tcc:DATA:tcc:
    function serveChatLink(message){

        var msg = message.substring(message.indexOf('&') + 1);
        dispatch.toClient('S_CHAT',2,{
            channel: 18,
            authorID: 0,
            unk1: 0,
            gm: 0,
            founder: 0,
            authorName: 'tccChatLink',
            message: msg
        });
    }
	//loot_settings
	function serveLootSettings(message){

        dispatch.toClient('S_CHAT',2,{
            channel: 18,
            authorID: 0,
            unk1: 0,
            gm: 0,
            founder: 0,
            authorName: 'tccChatLink',
            message: ":tcc-loot:"
        });
	}
    //power_change&sId=id&pId=id&power=p
    function servePowerChange(message){
        var sId = Number.parseInt(message.substring(message.indexOf('&sId=') + 5, message.indexOf('&pId=')));
        var pId = Number.parseInt(message.substring(message.indexOf('&pId=') + 5, message.indexOf('&power=')));
        var p = Number.parseInt(message.substring(message.indexOf('&power=') + 7));

        dispatch.toServer('C_CHANGE_PARTY_MEMBER_AUTHORITY', 1,{
            serverId: sId,
            playerId: pId,
            canInvite: p
        })
    }
    //leader&sId=id&pId=id
    function serveLeaderChange(message){
        var sId = Number.parseInt(message.substring(message.indexOf('&sId=') + 5, message.indexOf('&pId=')));
        var pId = Number.parseInt(message.substring(message.indexOf('&pId=') + 5));

        dispatch.toServer('C_CHANGE_PARTY_MANAGER',2,{
            serverId: sId,
            playerId: pId
        })
    }
    //kick&sId=id&pId=id
    function serveKickMember(message){
        var sId = Number.parseInt(message.substring(message.indexOf('&sId=') + 5, message.indexOf('&pId=')));
        var pId = Number.parseInt(message.substring(message.indexOf('&pId=') + 5));

        dispatch.toServer('C_BAN_PARTY_MEMBER',1,{
            serverId: sId,
            playerId: pId
        })
    }
	//lfg_page_req&page=page
	function serveLfgPageRequest(message){
		var pagePar = "&page=";
		var p = Number.parseInt(message.substring(message.indexOf(pagePar) + pagePar.length));
		dispatch.toServer('C_REQUEST_PARTY_MATCH_INFO_PAGE',1,{
			page: p,
			unk1: 3,
			unk2: 0
		})
	}
	//lfg_register&msg=msg&raid=raid
	function serveRegisterLfg(message){
		var isRaidPar = "&raid=";
		var msgPar = "&msg=";
		var msg = message.substring(message.indexOf(msgPar) + msgPar.length, message.indexOf(isRaidPar));
		var raid = message.substring(message.indexOf(isRaidPar) + isRaidPar.length) === "true";

		dispatch.toServer('C_REGISTER_PARTY_INFO', 1, {
			isRaid: raid,
			message: msg
		});
	}
	//lfg_remove
	function serveRemoveLfg(message){
		dispatch.toServer('C_UNREGISTER_PARTY_INFO', 1, {
			unk1: 20,
			minLevel: 1,
			maxLevel: 65,
			unk3: 3,
			unk4: 0,
			unk5: 0,
			unk6: 0
		});
	}
	//lfg_publicize
	function servePublicizeLfg(message){
		dispatch.toServer('C_REQUEST_PARTY_MATCH_LINK', 1, { });
	}
	//reset_instance
	function serveResetRequest(message){
		dispatch.toServer('C_RESET_ALL_DUNGEON', 1, { });
	}
	//disband_group
	function serveDisbandRequest(message){
		dispatch.toServer('C_DISMISS_PARTY', 1, { });
	}
	//leave_party
	function serveLeavePartyRequest(message){
		dispatch.toServer('C_LEAVE_PARTY', 1, { });
	}
	//request_candidates
	function serveRequestCandidates(message){
		dispatch.toServer('C_REQUEST_CANDIDATE_LIST', 1, { });
	}
	//lfg_request_list&minlvl=minlvl&maxlvl=maxlvl
	function serveRequestLfgList(message){
		dispatch.toServer("C_PARTY_MATCH_WINDOW_CLOSED", 1, {});
		var minlvlPar = "&minlvl=";
		var maxlvlPar = "&maxlvl=";
		var min = Number.parseInt(message.substring(message.indexOf(minlvlPar) + minlvlPar.length) , message.indexOf(maxlvlPar));
		var max = Number.parseInt(message.substring(message.indexOf(maxlvlPar) + maxlvlPar.length));
		if(min > max) min = max;
		if(min < 1) min = 1;
		dispatch.toServer("C_REQUEST_PARTY_MATCH_INFO", 1, {
			unk1: 0,
			minlvl: min,
			maxlvl: max,
			unk2: 3,
			unk3: 0,
			purpose: ""
		});

	}
	//block player tooltips
    dispatch.hook('S_ANSWER_INTERACTIVE', 2 ,(event) => {
        return false;
    });
	//block ingame lfg details window if using tcc one
	dispatch.hook("S_PARTY_MEMBER_INFO", 3, (event) => {
		return !useLfg;
	});
	//block ingame lfg window if using tcc one
	dispatch.hook("S_SHOW_PARTY_MATCH_INFO", 1, (event) => {
		return !useLfg;
	});
	//block tcc messages from gpk
    dispatch.hook('S_CHAT', 2 ,(event) => {
        if(event.authorName == 'tccChatLink')
        {
            return false;
        }
        else{return true;}
    });
	//hook Command messages to display them in tcc {order: 999, filter:{fake:true}}
    dispatch.hook('S_PRIVATE_CHAT', 1, {order: 999, filter:{fake:true}}, event =>{
		/* Commands:
		 * - :tcc-chatMode:int  0/1
		 * - :tcc-uiMode:int    0/1
		 */
        //send event to TCC
        if(event.channel == commandChannel){
			if(tcc != undefined) tcc.write(event.message.toString());
        }
        return true;
    });
}
