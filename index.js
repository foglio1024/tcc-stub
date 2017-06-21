
module.exports = function TccStub(dispatch) {

    var net = require('net');
    var HOST = '127.0.0.50';
    var PORT = 9550;

    var srv = net.createServer(function(sock){
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
        });

        sock.on('close', function(data){
            srv.close();
            console.log('TCC disconnected: '+sock.remoteAddress+ ' ' +sock.remotePort);
        });
    });
    srv.listen(PORT, HOST);
    console.log('Listening on '+ HOST +':'+ PORT);
   
    function serveExTooltipRequest(message){        //format: ex_tooltip&uid=uid&name=name
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
    function serveNonDbInfoRequest(message){    //format:  nondb_info&id=id
        var itemId = Number.parseInt(message.substring(message.indexOf('&id=') + 4));

        dispatch.toServer('C_REQUEST_NONDB_ITEM_INFO', 1,{
            item: itemId,
            unk1: 0,
            unk2: 0
        });
        console.log("nondb_info sent");
    }
    function servecAskInteractive(message){     //format: ask_int&srvId=srvId&name=name
        var srvId = Number.parseInt(message.substring(message.indexOf('&srvId=')+7, message.indexOf('&name=')));
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_ASK_INTERACTIVE', 1,{
            unk1: 1,
            unk2: srvId,
            name: targetName
        });
        
    }
    function serveInspect(message){     //format: inspect&name=name
        var targetName = message.substring(message.indexOf('&name=') + 6);

        dispatch.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, {
            name: targetName
        });
    }
    function servePartyInvite(message){     //format: party_inv&name=name&raid=raid
        console.log(message);
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

    dispatch.hook('sAnswerInteractive', 1 ,(event) => {
        return false;
    });
    

}