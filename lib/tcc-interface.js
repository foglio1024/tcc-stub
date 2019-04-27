const http = require('http');
class TccInterface
{
    constructor()
    {
        this.nextId = 0;
    }

    call(method, params)
    {
        const request = {
            'jsonrpc': '2.0',
            'method': method,
            'params': params,
            'id': this.nextId++
        };
        const options = {
            hostname: '127.0.0.51',
            port: 9551,
            method: 'POST',
            path: '/',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(request).length
            }
        };
        try
        {
            const req = http.request(options, (res) => { });
            req.on('error', (error) => console.log(error));
            req.write(JSON.stringify(request));
            req.end();
        }
        catch (err)
        {
            console.log(err);
        }
    }
}
exports.TccInterface = TccInterface;
