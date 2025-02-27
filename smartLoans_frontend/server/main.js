import express from 'express';
import path from 'path';
let app=express();
const staticPath=path.join(process.cwd(),'dist');
app.use(express.static(staticPath));
app.get('*',(request,response)=>{
    response.sendFile(path.join(staticPath,'index.html'));
})
app.listen(80,()=>{
    console.log(`Server started on http://localhost:80`);
})