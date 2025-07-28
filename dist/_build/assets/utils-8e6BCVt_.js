const t=r=>{if(r==null||r==="")return null;if(typeof r=="number")return r;const n=String(r).replace(/[^\d.,]/g,"").replace(",","."),e=parseFloat(n);return isNaN(e)?null:e};export{t as p};
