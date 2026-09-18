import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(), PORT=Number(process.env.PORT||10000);
const NAGI_KEY_URL=(process.env.NAGI_KEY_URL||'https://nagi-key-clean.onrender.com').replace(/\/$/,'');
app.use(express.json({limit:'1mb'})); app.use(express.static(path.join(__dirname,'public')));
async function proxy(pathname,body){const r=await fetch(NAGI_KEY_URL+pathname,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d={success:false,status:'SERVER_ERROR',error:{code:'BAD_RESPONSE',message:'License server returned an invalid response.'}}}return {status:r.status,data:d}}
for(const [route,target] of [['activate','activate'],['verify','verify'],['deactivate','deactivate']]) app.post('/api/license/'+route,async(req,res)=>{try{const x=await proxy('/api/v1/license/'+target,req.body);res.status(x.status).json(x.data)}catch{res.status(503).json({success:false,status:'SERVER_ERROR',error:{code:'LICENSE_SERVER_UNAVAILABLE',message:'License server is unavailable.'}})}});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,'0.0.0.0',()=>console.log('SANTHOSH BARCODE GEN listening on '+PORT));
