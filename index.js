
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
        });

        sock.on('close', function(data){
            srv.close();
            console.log('TCC disconnected: '+sock.remoteAddress+ ' ' +sock.remotePort);
        });
    });
    srv.listen(PORT, HOST);
    console.log('Listening on '+ HOST +':'+ PORT);
   
    function serveExTooltipRequest(message){        //format: ex_tooltip&uid=___&name=___
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
    function serveNonDbInfoRequest(message){    //format:  nondb_info&id=___
        var itemId = Number.parseInt(message.substring(message.indexOf('&id=') + 4));

        dispatch.toServer('C_REQUEST_NONDB_ITEM_INFO', 1,{
            item: itemId,
            unk1: 0,
            unk2: 0
        })
        console.log("nondb_info sent");
        
    }
}