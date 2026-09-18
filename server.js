import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(), PORT=Number(process.env.PORT||10000);
const NAGI_KEY_URL=(process.env.NAGI_KEY_URL||'https://nagi-key-clean.onrender.com').replace(/\/$/,'');
app.use(express.json({limit:'1mb'}));app.use(express.static(path.join(__dirname,'public')));
async function proxy(pathname,body){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 try{
  const r=await fetch(NAGI_KEY_URL+pathname,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:controller.signal,cache:'no-store'});
  const t=await r.text();let d;try{d=JSON.parse(t)}catch{d={success:false,status:'SERVER_ERROR',error:{code:'BAD_RESPONSE',message:'NAGI KEY returned an invalid response.'}}}
  return {status:r.status,data:d};
 }finally{clearTimeout(timer)}
}
for(const [route,target] of [['activate','activate'],['verify','verify'],['deactivate','deactivate']]) app.post('/api/license/'+route,async(req,res)=>{try{const x=await proxy('/api/v1/license/'+target,req.body);res.status(x.status).json(x.data)}catch(e){res.status(503).json({success:false,status:e.name==='AbortError'?'TIMEOUT':'SERVER_ERROR',error:{code:e.name==='AbortError'?'LICENSE_SERVER_TIMEOUT':'LICENSE_SERVER_UNAVAILABLE',message:e.name==='AbortError'?'NAGI KEY license server timed out.':'NAGI KEY license server is unavailable.'}})}});
app.get('/api/health',async(req,res)=>{try{const r=await fetch(NAGI_KEY_URL+'/health',{signal:AbortSignal.timeout(10000)});const d=await r.json().catch(()=>({}));res.status(r.ok?200:503).json({ok:r.ok,nagi_key:d})}catch{res.status(503).json({ok:false,nagi_key:'unreachable'})}});
app.use((req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,'0.0.0.0',()=>console.log('SANTHOSH BARCODE GEN listening on '+PORT+' -> '+NAGI_KEY_URL));