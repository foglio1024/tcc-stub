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
            req.on('error', (err) =>
            {
                if (err.errno === 'ECONNREFUSED')
                {
                    console.log(`[tcc-stub] Failed to send data to TCC (error:${err.errno}). Make sure that:\n\t1. TCC is running and working correctly\t\n2. Toolbox is enabled in TCC System settings.`);
                }
                else
                {
                    console.log(`[tcc-stub] Failed to send data to TCC (error:${err.errno}).`)
                }
            });
            req.write(JSON.stringify(request));
            req.end();
        }
        catch (err)
        {
            console.log(`[tcc-stub] Error in TCC interface: ${err}`);
        }
    }
}
exports.TccInterface = TccInterface;
