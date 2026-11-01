import {fontData} from './pdf-font.js';

/** ATLAS MAX engineering dossier. No remote dependencies or PDF services. */
const C={bg:'#0b1017',panel:'#111924',panel2:'#172332',line:'#2b3a4c',text:'#edf2f8',muted:'#95a4b7',accent:'#ef6b5b',gold:'#ffd471',soft:'#0f1823'};
const ansi={8364:128,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,381:142,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,382:158,376:159};
const code=c=>ansi[c.codePointAt(0)]??c.codePointAt(0);
const clean=s=>String(s??'').replace(/[\r\t]/g,' ').replace(/[\n]+/g,'\n');
const escape=s=>Array.from(clean(s)).map(c=>{const n=code(c);if(n>255)return '?';if(n>=128)return '\\'+n.toString(8).padStart(3,'0');if(c==='\\'||c==='('||c===')')return '\\'+c;return n<32?' ':c;}).join('');
const rgb=hex=>[1,3,5].map(i=>(parseInt(hex.slice(i,i+2),16)/255).toFixed(4)).join(' ');
const title=s=>String(s??'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const fontWidth=(s,size)=>Array.from(clean(s)).reduce((sum,c)=>{const v=code(c);return sum+(fontData.widths[Math.max(0,Math.min(223,v-32))]||510)*size/1000;},0);
function wrap(s,maxWidth,size){
  const out=[];
  for(const para of clean(s).split('\n')){
    if(!para){out.push('');continue;}
    let line='';
    for(let word of para.split(/\s+/).filter(Boolean)){
      while(fontWidth(word,size)>maxWidth){
        let i=1;while(i<word.length&&fontWidth(word.slice(0,i+1),size)<=maxWidth)i++;
        if(line){out.push(line);line='';}
        out.push(word.slice(0,i));word=word.slice(i);
      }
      if(!word)continue;
      const next=line?line+' '+word:word;
      if(line&&fontWidth(next,size)>maxWidth){out.push(line);line=word;}else line=next;
    }
    if(line)out.push(line);
  }
  return out.length?out:[''];
}
const fit=(s,w,size,min=7)=>{let x=size;while(x>min&&fontWidth(s,x)>w)x-=.5;return x;};

function dossier(){
  const pages=[];let p;
  const rect=(x,y,w,h,color)=>{p.ops+=`${rgb(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f\n`;};
  const stroke=(x,y,w,h,color=C.line,thick=1)=>{p.ops+=`${rgb(color)} RG ${thick} w ${x} ${y} ${w} ${h} re S\n`;};
  const text=(s,x,y,size=10,color=C.text)=>{p.ops+=`${rgb(color)} rg BT /F1 ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escape(s)}) Tj ET\n`;};
  const hline=(x1,y,x2,color=C.line)=>rect(x1,y,x2-x1,.8,color);
  const mark=(x,y)=>{
    p.ops+=`${rgb(C.accent)} RG 1.7 w ${x+13} ${y+26} m ${x+27} ${y+2} l ${x-1} ${y+2} l h S\n`;
    p.ops+=`${rgb(C.accent)} rg ${x+13} ${y+18} m ${x+19} ${y+8} l ${x+13} ${y+1} l ${x+7} ${y+8} l h f\n`;
  };
  const start=(w,h,eyebrow='TECHNOLOGY DOSSIER')=>{
    p={w,h,ops:'',image:null};pages.push(p);
    rect(0,0,w,h,C.bg);rect(0,h-66,w,66,'#121c29');rect(0,h-69,w,3,C.accent);
    mark(33,h-51);
    text('ATLAS',70,h-36,19,C.text);text('MAX',143,h-36,19,C.accent);
    text('NO MAN\'S SKY  /  TECHNOLOGY PLANNER',70,h-52,7,C.muted);
    text(eyebrow,w-243,h-31,9,C.accent);
    text('FIELD ENGINEERING  /  LOCAL EXPORT',w-243,h-47,7,C.muted);
    hline(36,42,w-36);
    text('ATLAS MAX  /  UNOFFICIAL FIELD BLUEPRINT',36,24,7,C.muted);
    text(String(pages.length).padStart(2,'0'),w-52,24,9,C.accent);
    return p;
  };
  const paragraph=(value,x,y,width,size=9,color=C.text,leading=14)=>{
    const lines=wrap(value,width,size);for(const line of lines){text(line,x,y,size,color);y-=leading;}return y;
  };
  return {pages,start,rect,stroke,text,hline,paragraph,wrap,fit,get page(){return p;}};
}

function blueprint(doc,s,mods,result,meta){
  const {rect,stroke,text,hline,fit}=doc,pg=doc.start(1008,720,'01  /  TECHNOLOGY BLUEPRINT');
  const bw=pg.w,by=new Map(mods.map(m=>[m.uid,m]));
  text(s.name||'Untitled expedition',36,610,fit(s.name||'Untitled expedition',936,21,11),C.text);
  text(`${meta.equipment}  /  ${title(s.type)}  /  ${s.class} CLASS  /  ${meta.goal}`,36,591,9,C.muted);
  const chips=[['INSTALLED',`${mods.length} modules`],['GRID',`${s.width} x ${s.height} technology slots`],['SUPERCHARGED',`${s.supercharged.length} marked / ${s.supercharged.filter(q=>Boolean(result.layout[q])).length} occupied`],['ADJACENCY',`${result.info.verifiedEdges} confirmed contacts`]];
  const gap=10,chipWidth=(bw-72-3*gap)/4;
  chips.forEach(([label,value],i)=>{
    const x=36+i*(chipWidth+gap);
    rect(x,526,chipWidth,46,C.panel);stroke(x,526,chipWidth,46);
    text(label,x+12,554,7,C.muted);
    text(value,x+12,536,fit(value,chipWidth-24,11,8),i===2?C.gold:C.text);
  });
  const snap=meta.gridSnapshot;
  const gridRatio=snap?.dataUrl&&snap.width&&snap.height?snap.width/snap.height:null;
  // The first page is dedicated to the identical on-screen grid. No alternate
  // module labels/icons are substituted when DOM capture succeeds.
  const maxW=936,maxH=435,ratio=gridRatio||s.width/(s.height*1.08);
  const gw=Math.min(maxW,maxH*ratio),gh=gw/ratio,gx=(bw-gw)/2,gy=511-gh;
  rect(gx-8,gy-8,gw+16,gh+16,C.panel);stroke(gx-8,gy-8,gw+16,gh+16,'#344659');
  if(snap?.dataUrl){
    pg.image={dataUrl:snap.dataUrl,width:snap.width,height:snap.height,x:gx,y:gy,w:gw,h:gh};
    pg.ops+=`q ${gw.toFixed(3)} 0 0 ${gh.toFixed(3)} ${gx.toFixed(3)} ${gy.toFixed(3)} cm /GridImage Do Q\n`;
  }else{
    // Fully-offline test/unsupported-browser fallback: semantically identical
    // slot data, with icons and all text. The normal browser export embeds DOM.
    const gap=4,cw=(gw-(s.width-1)*gap)/s.width,ch=(gh-(s.height-1)*gap)/s.height;
    for(let r=0;r<s.height;r++)for(let c=0;c<s.width;c++){
      const ix=r*s.width+c,m=by.get(result.layout[ix]),sc=s.supercharged.includes(ix),blocked=s.blocked.includes(ix),x=gx+c*(cw+gap),y=gy+(s.height-r-1)*(ch+gap);
      rect(x,y,cw,ch,blocked?'#0b111a':m?'#151f2c':'#111a27');
      stroke(x,y,cw,ch,sc?C.gold:'#2a3645',sc?2:1);
      if(m)rect(x,y,3,ch,m.color);
      text(`${c+1}:${r+1}${Object.values(s.fixed).includes(ix)?' PIN':''}`,x+5,y+ch-12,8,C.muted);
      if(sc)text('SC',x+cw-17,y+ch-12,7,C.gold);
      if(m){
        const icon={engine:'ENG',weapon:'WPN',shield:'SHD',cargo:'CRG',system:'SYS'}[m.iconKind]||'SYS';
        text(icon,x+cw-25,y+ch-27,8,m.color);text(m.short,x+5,y+ch-38,fit(m.short,cw-10,11,8),m.color);
        const label=wrap(m.label||m.name,cw-10,7);
        label.slice(0,Math.min(3,Math.floor((ch-44)/10))).forEach((line,i)=>text(line,x+5,y+ch-49-i*9,7,C.text));
        text(m.kind.toUpperCase(),x+5,y+7,6,m.color);
      }else text(blocked?'BLOCKED':'EMPTY',x+5,y+9,7,C.muted);
    }
  }
  const spare=gy-67;
  if(spare>90){
    const top=gy-22;
    hline(36,top,bw-36);
    text('LAYOUT INTELLIGENCE',36,top-20,9,C.accent);
    text(`${result.info.fragments} extra fragments  /  ${result.info.groups.length} technology families`,36,top-41,10,C.text);
    const charged=s.supercharged.map(i=>by.get(result.layout[i])).filter(Boolean);
    const chargedText=charged.length?charged.map(m=>m.label||m.name).join('  /  '):'No installed modules occupy supercharged slots';
    text(chargedText.slice(0,125),36,top-59,9,C.muted);
  }
  text('GOLD OUTLINE = SUPERCHARGED    /    COORDINATES = COLUMN:ROW    /    MODULE INDEX FOLLOWS',36,54,8,C.muted);
}

function drawSection(doc,tag,heading,subtitle){
  const {text,hline}=doc,pg=doc.start(595,842,tag);
  text(heading,36,736,20,C.text);
  text(subtitle,36,717,9,C.muted);
  hline(36,704,559,C.accent);
  return pg;
}

function componentManifest(doc,s,mods,result,meta){
  const {rect,stroke,text,wrap}=doc;
  const by=new Map(mods.map(m=>[m.uid,m]));
  const entries=result.layout.flatMap((id,i)=>id&&by.has(id)?[{m:by.get(id),i}]:[]);
  let col=0,y=688;
  const cw=255,gap=12,top=688,bottom=76;
  const begin=(continued=false)=>{drawSection(doc,'02  /  COMPONENT MANIFEST',continued?'Component manifest / continued':'Installed component manifest',`${entries.length} modules  /  Coordinates match blueprint page 01`);col=0;y=top;};
  begin();
  const coords=i=>`${i%s.width+1}:${Math.floor(i/s.width)+1}`;
  entries.forEach(({m,i},idx)=>{
    const sc=s.supercharged.includes(i),pin=Object.values(s.fixed).includes(i);
    const nameLines=wrap(m.name,cw-31,10);
    const metaLine=`${title(m.kind)}  /  ${title(m.family)}`;
    const idLine=`IDENTIFIER  ${m.short}`;
    const extras=[];
    if(m.label&&m.label!==m.name)extras.push(['INSTALLED AS',m.label]);
    if(m.origin)extras.push(['CONSTRUCTION',m.origin]);
    if(m.notes)extras.push(['FIELD NOTE',m.notes]);
    const extraLines=extras.flatMap(([label,value])=>wrap(`${label}: ${value}`,cw-30,8).map(v=>v));
    const hh=Math.max(64,45+nameLines.length*12+extraLines.length*11+(extras.length?8:0));
    if(y-hh<bottom){if(col===0){col=1;y=top;}else{begin(true);}}
    const x=36+col*(cw+gap),yBottom=y-hh;
    rect(x,yBottom,cw,hh-5,C.panel2);stroke(x,yBottom,cw,hh-5,'#2f4053');rect(x,yBottom,3,hh-5,m.color);
    text(coords(i),x+11,y-14,10,C.text);
    if(sc)text('SC',x+48,y-14,8,C.gold);
    if(pin)text('PIN',x+74,y-14,8,C.muted);
    text(`${String(idx+1).padStart(2,'0')} / ${entries.length}`,x+cw-59,y-14,7,C.muted);
    let yy=y-29;
    for(const ln of nameLines){text(ln,x+11,yy,10,C.text);yy-=12;}
    text(metaLine,x+11,yy-1,8,m.color);yy-=13;
    text(idLine,x+11,yy-1,7,C.muted);yy-=12;
    if(extraLines.length){
      rect(x+11,yy+5,cw-22,.7,'#344459');yy-=4;
      for(const ln of extraLines){text(ln,x+11,yy-1,8,C.muted);yy-=11;}
    }
    y-=hh;
  });
}

function construction(doc,manifest){
  if(!manifest?.length)return;
  const {rect,stroke,text,wrap}=doc;
  drawSection(doc,'03  /  CORVETTE CONSTRUCTION','Corvette construction','Component counts, generated technology and mapping confidence');
  let y=686,index=0;
  for(const item of manifest){
    const name=wrap(`${item.count} x ${item.name}`,480,11);
    const mapping=wrap(item.tech?.name?`GENERATES: ${item.tech.name}`:'No verified technology-slot mapping',480,9);
    const notes=item.note?wrap(item.note,480,8):[];
    const height=29+name.length*13+mapping.length*12+notes.length*11;
    if(y-height<78){drawSection(doc,'03  /  CORVETTE CONSTRUCTION','Construction / continued','Component counts, generated technology and mapping confidence');y=686;}
    rect(36,y-height,523,height-5,index++%2?C.panel:C.panel2);
    rect(36,y-height,3,height-5,item.tech?C.accent:C.gold);
    let ty=y-18;
    name.forEach(v=>{text(v,49,ty,11,C.text);ty-=13;});
    mapping.forEach(v=>{text(v,49,ty,9,item.tech?C.muted:C.gold);ty-=12;});
    notes.forEach(v=>{text(v,49,ty,8,C.muted);ty-=11;});
    y-=height+7;
  }
}

function analysis(doc,result,mods,meta){
  const {rect,stroke,text,wrap}=doc;
  drawSection(doc,'04  /  ADJACENCY & EVIDENCE','Adjacency & evidence','Documented contacts are distinct from organizational grouping');
  let y=682;
  const ensure=(h)=>{if(y-h<78){drawSection(doc,'04  /  ADJACENCY & EVIDENCE','Evidence / continued','Optimization evidence, cautions and module references');y=682;}};
  const label=(s)=>{ensure(43);text(s,36,y,10,C.accent);y-=20;};
  const write=(content,color=C.text,size=9,indent=0)=>{
    const lines=wrap(content,510-indent,size);const hh=lines.length*(size+5)+9;ensure(hh);
    for(const v of lines){text(v,40+indent,y,size,color);y-=size+5;}y-=9;
  };
  rect(36,y-76,523,76,C.panel2);stroke(36,y-76,523,76);
  text('CONFIRMED CONTACTS',51,y-21,8,C.muted);
  text(String(result.info.verifiedEdges),51,y-49,23,C.text);
  text('EXTRA FRAGMENTS',222,y-21,8,C.muted);
  text(String(result.info.fragments),222,y-49,23,C.text);
  text('TECHNOLOGY FAMILIES',385,y-21,8,C.muted);
  text(String(result.info.groups.length),385,y-49,23,C.text);
  y-=100;
  label('01 / FAMILY CONNECTIONS');
  if(result.info.groups.length)for(const g of result.info.groups){
    ensure(28);rect(36,y-22,523,24,C.panel);text(title(g.name),46,y-13,9,C.text);
    text(`${g.count} installed  /  ${g.components} connected group(s)`,319,y-13,9,g.components===1?'#a9ceb7':C.muted);y-=29;
  }else write('No connected technology families were identified.',C.muted);
  y-=9;label('02 / CAUTIONS & METHOD');
  write('Heuristic, goal-first placement. Physical grouping is an organizational objective; only verified adjacency IDs count as documented in-game contacts.',C.muted);
  write('Exact DPS, range and hidden multipliers are not calculated. Procedural rolls and installed module preferences are player supplied.',C.muted);
  for(const warning of result.warnings||[])write('CAUTION: '+warning,C.gold);
  y-=7;label('03 / SOURCE REFERENCES');
  const sources=[...new Set(mods.map(m=>m.source).filter(Boolean))];
  if(!sources.length)write('No source URLs are recorded for installed components.',C.muted);
  for(const source of sources)write(source,C.muted,8);
  if(meta.manifest?.length){y-=8;label('04 / CONSTRUCTION DISCLAIMER');write('Unverified Corvette part mappings remain explicit in the construction manifest. Active generated modules and shared-system limits must be checked in-game.',C.muted);}
}

/**
 * @param {object} meta Optional gridSnapshot from captureGrid(document.querySelector('#grid')).
 * Returns PDF bytes synchronously, retaining Node/offline test compatibility.
 */
export function makePDF(s,modules,result,meta={}){
  const doc=dossier();
  blueprint(doc,s,modules,result,meta);
  componentManifest(doc,s,modules,result,meta);
  construction(doc,meta.manifest);
  analysis(doc,result,modules,meta);
  return encodePDF(doc.pages);
}

export function encodePDF(pages){
  const fontBytes=atob(fontData.base64);
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','',
    `<< /Type /Font /Subtype /TrueType /BaseFont /DejaVuSans /Encoding /WinAnsiEncoding /FirstChar 32 /LastChar 255 /Widths [${fontData.widths.join(' ')}] /FontDescriptor 4 0 R >>`,
    `<< /Type /FontDescriptor /FontName /DejaVuSans /Flags 32 /FontBBox [${fontData.bbox.join(' ')}] /ItalicAngle 0 /Ascent ${fontData.ascent} /Descent ${fontData.descent} /CapHeight 729 /StemV 80 /FontFile2 5 0 R >>`,
    `<< /Length ${fontBytes.length} /Length1 ${fontBytes.length} >>\nstream\n${fontBytes}\nendstream`];
  const kids=[];
  for(const raw of pages){
    const page=typeof raw==='string'?{ops:raw,w:595,h:842,image:null}:raw;
    const pageId=objects.length+1,streamId=pageId+1,imgId=page.image?streamId+1:null;
    kids.push(`${pageId} 0 R`);
    const xobj=imgId?` /XObject << /GridImage ${imgId} 0 R >>`:'';
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.w} ${page.h}] /Resources << /Font << /F1 3 0 R >>${xobj} >> /Contents ${streamId} 0 R >>`);
    objects.push(`<< /Length ${page.ops.length} >>\nstream\n${page.ops}endstream`);
    if(imgId){
      if(!/^data:image\/jpeg;base64,/.test(page.image.dataUrl))throw Error('Grid snapshot must be a JPEG data URL.');
      const bytes=atob(page.image.dataUrl.split(',')[1]);
      objects.push(`<< /Type /XObject /Subtype /Image /Width ${page.image.width} /Height ${page.image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n${bytes}\nendstream`);
    }
  }
  objects[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
  let output='%PDF-1.4\n';const offsets=[0];
  objects.forEach((obj,i)=>{offsets.push(output.length);output+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=output.length;
  output+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(const off of offsets.slice(1))output+=`${String(off).padStart(10,'0')} 00000 n \n`;
  output+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Uint8Array.from(output,c=>c.charCodeAt(0));
}
