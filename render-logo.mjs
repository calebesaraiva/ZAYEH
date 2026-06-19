import { createCanvas, ImageData } from 'canvas';
import { readFileSync, writeFileSync } from 'fs';

// Create a functional Path2D polyfill using canvas context commands
class Path2DPolyfill {
  constructor(d) {
    this._cmds = [];
    if (typeof d === 'string') {
      // Minimal SVG path parser - not needed for PDF
    }
  }
  moveTo(x,y) { this._cmds.push(['m',x,y]); }
  lineTo(x,y) { this._cmds.push(['l',x,y]); }
  bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y) { this._cmds.push(['b',cp1x,cp1y,cp2x,cp2y,x,y]); }
  quadraticCurveTo(cpx,cpy,x,y) { this._cmds.push(['q',cpx,cpy,x,y]); }
  closePath() { this._cmds.push(['c']); }
  arc(x,y,r,sa,ea,cc) { this._cmds.push(['a',x,y,r,sa,ea,cc]); }
  arcTo(x1,y1,x2,y2,r) { this._cmds.push(['at',x1,y1,x2,y2,r]); }
  ellipse(x,y,rx,ry,rot,sa,ea,cc) { this._cmds.push(['e',x,y,rx,ry,rot,sa,ea,cc]); }
  rect(x,y,w,h) { this._cmds.push(['r',x,y,w,h]); }
  addPath(path, transform) { this._cmds.push(...path._cmds); }
  _replay(ctx) {
    ctx.beginPath();
    for (const cmd of this._cmds) {
      switch(cmd[0]) {
        case 'm': ctx.moveTo(cmd[1],cmd[2]); break;
        case 'l': ctx.lineTo(cmd[1],cmd[2]); break;
        case 'b': ctx.bezierCurveTo(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6]); break;
        case 'q': ctx.quadraticCurveTo(cmd[1],cmd[2],cmd[3],cmd[4]); break;
        case 'c': ctx.closePath(); break;
        case 'a': ctx.arc(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6]); break;
        case 'at': ctx.arcTo(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5]); break;
        case 'e': ctx.ellipse(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7],cmd[8]); break;
        case 'r': ctx.rect(cmd[1],cmd[2],cmd[3],cmd[4]); break;
      }
    }
  }
}

global.DOMMatrix = class DOMMatrix {
  constructor(init) {
    this.a=1;this.b=0;this.c=0;this.d=1;this.e=0;this.f=0;
    this.m11=1;this.m12=0;this.m13=0;this.m14=0;
    this.m21=0;this.m22=1;this.m23=0;this.m24=0;
    this.m31=0;this.m32=0;this.m33=1;this.m34=0;
    this.m41=0;this.m42=0;this.m43=0;this.m44=1;
    this.is2D=true; this.isIdentity=true;
  }
  translate(x,y) { const m=new DOMMatrix(); m.e=x;m.f=y; return m; }
  scale(s,sy,oz,ox,oy) { const m=new DOMMatrix(); m.a=s;m.d=sy||s; return m; }
  multiply(o) { return new DOMMatrix(); }
  inverse() { return new DOMMatrix(); }
  transformPoint(p) { return {x:p.x,y:p.y,z:0,w:1}; }
};
global.DOMPoint = class DOMPoint {
  constructor(x,y,z,w) { this.x=x||0;this.y=y||0;this.z=z||0;this.w=w||1; }
};
global.ImageData = ImageData;
global.Path2D = Path2DPolyfill;

// Patch canvas context to handle Path2D
const origGetContext = createCanvas(1,1).getContext.bind;

const { getDocument, GlobalWorkerOptions } = await import('./node_modules/pdfjs-dist/legacy/build/pdf.mjs');
GlobalWorkerOptions.workerSrc = new URL('./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url).href;

const data = readFileSync('C:/Users/Calebe/Downloads/SUH LOGO.pdf');
const pdfDoc = await getDocument({ data: new Uint8Array(data), useSystemFonts: true, isEvalSupported: false }).promise;
const page = await pdfDoc.getPage(1);
const vp1 = page.getViewport({ scale: 1 });
console.log('PDF page size:', vp1.width, 'x', vp1.height);

const scale = 6;
const viewport = page.getViewport({ scale });
const cnv = createCanvas(viewport.width, viewport.height);
const ctx = cnv.getContext('2d');

// Patch ctx to handle Path2D objects
const origFill = ctx.fill.bind(ctx);
const origStroke = ctx.stroke.bind(ctx);
const origClip = ctx.clip.bind(ctx);
ctx.fill = function(pathOrRule, rule) {
  if (pathOrRule instanceof Path2DPolyfill) { pathOrRule._replay(ctx); ctx.fill(rule); }
  else origFill(pathOrRule, rule);
};
ctx.stroke = function(path) {
  if (path instanceof Path2DPolyfill) { path._replay(ctx); ctx.stroke(); }
  else origStroke(path);
};
ctx.clip = function(pathOrRule, rule) {
  if (pathOrRule instanceof Path2DPolyfill) { pathOrRule._replay(ctx); ctx.clip(rule); }
  else origClip(pathOrRule, rule);
};

await page.render({ canvasContext: ctx, viewport }).promise;
const buf = cnv.toBuffer('image/png');
writeFileSync('C:/Users/Calebe/Desktop/SUN/public/suh-logo.png', buf);
console.log('Saved suh-logo.png', buf.length, 'bytes', Math.round(viewport.width), 'x', Math.round(viewport.height));
