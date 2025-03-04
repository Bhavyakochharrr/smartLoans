import express from 'express';
import dotenv from 'dotenv';
import {httpx, expressx} from 'ca-webutils'
import express from 'express';
import path from 'path';
import { createRequestHandler } from 'react-router-dom';
import { publicIpv4} from 'public-ip';

dotenv.config();
let app=express();
const staticPath=path.join(process.cwd(),'dist');
app.use(express.static(staticPath));

app.get('/ip', async(req,res)=>{
    let ip = await publicIpv4();
    res.json({ip});
})
app.get('*',(request,response)=>{
    response.sendFile(path.join(staticPath,'index.html'));
})


httpx.runApp({
    requestHandler: app
})
app.listen(80,()=>{
    console.log(`Server started on http://localhost:80`);
})