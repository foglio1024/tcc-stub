
var srv = false;
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
        console.log('TCC connected: ' + sock.remoteAddress + ':' + sock.remotePort);
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
            else if(request.startsWith('apply_decline')){
                serveApplyDecline(request);
            }
            else if(request.startsWith('chat_link')){
                serveChatLink(request);
            }
        });

        sock.on('close', function(data){
            srv.close();
            console.log('TCC disconnected: '+sock.remoteAddress+ ' ' +sock.remotePort);
        });
    });
    srv.listen(PORT, HOST);
    console.log('Listening on '+ HOST +':'+ PORT);

   //ex_tooltip&uid=uid&name=name
    function serveExTooltipRequest(message){        
        var itemUid = Number.parseInt(message.substring(message.indexOf('&uid=')+5, message.indexOf('&name=')));
        var senderName = message.substring(message.indexOf('&name=')+6);
        
        dispatch.toServer('C_SHOW_ITEM_TOOLTIP_EX',1,{
            unk1: 17,
            uid: itemUid,
            unk2: 0,
            unk3: 0,
            unk4: 0,
            unk5: 0,
            unk6: -1,
            name: senderName
        });
        console.log("ex_tooltip sent");
    }
    //nondb_info&id=id
    function serveNonDbInfoRequest(message){    
        var itemId = Number.parseInt(message.substring(message.indexOf('&id=') + 4));

        dispatch.toServer('C_REQUEST_NONDB_ITEM_INFO', 1,{
            item: itemId,
            unk1: 0,
            unk2: 0
        });
        console.log("nondb_info sent");
    }
    //ask_int&srvId=srvId&name=name
    function servecAskInteractive(message){     
        var srvId = Number.parseInt(message.substring(message.indexOf('&srvId=')+7, message.indexOf('&name=')));
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_ASK_INTERACTIVE', 1,{
            unk1: 1,
            unk2: srvId,
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

        dispatch.toServer('C_REQUEST_PARTY_INFO', 1, {
            unk1: lfgId
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
        dispatch.toClient('S_CHAT',1,{
            channel: 18,
            authorID: 0,
            unk1: 0,
            gm: 0,
            unk2: 0,
            authorName: 'tccChatLink',
            message: msg
        });
    }
    dispatch.hook('sAnswerInteractive', 1 ,(event) => {
        return false;
    });
        dispatch.hook('sChat', 1 ,(event) => {
            if(event.authorName == 'tccChatLink') 
            {
                return false;
            }
            else{return true;}
    });

}