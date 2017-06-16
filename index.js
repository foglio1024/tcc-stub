
module.exports = function TccStub(dispatch) {

    var net = require('net');
    var HOST = '127.0.0.50';
    var PORT = 9550;

    net.createServer(function(sock){
        sock.setEncoding('utf8');
        console.log('TCC connected: ' + sock.remoteAddress + ':' + sock.remotePort);
        sock.on('data',function(data){
            //handle request
            var request = data.toString();
            
            if(request.startsWith('ex_tooltip')){
                console.log('sending tooltip request: ' + request.toString());

                var itemUid = Number.parseInt(request.substring(request.indexOf('&uid=')+5, request.indexOf('&name=')));
                var senderName = request.substring(request.indexOf('&name=')+6);
                
                console.log('request info: itemUid='+itemUid+' - '+'itemName='+senderName );
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
                console.log('request sent')
            }

            else if(request.startsWith('nondb_tooltip')){
                console.log('nondb request: ' + request.toString())
            }
        });

        sock.on('close', function(data){
            console.log('TCC disconnected: '+sock.remoteAddress+ ' ' +sock.remotePort);
        });
    }).listen(PORT, HOST);
    console.log('Listening on '+ HOST +':'+ PORT);


    
}