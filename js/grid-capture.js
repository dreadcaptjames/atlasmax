/**
 * Captures the real inventory DOM (not a separately maintained PDF drawing).
 * SVG foreignObject preserves the button grid, its text, SVG icons, theme,
 * supercharge outlines and CSS effects in one high-resolution bitmap.
 * If a browser blocks SVG/canvas export, callers can use the vector fallback.
 */
export async function captureGrid(grid){
  if(!grid || typeof document==='undefined')throw Error('Inventory grid is unavailable.');
  if(document.fonts?.ready)await document.fonts.ready;
  const box=grid.getBoundingClientRect();
  const width=Math.ceil(Math.max(grid.scrollWidth,box.width));
  const height=Math.ceil(Math.max(grid.scrollHeight,box.height));
  if(!width||!height||width>5000||height>5000)throw Error('Invalid inventory grid dimensions.');
  const copy=grid.cloneNode(true);
  // Inspection is a transient hover/selection affordance, not a build setting.
  copy.querySelectorAll('.slot.selected').forEach(el=>el.classList.remove('selected'));
  copy.style.width=width+'px';
  copy.style.height=height+'px';
  copy.style.maxWidth='none';
  const css=[];
  for(const sheet of document.styleSheets){
    try { for(const rule of sheet.cssRules)css.push(rule.cssText); }
    catch { /* Cross-origin stylesheets cannot be embedded; local CSS is sufficient. */ }
  }
  const root=getComputedStyle(document.documentElement);
  const vars=['--accent','--accent-rgb','--bg','--panel','--line','--text','--muted','--gold']
    .map(k=>k+':'+root.getPropertyValue(k).trim()+';').join('');
  const cssText=css.join('\n').replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const serialized=new XMLSerializer().serializeToString(copy);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;overflow:hidden;${vars}font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#edf2f8;"><style>${cssText}</style>${serialized}</div></foreignObject></svg>`;
  // A data URL keeps same-origin SVG rasterization origin-clean in Chromium.
  // A blob: URL taints the canvas when it contains foreignObject HTML.
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  {
    const img=new Image();
    await new Promise((resolve,reject)=>{
      img.onload=resolve;
      img.onerror=()=>reject(Error('Browser could not rasterize the inventory grid.'));
      img.src=url;
    });
    const scale=Math.min(2.5,4096/Math.max(width,height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.round(width*scale);
    canvas.height=Math.round(height*scale);
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw Error('Canvas capture unavailable.');
    ctx.fillStyle='#111924';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.scale(scale,scale);
    ctx.drawImage(img,0,0,width,height);
    const dataUrl=canvas.toDataURL('image/jpeg',.94);
    if(!dataUrl.startsWith('data:image/jpeg;base64,'))throw Error('JPEG grid capture unavailable.');
    return {dataUrl,width:canvas.width,height:canvas.height};
  }
}
