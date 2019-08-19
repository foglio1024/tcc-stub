const { Helpers } = require("./helpers");
const { RpcHandler } = require("./rpc-handler");
const http = require('http');

class RpcServer
{
    constructor(tcc_stub)
    {
        this.handler = new RpcHandler(tcc_stub);
        this.server = http.createServer((req, res) =>
        {
            if (req.method !== 'POST') return;
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('error', err => {
                if(err.errno === 'ECONNREFUSED'){
                    console.log(`Failed to send data to TCC (error:${err.errno}). Make sure that:\n\t1. TCC is running and working correctly\n\t2. Toolbox is enabled in TCC System settings.`);
                }
                else{
                    console.log(`Failed to send data to TCC (error:${err.errno}).`)
                }
            });
            req.on('end', () =>
            {
                let rpcRequest = JSON.parse(body);
                var rpcResult = null;
                var respType = 'result';
                try
                {
                    rpcResult = this.handler.handle(rpcRequest);
                }
                catch (error)
                {
                    respType = 'error';
                    rpcResult = {
                        'code': -1,
                        'message': error
                    };
                }
                let jsonResponse = Helpers.buildResponse(rpcResult, rpcRequest.id, respType);
                let stringResponse = JSON.stringify(jsonResponse);
                //console.log(`\n------REQUEST------\n\t${JSON.stringify(rpcRequest)}\n------RESPONSE------\n\t${stringResponse}`);
                res.writeHead(200, Helpers.buildHeaders(stringResponse.length));
                res.write(stringResponse);
                res.end();
            });
        });
        this.server.on('error', err =>
        {
            if (err.errno == 'EADDRINUSE')
            {
                console.log(`[tcc-stub] Cannot connect to TCC (${err}). This might be caused by multi-clienting.`);
            }
            else if (err.errno == 'ECONNREFUSED')
            {
                console.log(`[tcc-stub] Cannot connect to TCC (${err}). TCC didn't might not be running.`);
            }
        });

    }

    start()
    {
        this.server.listen(9550, '127.0.0.52', () => { });
    }
    stop()
    {
        this.server.removeAllListeners();
        this.server.close();
    }
}
exports.RpcServer = RpcServer;
