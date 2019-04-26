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
            req.on('error', err => console.log(err));
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
    }

    start()
    {
        try
        {
            this.server.listen(9550, '127.0.0.52', () => { });
        }
        catch (error)
        {
            console.log(`[RpcServer] ${error}`);
        }
    }
    stop()
    {
        this.server.removeAllListeners();
        this.server.close();
    }
}
exports.RpcServer = RpcServer;
