var hb=Object.defineProperty,pb=Object.defineProperties;var mb=Object.getOwnPropertyDescriptors;var P_=Object.getOwnPropertySymbols;var gb=Object.prototype.hasOwnProperty,_b=Object.prototype.propertyIsEnumerable;var O_=(n,e,t)=>e in n?hb(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,Wt=(n,e)=>{for(var t in e||={})gb.call(e,t)&&O_(n,t,e[t]);if(P_)for(var t of P_(e))_b.call(e,t)&&O_(n,t,e[t]);return n},hn=(n,e)=>pb(n,mb(e));var la=[null],Yc=[!1],Qr=1,vb=null,jn=Symbol("SIGNAL");function we(n){let e=la[0];return la[0]=n,e}function Zc(){return la[0]}var ua={version:0,lastCleanEpoch:0,dirty:!1,producers:void 0,producersTail:void 0,consumers:void 0,consumersTail:void 0,recomputing:!1,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,kind:"unknown",producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function Jc(n){if(Yc[0])throw new Error("");let e=la[0];if(e===null)return;e.consumerOnSignalRead(n);let t=e.producersTail;if(t!==void 0&&t.producer===n)return;let i,r=e.recomputing;if(r&&(i=t!==void 0?t.nextProducer:e.producers,i!==void 0&&i.producer===n)){e.producersTail=i,i.lastReadVersion=n.version,i.knownValidAtEpoch=Qr;return}let s=n.consumersTail;if(s!==void 0&&s.consumer===e&&(!r||s.knownValidAtEpoch===Qr))return;let o=qs(e),a={producer:n,consumer:e,nextProducer:i,prevConsumer:void 0,knownValidAtEpoch:Qr,lastReadVersion:n.version,nextConsumer:void 0};e.producersTail=a,t!==void 0?t.nextProducer=a:e.producers=a,o&&B_(n,a)}function L_(){Qr++}function Kc(n){if(!(qs(n)&&!n.dirty)&&!(!n.dirty&&n.lastCleanEpoch===Qr)){if(!n.producerMustRecompute(n)&&!Hf(n)){kf(n);return}n.producerRecomputeValue(n),kf(n)}}function Bf(n){if(n.consumers===void 0)return;let e=Yc[0];Yc[0]=!0;try{for(let t=n.consumers;t!==void 0;t=t.nextConsumer){let i=t.consumer;i.dirty||yb(i)}}finally{Yc[0]=e}}function Uf(){return la[0]?.consumerAllowSignalWrites!==!1}function yb(n){n.dirty=!0,Bf(n),n.consumerMarkedDirty?.(n)}function kf(n){n.dirty=!1,n.lastCleanEpoch=Qr}function Qc(n){return n&&F_(n),we(n)}function F_(n){if(n.producersTail?.knownValidAtEpoch===Qr){let e=n.producers;for(;e!==void 0;)e.knownValidAtEpoch=null,e=e.nextProducer}n.producersTail=void 0,n.recomputing=!0}function Vf(n,e){we(e),n&&k_(n)}function k_(n){n.recomputing=!1;let e=n.producersTail,t=e!==void 0?e.nextProducer:n.producers;if(t!==void 0){if(qs(n))do t=zf(t);while(t!==void 0);e!==void 0?e.nextProducer=void 0:n.producers=void 0}}function Hf(n){for(let e=n.producers;e!==void 0;e=e.nextProducer){let t=e.producer,i=e.lastReadVersion;if(i!==t.version||(Kc(t),i!==t.version))return!0}return!1}function el(n){if(qs(n)){let e=n.producers;for(;e!==void 0;)e=zf(e)}n.producers=void 0,n.producersTail=void 0,n.consumers=void 0,n.consumersTail=void 0}function B_(n,e){let t=n.consumersTail,i=qs(n);if(t!==void 0?(e.nextConsumer=t.nextConsumer,t.nextConsumer=e):(e.nextConsumer=void 0,n.consumers=e),e.prevConsumer=t,n.consumersTail=e,!i)for(let r=n.producers;r!==void 0;r=r.nextProducer)B_(r.producer,r)}function zf(n){let e=n.producer,t=n.nextProducer,i=n.nextConsumer,r=n.prevConsumer;if(n.nextConsumer=void 0,n.prevConsumer=void 0,i!==void 0?i.prevConsumer=r:e.consumersTail=r,r!==void 0)r.nextConsumer=i;else if(e.consumers=i,!qs(e)){let s=e.producers;for(;s!==void 0;)s=zf(s)}return t}function qs(n){return n.consumerIsAlwaysLive||n.consumers!==void 0}function Gf(n){vb?.(n)}function Wf(n,e){return Object.is(n,e)}function tl(n,e){let t=Object.create(xb);t.computation=n,e!==void 0&&(t.equal=e);let i=()=>{if(Kc(t),Jc(t),t.value===$s)throw t.error;return t.value};return i[jn]=t,Gf(t),i}var Lf=Symbol("UNSET"),Ff=Symbol("COMPUTING"),$s=Symbol("ERRORED"),xb=hn(Wt({},ua),{value:Lf,dirty:!0,error:null,equal:Wf,kind:"computed",producerMustRecompute(n){return n.value===Lf||n.value===Ff},producerRecomputeValue(n){if(n.value===Ff)throw new Error("");let e=n.value;n.value=Ff;let t=Qc(n),i,r=!1;try{i=n.computation(),we(null),r=e!==Lf&&e!==$s&&i!==$s&&n.equal(e,i)}catch(s){i=$s,n.error=s}finally{Vf(n,t)}if(r){n.value=e;return}n.value=i,n.version++}});function Mb(){throw new Error}var U_=Mb;function V_(n){U_(n)}function jf(n){U_=n}var Eb=null;function $f(n,e){let t=Object.create(qf);t.value=n,e!==void 0&&(t.equal=e);let i=()=>H_(t);return i[jn]=t,Gf(t),[i,o=>nl(t,o),o=>z_(t,o)]}function H_(n){return Jc(n),n.value}function nl(n,e){Uf()||V_(n),n.equal(n.value,e)||(n.value=e,bb(n))}function z_(n,e){Uf()||V_(n),nl(n,e(n.value))}var qf=hn(Wt({},ua),{equal:Wf,value:void 0,kind:"signal"});function bb(n){n.version++,L_(),Bf(n),Eb?.(n)}var Xf=[void 0];function il(){return Xf[0]}function yi(n){let e=Xf[0];return Xf[0]=n,e}var G_=Symbol("NotFound");function Xs(n){return n===G_||n?.name==="\u0275NotFound"}function pn(n){return typeof n=="function"}function rl(n){let t=n(i=>{Error.call(i),i.stack=new Error().stack});return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t}var sl=rl(n=>function(t){n(this),this.message=t?`${t.length} errors occurred during unsubscription:
${t.map((i,r)=>`${r+1}) ${i.toString()}`).join(`
  `)}`:"",this.name="UnsubscriptionError",this.errors=t});function da(n,e){if(n){let t=n.indexOf(e);0<=t&&n.splice(t,1)}}var an=class n{constructor(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let e;if(!this.closed){this.closed=!0;let{_parentage:t}=this;if(t)if(this._parentage=null,Array.isArray(t))for(let s of t)s.remove(this);else t.remove(this);let{initialTeardown:i}=this;if(pn(i))try{i()}catch(s){e=s instanceof sl?s.errors:[s]}let{_finalizers:r}=this;if(r){this._finalizers=null;for(let s of r)try{W_(s)}catch(o){e=e??[],o instanceof sl?e=[...e,...o.errors]:e.push(o)}}if(e)throw new sl(e)}}add(e){var t;if(e&&e!==this)if(this.closed)W_(e);else{if(e instanceof n){if(e.closed||e._hasParent(this))return;e._addParent(this)}(this._finalizers=(t=this._finalizers)!==null&&t!==void 0?t:[]).push(e)}}_hasParent(e){let{_parentage:t}=this;return t===e||Array.isArray(t)&&t.includes(e)}_addParent(e){let{_parentage:t}=this;this._parentage=Array.isArray(t)?(t.push(e),t):t?[t,e]:e}_removeParent(e){let{_parentage:t}=this;t===e?this._parentage=null:Array.isArray(t)&&da(t,e)}remove(e){let{_finalizers:t}=this;t&&da(t,e),e instanceof n&&e._removeParent(this)}};an.EMPTY=(()=>{let n=new an;return n.closed=!0,n})();var Yf=an.EMPTY;function ol(n){return n instanceof an||n&&"closed"in n&&pn(n.remove)&&pn(n.add)&&pn(n.unsubscribe)}function W_(n){pn(n)?n():n.unsubscribe()}var ri={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1};var Ys={setTimeout(n,e,...t){let{delegate:i}=Ys;return i?.setTimeout?i.setTimeout(n,e,...t):setTimeout(n,e,...t)},clearTimeout(n){let{delegate:e}=Ys;return(e?.clearTimeout||clearTimeout)(n)},delegate:void 0};function j_(n){Ys.setTimeout(()=>{let{onUnhandledError:e}=ri;if(e)e(n);else throw n})}function Zf(){}var $_=Jf("C",void 0,void 0);function q_(n){return Jf("E",void 0,n)}function X_(n){return Jf("N",n,void 0)}function Jf(n,e,t){return{kind:n,value:e,error:t}}var es=null;function Zs(n){if(ri.useDeprecatedSynchronousErrorHandling){let e=!es;if(e&&(es={errorThrown:!1,error:null}),n(),e){let{errorThrown:t,error:i}=es;if(es=null,t)throw i}}else n()}function Y_(n){ri.useDeprecatedSynchronousErrorHandling&&es&&(es.errorThrown=!0,es.error=n)}var ts=class extends an{constructor(e){super(),this.isStopped=!1,e?(this.destination=e,ol(e)&&e.add(this)):this.destination=Ib}static create(e,t,i){return new Js(e,t,i)}next(e){this.isStopped?Qf(X_(e),this):this._next(e)}error(e){this.isStopped?Qf(q_(e),this):(this.isStopped=!0,this._error(e))}complete(){this.isStopped?Qf($_,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(e){this.destination.next(e)}_error(e){try{this.destination.error(e)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}},Tb=Function.prototype.bind;function Kf(n,e){return Tb.call(n,e)}var eh=class{constructor(e){this.partialObserver=e}next(e){let{partialObserver:t}=this;if(t.next)try{t.next(e)}catch(i){al(i)}}error(e){let{partialObserver:t}=this;if(t.error)try{t.error(e)}catch(i){al(i)}else al(e)}complete(){let{partialObserver:e}=this;if(e.complete)try{e.complete()}catch(t){al(t)}}},Js=class extends ts{constructor(e,t,i){super();let r;if(pn(e)||!e)r={next:e??void 0,error:t??void 0,complete:i??void 0};else{let s;this&&ri.useDeprecatedNextContext?(s=Object.create(e),s.unsubscribe=()=>this.unsubscribe(),r={next:e.next&&Kf(e.next,s),error:e.error&&Kf(e.error,s),complete:e.complete&&Kf(e.complete,s)}):r=e}this.destination=new eh(r)}};function al(n){ri.useDeprecatedSynchronousErrorHandling?Y_(n):j_(n)}function Cb(n){throw n}function Qf(n,e){let{onStoppedNotification:t}=ri;t&&Ys.setTimeout(()=>t(n,e))}var Ib={closed:!0,next:Zf,error:Cb,complete:Zf};var Z_=typeof Symbol=="function"&&Symbol.observable||"@@observable";function J_(n){return n}function K_(n){return n.length===0?J_:n.length===1?n[0]:function(t){return n.reduce((i,r)=>r(i),t)}}var xi=class n{constructor(e){e&&(this._subscribe=e)}lift(e){let t=new n;return t.source=this,t.operator=e,t}subscribe(e,t,i){let r=Db(e)?e:new Js(e,t,i);return Zs(()=>{let{operator:s,source:o}=this;r.add(s?s.call(r,o):o?this._subscribe(r):this._trySubscribe(r))}),r}_trySubscribe(e){try{return this._subscribe(e)}catch(t){e.error(t)}}forEach(e,t){return t=Q_(t),new t((i,r)=>{let s=new Js({next:o=>{try{e(o)}catch(a){r(a),s.unsubscribe()}},error:r,complete:i});this.subscribe(s)})}_subscribe(e){var t;return(t=this.source)===null||t===void 0?void 0:t.subscribe(e)}[Z_](){return this}pipe(...e){return K_(e)(this)}toPromise(e){return e=Q_(e),new e((t,i)=>{let r;this.subscribe(s=>r=s,s=>i(s),()=>t(r))})}};xi.create=n=>new xi(n);function Q_(n){var e;return(e=n??ri.Promise)!==null&&e!==void 0?e:Promise}function Ab(n){return n&&pn(n.next)&&pn(n.error)&&pn(n.complete)}function Db(n){return n&&n instanceof ts||Ab(n)&&ol(n)}function Rb(n){return pn(n?.lift)}function ev(n){return e=>{if(Rb(e))return e.lift(function(t){try{return n(t,this)}catch(i){this.error(i)}});throw new TypeError("Unable to lift unknown Observable type")}}function tv(n,e,t,i,r){return new th(n,e,t,i,r)}var th=class extends ts{constructor(e,t,i,r,s,o){super(e),this.onFinalize=s,this.shouldUnsubscribe=o,this._next=t?function(a){try{t(a)}catch(c){e.error(c)}}:super._next,this._error=r?function(a){try{r(a)}catch(c){e.error(c)}finally{this.unsubscribe()}}:super._error,this._complete=i?function(){try{i()}catch(a){e.error(a)}finally{this.unsubscribe()}}:super._complete}unsubscribe(){var e;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){let{closed:t}=this;super.unsubscribe(),!t&&((e=this.onFinalize)===null||e===void 0||e.call(this))}}};var nv=rl(n=>function(){n(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"});var $n=class extends xi{constructor(){super(),this.closed=!1,this.currentObservers=null,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(e){let t=new cl(this,this);return t.operator=e,t}_throwIfClosed(){if(this.closed)throw new nv}next(e){Zs(()=>{if(this._throwIfClosed(),!this.isStopped){this.currentObservers||(this.currentObservers=Array.from(this.observers));for(let t of this.currentObservers)t.next(e)}})}error(e){Zs(()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=e;let{observers:t}=this;for(;t.length;)t.shift().error(e)}})}complete(){Zs(()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;let{observers:e}=this;for(;e.length;)e.shift().complete()}})}unsubscribe(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null}get observed(){var e;return((e=this.observers)===null||e===void 0?void 0:e.length)>0}_trySubscribe(e){return this._throwIfClosed(),super._trySubscribe(e)}_subscribe(e){return this._throwIfClosed(),this._checkFinalizedStatuses(e),this._innerSubscribe(e)}_innerSubscribe(e){let{hasError:t,isStopped:i,observers:r}=this;return t||i?Yf:(this.currentObservers=null,r.push(e),new an(()=>{this.currentObservers=null,da(r,e)}))}_checkFinalizedStatuses(e){let{hasError:t,thrownError:i,isStopped:r}=this;t?e.error(i):r&&e.complete()}asObservable(){let e=new xi;return e.source=this,e}};$n.create=(n,e)=>new cl(n,e);var cl=class extends $n{constructor(e,t){super(),this.destination=e,this.source=t}next(e){var t,i;(i=(t=this.destination)===null||t===void 0?void 0:t.next)===null||i===void 0||i.call(t,e)}error(e){var t,i;(i=(t=this.destination)===null||t===void 0?void 0:t.error)===null||i===void 0||i.call(t,e)}complete(){var e,t;(t=(e=this.destination)===null||e===void 0?void 0:e.complete)===null||t===void 0||t.call(e)}_subscribe(e){var t,i;return(i=(t=this.source)===null||t===void 0?void 0:t.subscribe(e))!==null&&i!==void 0?i:Yf}};var fa=class extends $n{constructor(e){super(),this._value=e}get value(){return this.getValue()}_subscribe(e){let t=super._subscribe(e);return!t.closed&&e.next(this._value),t}getValue(){let{hasError:e,thrownError:t,_value:i}=this;if(e)throw t;return this._throwIfClosed(),i}next(e){super.next(this._value=e)}};function nh(n,e){return ev((t,i)=>{let r=0;t.subscribe(tv(i,s=>{i.next(n.call(e,s,r++))}))})}var We=class extends Error{code;constructor(e,t){super(yh(e,t)),this.code=e}};function Nb(n){return`NG0${Math.abs(n)}`}function yh(n,e){return`${Nb(n)}${e?": "+e:""}`}function ct(n){for(let e in n)if(n[e]===ct)return e;throw Error("")}function pl(n){if(typeof n=="string")return n;if(Array.isArray(n))return`[${n.map(pl).join(", ")}]`;if(n==null)return""+n;let e=n.overriddenName||n.name;if(e)return`${e}`;let t=n.toString();if(t==null)return""+t;let i=t.indexOf(`
`);return i>=0?t.slice(0,i):t}function xh(n,e){return n?e?`${n} ${e}`:n:e||""}var Pb=ct({__forward_ref__:ct});function ml(n){return n.__forward_ref__=ml,n}function An(n){return av(n)?n():n}function av(n){return typeof n=="function"&&Object.hasOwn(n,Pb)&&n.__forward_ref__===ml}function Jt(n){return{token:n.token,providedIn:n.providedIn||null,factory:n.factory,value:void 0}}function gl(n){return Ob(n,_l)}function Ob(n,e){return Object.hasOwn(n,e)&&n[e]||null}function Lb(n){let e=n?.[_l]??null;return e||null}function rh(n){return n&&Object.hasOwn(n,ul)?n[ul]:null}var _l=ct({\u0275prov:ct}),ul=ct({\u0275inj:ct}),Ke=class{_desc;ngMetadataName="InjectionToken";\u0275prov;constructor(e,t){this._desc=e,this.\u0275prov=void 0,typeof t=="number"?this.__NG_ELEMENT_ID__=t:t!==void 0&&(this.\u0275prov=Jt({token:this,providedIn:t.providedIn||"root",factory:t.factory}))}get multi(){return this}toString(){return`InjectionToken ${this._desc}`}};function Mh(n){return n&&!!n.\u0275providers}var Eh=ct({\u0275cmp:ct}),bh=ct({\u0275dir:ct}),Sh=ct({\u0275pipe:ct});var sh=ct({\u0275fac:ct}),ss=ct({__NG_ELEMENT_ID__:ct}),iv=ct({__NG_ENV_ID__:ct});function os(n){return wh(n,"@Component"),n[Eh]||null}function vl(n){return wh(n,"@Directive"),n[bh]||null}function cv(n){return wh(n,"@Pipe"),n[Sh]||null}function wh(n,e){if(n==null)throw new We(-919,!1)}function Th(n){return typeof n=="string"?n:n==null?"":String(n)}var lv=ct({ngErrorCode:ct}),Fb=ct({ngErrorMessage:ct}),kb=ct({ngTokenPath:ct});function Ch(n,e){return uv("",-200,e)}function yl(n,e){throw new We(-201,!1)}function uv(n,e,t){let i=new We(e,n);return i[lv]=e,i[Fb]=n,t&&(i[kb]=t),i}function Bb(n){return n[lv]}var oh;function dv(){return oh}function In(n){let e=oh;return oh=n,e}function Ih(n,e,t){let i=gl(n);if(i&&i.providedIn=="root")return i.value===void 0?i.value=i.factory():i.value;if(t&8)return null;if(e!==void 0)return e;yl(n,"")}var Ub={},ns=Ub,Vb="__NG_DI_FLAG__",ah=class{injector;constructor(e){this.injector=e}retrieve(e,t){let i=is(t)||0;try{return this.injector.get(e,i&8?null:ns,i)}catch(r){if(Xs(r))return r;throw r}}};function Hb(n,e=0){let t=il();if(t===void 0)throw new We(-203,!1);if(t===null)return Ih(n,void 0,e);{let i=zb(e),r=t.retrieve(n,i);if(Xs(r)){if(i.optional)return null;throw r}return r}}function it(n,e=0){return(dv()||Hb)(An(n),e)}function mt(n,e){return it(n,is(e))}function is(n){return typeof n>"u"||typeof n=="number"?n:0|(n.optional&&8)|(n.host&&1)|(n.self&&2)|(n.skipSelf&&4)}function zb(n){return{optional:!!(n&8),host:!!(n&1),self:!!(n&2),skipSelf:!!(n&4)}}function ch(n){let e=[];for(let t=0;t<n.length;t++){let i=An(n[t]);if(Array.isArray(i)){if(i.length===0)throw new We(900,!1);let r,s=0;for(let o=0;o<i.length;o++){let a=i[o],c=Gb(a);typeof c=="number"?c===-1?r=a.token:s|=c:r=a}e.push(it(r,s))}else e.push(it(i))}return e}function Gb(n){return n[Vb]}function Qs(n,e){let t=Object.hasOwn(n,sh);return t?n[sh]:null}function fv(n,e,t){if(n.length!==e.length)return!1;for(let i=0;i<n.length;i++){let r=n[i],s=e[i];if(t&&(r=t(r),s=t(s)),s!==r)return!1}return!0}function hv(n){return n.flat(Number.POSITIVE_INFINITY)}function xl(n,e){n.forEach(t=>Array.isArray(t)?xl(t,e):e(t))}function Ah(n,e,t){e>=n.length?n.push(t):n.splice(e,0,t)}function ga(n,e){return e>=n.length-1?n.pop():n.splice(e,1)[0]}function pv(n,e,t,i){let r=n.length;if(r==e)n.push(t,i);else if(r===1)n.push(i,n[0]),n[0]=t;else{for(r--,n.push(n[r-1],n[r]);r>e;){let s=r-2;n[r]=n[s],r--}n[e]=t,n[e+1]=i}}function mv(n,e,t){let i=io(n,e);return i>=0?n[i|1]=t:(i=~i,pv(n,i,e,t)),i}function Ml(n,e){let t=io(n,e);if(t>=0)return n[t|1]}function io(n,e){return Wb(n,e,1)}function Wb(n,e,t){let i=0,r=n.length>>t;for(;r!==i;){let s=i+(r-i>>1),o=n[s<<t];if(e===o)return s<<t;o>e?r=s:i=s+1}return~(r<<t)}var El={},_r=[],_a=new Ke(""),Dh=new Ke("",-1),Rh=new Ke(""),eo=class{get(e,t=ns){if(t===ns){let r=uv("",-201);throw r.name="\u0275NotFound",r}return t}};function gv(...n){return{\u0275providers:Nh(!0,n),\u0275fromNgModule:!0}}function Nh(n,...e){let t=[],i=new Set,r,s=o=>{t.push(o)};return xl(e,o=>{let a=o;dl(a,s,[],i)&&(r||=[],r.push(a))}),r!==void 0&&_v(r,s),t}function _v(n,e){for(let t=0;t<n.length;t++){let{ngModule:i,providers:r}=n[t];Ph(r,s=>{e(s,i)})}}function dl(n,e,t,i){if(n=An(n),!n)return!1;let r=null,s=rh(n),o=!s&&os(n);if(!s&&!o){let c=n.ngModule;if(s=rh(c),s)r=c;else return!1}else{if(o&&!o.standalone)return!1;r=n}let a=i.has(r);if(o){if(a)return!1;if(i.add(r),o.dependencies){let c=typeof o.dependencies=="function"?o.dependencies():o.dependencies;for(let l of c)dl(l,e,t,i)}}else if(s){if(s.imports!=null&&!a){i.add(r);let l;xl(s.imports,u=>{dl(u,e,t,i)&&(l||=[],l.push(u))}),l!==void 0&&_v(l,e)}if(!a){let l=Qs(r)||(()=>new r);e({provide:r,useFactory:l,deps:_r},r),e({provide:Rh,useValue:r,multi:!0},r),e({provide:_a,useValue:()=>it(r),multi:!0},r)}let c=s.providers;if(c!=null&&!a){let l=n;Ph(c,u=>{e(u,l)})}}else return!1;return r!==n&&n.providers!==void 0}function Ph(n,e){for(let t of n)Mh(t)&&(t=t.\u0275providers),Array.isArray(t)?Ph(t,e):e(t)}var jb=ct({provide:String,useValue:ct});function vv(n){return n!==null&&typeof n=="object"&&jb in n}function $b(n){return!!(n&&n.useExisting)}function qb(n){return!!(n&&n.useFactory)}function fl(n){return typeof n=="function"}var va=new Ke(""),ll={},rv={},ih;function ya(){return ih===void 0&&(ih=new eo),ih}var si=class{},rs=class extends si{parent;source;scopes;records=new Map;_ngOnDestroyHooks=new Set;_onDestroyHooks=[];get destroyed(){return this._destroyed}_destroyed=!1;injectorDefTypes;constructor(e,t,i,r){super(),this.parent=t,this.source=i,this.scopes=r,uh(e,o=>this.processProvider(o)),this.records.set(Dh,Ks(void 0,this)),r.has("environment")&&this.records.set(si,Ks(void 0,this));let s=this.records.get(va);s!=null&&typeof s.value=="string"&&this.scopes.add(s.value),this.injectorDefTypes=new Set(this.get(Rh,_r,{self:!0}))}retrieve(e,t){let i=is(t)||0;try{return this.get(e,ns,i)}catch(r){if(Xs(r))return r;throw r}}destroy(){ha(this),this._destroyed=!0;let e=we(null);try{for(let i of this._ngOnDestroyHooks)i.ngOnDestroy();let t=this._onDestroyHooks;this._onDestroyHooks=[];for(let i of t)i()}finally{this.records.clear(),this._ngOnDestroyHooks.clear(),this.injectorDefTypes.clear(),we(e)}}onDestroy(e){return ha(this),this._onDestroyHooks.push(e),()=>this.removeOnDestroy(e)}runInContext(e){ha(this);let t=yi(this),i=In(void 0),r;try{return e()}finally{yi(t),In(i)}}get(e,t=ns,i){if(ha(this),Object.hasOwn(e,iv))return e[iv](this);let r=is(i),s,o=yi(this),a=In(void 0);try{if(!(r&4)){let l=this.records.get(e);if(l===void 0){let u=Kb(e)&&gl(e);u&&this.injectableDefInScope(u)?l=Ks(lh(e),ll):l=null,this.records.set(e,l)}if(l!=null)return this.hydrate(e,l,r)}let c=r&2?ya():this.parent;return t=r&8&&t===ns?null:t,c.get(e,t)}catch(c){let l=Bb(c);throw l===-200||l===-201?new We(l,null):c}finally{In(a),yi(o)}}resolveInjectorInitializers(){let e=we(null),t=yi(this),i=In(void 0),r;try{let s=this.get(_a,_r,{self:!0});for(let o of s)o()}finally{yi(t),In(i),we(e)}}toString(){return"R3Injector[...]"}processProvider(e){e=An(e);let t=fl(e)?e:An(e&&e.provide),i=Yb(e);if(!fl(e)&&e.multi===!0){let r=this.records.get(t);r||(r=Ks(void 0,ll,!0),r.factory=()=>ch(r.multi),this.records.set(t,r)),t=e,r.multi.push(e)}this.records.set(t,i)}hydrate(e,t,i){let r=we(null);try{if(t.value===rv)throw Ch("");return t.value===ll&&(t.value=rv,t.value=t.factory(void 0,i)),typeof t.value=="object"&&t.value&&Jb(t.value)&&this._ngOnDestroyHooks.add(t.value),t.value}finally{we(r)}}injectableDefInScope(e){if(!e.providedIn)return!1;let t=An(e.providedIn);return typeof t=="string"?t==="any"||this.scopes.has(t):this.injectorDefTypes.has(t)}removeOnDestroy(e){let t=this._onDestroyHooks.indexOf(e);t!==-1&&this._onDestroyHooks.splice(t,1)}};function lh(n){let e=gl(n),t=e!==null?e.factory:Qs(n);if(t!==null)return t;if(n instanceof Ke)throw new We(-204,!1);if(n instanceof Function)return Xb(n);throw new We(-204,!1)}function Xb(n){if(n.length>0)throw new We(-204,!1);let t=Lb(n);return t!==null?()=>t.factory(n):()=>new n}function Yb(n){if(vv(n))return Ks(void 0,n.useValue);{let e=yv(n);return Ks(e,ll)}}function yv(n,e,t){let i;if(fl(n)){let r=An(n);return Qs(r)||lh(r)}else if(vv(n))i=()=>An(n.useValue);else if(qb(n))i=()=>n.useFactory(...ch(n.deps||[]));else if($b(n))i=(r,s)=>it(An(n.useExisting),s!==void 0&&s&8?8:void 0);else{let r=An(n&&(n.useClass||n.provide));if(Zb(n))i=()=>new r(...ch(n.deps));else return Qs(r)||lh(r)}return i}function ha(n){if(n.destroyed)throw new We(-205,!1)}function Ks(n,e,t=!1){return{factory:n,value:e,multi:t?[]:void 0}}function Zb(n){return!!n.deps}function Jb(n){return n!==null&&typeof n=="object"&&typeof n.ngOnDestroy=="function"}function Kb(n){return typeof n=="function"||typeof n=="object"&&n.ngMetadataName==="InjectionToken"}function uh(n,e){for(let t of n)Array.isArray(t)?uh(t,e):t&&Mh(t)?uh(t.\u0275providers,e):e(t)}function bl(n,e){let t;n instanceof rs?(ha(n),t=n):t=new ah(n);let i,r=yi(t),s=In(void 0);try{return e()}finally{yi(r),In(s)}}function xv(){return dv()!==void 0||il()!=null}var oi=0,Te=1,Ne=2,Ot=3,qn=4,mn=5,ro=6,so=7,Ct=8,qi=9,Mi=10,Ft=11,oo=12,Oh=13,vr=14,Rn=15,yr=16,as=17,Ei=18,xa=19,Lh=20,Gi=21,Sl=22,ao=23,Nn=24,wl=25,Mv=26,Ma=27,jt=28,Ev=1,Fh=6,cs=7,Ea=8,ls=9,It=10;function xr(n){return Array.isArray(n)&&typeof n[Ev]=="object"}function Xn(n){return Array.isArray(n)&&n[Ev]===!0}function kh(n){return(n.flags&4)!==0}function Mr(n){return n.componentOffset>-1}function Tl(n){return(n.flags&1)===1}function us(n){return!!n.template}function co(n){return(n[Ne]&512)!==0}function ds(n){return(n[Ne]&256)===256}var bv="svg",Sv="math";function $t(n){for(;Array.isArray(n);)n=n[oi];return n}function Bh(n,e){return $t(e[n])}function ai(n,e){return $t(e[n.index])}function Cl(n,e){return n.data[e]}function bi(n,e){let t=e[n];return xr(t)?t:t[oi]}function wv(n){return(n[Ne]&4)===4}function Il(n){return(n[Ne]&128)===128}function Tv(n){return Xn(n[Ot])}function Si(n,e){return e==null?null:n[e]}function Uh(n){n[as]=0}function Vh(n){n[Ne]&1024||(n[Ne]|=1024,Il(n)&&Sa(n))}function Cv(n,e){for(;n>0;)e=e[vr],n--;return e}function ba(n){return!!(n[Ne]&9216||n[Nn]?.dirty)}function Al(n){n[Mi].changeDetectionScheduler?.notify(8),n[Ne]&64&&(n[Ne]|=1024),ba(n)&&Sa(n)}function Sa(n){n[Mi].changeDetectionScheduler?.notify(0);let e=Wi(n);for(;e!==null&&!(e[Ne]&8192||(e[Ne]|=8192,!Il(e)));)e=Wi(e)}function Dl(n,e){if(ds(n))throw new We(911,!1);n[Gi]===null&&(n[Gi]=[]),n[Gi].push(e)}function Iv(n,e){if(n[Gi]===null)return;let t=n[Gi].indexOf(e);t!==-1&&n[Gi].splice(t,1)}function Wi(n){let e=n[Ot];return Xn(e)?e[Ot]:e}function Hh(n){return n[so]??=[]}function zh(n){return n.cleanup??=[]}function Av(n,e,t,i){let r=Hh(e);r.push(t),n.firstCreatePass&&zh(n).push(i,r.length-1)}var ze={lFrame:Gv(null),bindingsEnabled:!0,skipHydrationRootTNode:null};var dh=!1;function Dv(){return ze.lFrame.elementDepthCount}function Rv(){ze.lFrame.elementDepthCount++}function Gh(){ze.lFrame.elementDepthCount--}function Nv(){return ze.bindingsEnabled}function Pv(){return ze.skipHydrationRootTNode!==null}function Wh(n){return ze.skipHydrationRootTNode===n}function jh(){ze.skipHydrationRootTNode=null}function rt(){return ze.lFrame.lView}function Pn(){return ze.lFrame.tView}function Er(n){return ze.lFrame.contextLView=n,n[Ct]}function br(n){return ze.lFrame.contextLView=null,n}function wi(){let n=$h();for(;n!==null&&n.type===64;)n=n.parent;return n}function $h(){return ze.lFrame.currentTNode}function Ov(){let n=ze.lFrame,e=n.currentTNode;return n.isParent?e:e.parent}function lo(n,e){let t=ze.lFrame;t.currentTNode=n,t.isParent=e}function qh(){return ze.lFrame.isParent}function Lv(){ze.lFrame.isParent=!1}function Xh(){return dh}function Yh(n){let e=dh;return dh=n,e}function Fv(n){return ze.lFrame.bindingIndex=n}function uo(){return ze.lFrame.bindingIndex++}function kv(n){let e=ze.lFrame,t=e.bindingIndex;return e.bindingIndex=e.bindingIndex+n,t}function Bv(){return ze.lFrame.inI18n}function Uv(n,e){let t=ze.lFrame;t.bindingIndex=t.bindingRootIndex=n,Rl(e)}function Vv(){return ze.lFrame.currentDirectiveIndex}function Rl(n){ze.lFrame.currentDirectiveIndex=n}function Hv(n){let e=ze.lFrame.currentDirectiveIndex;return e===-1?null:n[e]}function Zh(){return ze.lFrame.currentQueryIndex}function Nl(n){ze.lFrame.currentQueryIndex=n}function Qb(n){let e=n[Te];return e.type===2?e.declTNode:e.type===1?n[mn]:null}function Jh(n,e,t){if(t&4){let r=e,s=n;for(;r=r.parent,r===null&&!(t&1);)if(r=Qb(s),r===null||(s=s[vr],r.type&10))break;if(r===null)return!1;e=r,n=s}let i=ze.lFrame=zv();return i.currentTNode=e,i.lView=n,!0}function Pl(n){let e=zv(),t=n[Te];ze.lFrame=e,e.currentTNode=t.firstChild,e.lView=n,e.tView=t,e.contextLView=n,e.bindingIndex=t.bindingStartIndex,e.inI18n=!1}function zv(){let n=ze.lFrame,e=n===null?null:n.child;return e===null?Gv(n):e}function Gv(n){let e={currentTNode:null,isParent:!0,lView:null,tView:null,selectedIndex:-1,contextLView:null,elementDepthCount:0,currentNamespace:null,currentDirectiveIndex:-1,bindingRootIndex:-1,bindingIndex:-1,currentQueryIndex:0,parent:n,child:null,inI18n:!1};return n!==null&&(n.child=e),e}function Wv(){let n=ze.lFrame;return ze.lFrame=n.parent,n.currentTNode=null,n.lView=null,n}var Kh=Wv;function Ol(){let n=Wv();n.isParent=!0,n.tView=null,n.selectedIndex=-1,n.contextLView=null,n.elementDepthCount=0,n.currentDirectiveIndex=-1,n.currentNamespace=null,n.bindingRootIndex=-1,n.bindingIndex=-1,n.currentQueryIndex=0}function jv(n){return(ze.lFrame.contextLView=Cv(n,ze.lFrame.contextLView))[Ct]}function Sr(){return ze.lFrame.selectedIndex}function wr(n){ze.lFrame.selectedIndex=n}function Qh(){let n=ze.lFrame;return Cl(n.tView,n.selectedIndex)}function ep(){return ze.lFrame.currentNamespace}var $v=!0;function Ll(){return $v}function Fl(n){$v=n}function fh(n,e=null,t=null,i){let r=qv(n,e,t,i);return r.resolveInjectorInitializers(),r}function qv(n,e=null,t=null,i,r=new Set){let s=[t||_r,gv(n)],o;return new rs(s,e||ya(),o||null,r)}var ji=class n{static THROW_IF_NOT_FOUND=ns;static NULL=new eo;static create(e,t){if(Array.isArray(e))return fh({name:""},t,e,"");{let i=e.name??"";return fh({name:i},e.parent,e.providers,i)}}static \u0275prov=Jt({token:n,providedIn:"any",factory:()=>it(Dh)});static __NG_ELEMENT_ID__=-1},Yn=new Ke(""),to=class{static __NG_ELEMENT_ID__=eS;static __NG_ENV_ID__=e=>e},hh=class extends to{_lView;constructor(e){super(),this._lView=e}get destroyed(){return ds(this._lView)}onDestroy(e){let t=this._lView;return Dl(t,e),()=>Iv(t,e)}};function eS(){return new hh(rt())}var Xv=!1,Yv=new Ke(""),fo=(()=>{class n{taskId=0;pendingTasks=new Set;destroyed=!1;pendingTask=new fa(!1);debugTaskTracker=mt(Yv,{optional:!0});get hasPendingTasks(){return this.destroyed?!1:this.pendingTask.value}get hasPendingTasksObservable(){return this.destroyed?new xi(t=>{t.next(!1),t.complete()}):this.pendingTask}add(){!this.hasPendingTasks&&!this.destroyed&&this.pendingTask.next(!0);let t=this.taskId++;return this.pendingTasks.add(t),this.debugTaskTracker?.add(t),t}has(t){return this.pendingTasks.has(t)}remove(t){this.pendingTasks.delete(t),this.debugTaskTracker?.remove(t),this.pendingTasks.size===0&&this.hasPendingTasks&&this.pendingTask.next(!1)}ngOnDestroy(){this.pendingTasks.clear(),this.hasPendingTasks&&this.pendingTask.next(!1),this.destroyed=!0,this.pendingTask.unsubscribe()}static \u0275prov=Jt({token:n,providedIn:"root",factory:()=>new n})}return n})(),ph=class extends $n{__isAsync;destroyRef=void 0;pendingTasks=void 0;constructor(e=!1){super(),this.__isAsync=e,xv()&&(this.destroyRef=mt(to,{optional:!0})??void 0,this.pendingTasks=mt(fo,{optional:!0})??void 0)}emit(e){let t=we(null);try{super.next(e)}finally{we(t)}}subscribe(e,t,i){let r=e,s=t||(()=>null),o=i;if(e&&typeof e=="object"){let c=e;r=c.next?.bind(c),s=c.error?.bind(c),o=c.complete?.bind(c)}this.__isAsync&&(s=this.wrapInTimeout(s),r&&(r=this.wrapInTimeout(r)),o&&(o=this.wrapInTimeout(o)));let a=super.subscribe({next:r,error:s,complete:o});return e instanceof an&&e.add(a),a}wrapInTimeout(e){return t=>{let i=this.pendingTasks?.add();setTimeout(()=>{try{e(t)}finally{i!==void 0&&this.pendingTasks?.remove(i)}})}}},zi=ph;function hl(...n){}function tp(n){let e,t;function i(){n=hl;try{t!==void 0&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(t),e!==void 0&&clearTimeout(e)}catch{}}return e=setTimeout(()=>{n(),i()}),typeof requestAnimationFrame=="function"&&(t=requestAnimationFrame(()=>{n(),i()})),()=>i()}function Zv(n){return queueMicrotask(()=>n()),()=>{n=hl}}var np="isAngularZone",pa=np+"_ID",tS=0,Dn=class n{hasPendingMacrotasks=!1;hasPendingMicrotasks=!1;isStable=!0;onUnstable=new zi(!1);onMicrotaskEmpty=new zi(!1);onStable=new zi(!1);onError=new zi(!1);constructor(e){let{enableLongStackTrace:t=!1,shouldCoalesceEventChangeDetection:i=!1,shouldCoalesceRunChangeDetection:r=!1,scheduleInRootZone:s=Xv}=e;if(typeof Zone>"u")throw new We(908,!1);Zone.assertZonePatched();let o=this;o._nesting=0,o._outer=o._inner=Zone.current,Zone.TaskTrackingZoneSpec&&(o._inner=o._inner.fork(new Zone.TaskTrackingZoneSpec)),t&&Zone.longStackTraceZoneSpec&&(o._inner=o._inner.fork(Zone.longStackTraceZoneSpec)),o.shouldCoalesceEventChangeDetection=!r&&i,o.shouldCoalesceRunChangeDetection=r,o.callbackScheduled=!1,o.scheduleInRootZone=s,rS(o)}static isInAngularZone(){return typeof Zone<"u"&&Zone.current.get(np)===!0}static assertInAngularZone(){if(!n.isInAngularZone())throw new We(909,!1)}static assertNotInAngularZone(){if(n.isInAngularZone())throw new We(909,!1)}run(e,t,i){return this._inner.run(e,t,i)}runTask(e,t,i,r){let s=this._inner,o=s.scheduleEventTask("NgZoneEvent: "+r,e,nS,hl,hl);try{return s.runTask(o,t,i)}finally{s.cancelTask(o)}}runGuarded(e,t,i){return this._inner.runGuarded(e,t,i)}runOutsideAngular(e){return this._outer.run(e)}},nS={};function ip(n){if(n._nesting==0&&!n.hasPendingMicrotasks&&!n.isStable)try{n._nesting++,n.onMicrotaskEmpty.emit(null)}finally{if(n._nesting--,!n.hasPendingMicrotasks)try{n.runOutsideAngular(()=>n.onStable.emit(null))}finally{n.isStable=!0}}}function iS(n){if(n.isCheckStableRunning||n.callbackScheduled)return;n.callbackScheduled=!0;function e(){tp(()=>{n.callbackScheduled=!1,mh(n),n.isCheckStableRunning=!0,ip(n),n.isCheckStableRunning=!1})}n.scheduleInRootZone?Zone.root.run(()=>{e()}):n._outer.run(()=>{e()}),mh(n)}function rS(n){let e=()=>{iS(n)},t=tS++;n._inner=n._inner.fork({name:"angular",properties:{[np]:!0,[pa]:t,[pa+t]:!0},onInvokeTask:(i,r,s,o,a,c)=>{if(sS(c))return i.invokeTask(s,o,a,c);try{return sv(n),i.invokeTask(s,o,a,c)}finally{(n.shouldCoalesceEventChangeDetection&&o.type==="eventTask"||n.shouldCoalesceRunChangeDetection)&&e(),ov(n)}},onInvoke:(i,r,s,o,a,c,l)=>{try{return sv(n),i.invoke(s,o,a,c,l)}finally{n.shouldCoalesceRunChangeDetection&&!n.callbackScheduled&&!oS(c)&&e(),ov(n)}},onHasTask:(i,r,s,o)=>{i.hasTask(s,o),r===s&&(o.change=="microTask"?(n._hasPendingMicrotasks=o.microTask,mh(n),ip(n)):o.change=="macroTask"&&(n.hasPendingMacrotasks=o.macroTask))},onHandleError:(i,r,s,o)=>(i.handleError(s,o),n.runOutsideAngular(()=>n.onError.emit(o)),!1)})}function mh(n){n._hasPendingMicrotasks||(n.shouldCoalesceEventChangeDetection||n.shouldCoalesceRunChangeDetection)&&n.callbackScheduled===!0?n.hasPendingMicrotasks=!0:n.hasPendingMicrotasks=!1}function sv(n){n._nesting++,n.isStable&&(n.isStable=!1,n.onUnstable.emit(null))}function ov(n){n._nesting--,ip(n)}var ma=class{hasPendingMicrotasks=!1;hasPendingMacrotasks=!1;isStable=!0;onUnstable=new zi;onMicrotaskEmpty=new zi;onStable=new zi;onError=new zi;run(e,t,i){return e.apply(t,i)}runGuarded(e,t,i){return e.apply(t,i)}runOutsideAngular(e){return e()}runTask(e,t,i,r){return e.apply(t,i)}};function sS(n){return Jv(n,"__ignore_ng_zone__")}function oS(n){return Jv(n,"__scheduler_tick__")}function Jv(n,e){return!Array.isArray(n)||n.length!==1?!1:n[0]?.data?.[e]===!0}var $i=class{_console=console;handleError(e){this._console.error("ERROR",e)}};function Kv(n){return aS(n)?n:new gh(n)}function aS(n){return n instanceof Error||typeof n=="object"&&n!==null&&typeof n.name=="string"&&typeof n.message=="string"}var gh=class extends Error{constructor(e){super(String(e),{cause:e}),this.name="ErrorBoundaryWrappedError"}},ho=new Ke("",{factory:()=>{let n=mt(Dn),e=mt(si),t;return i=>{n.runOutsideAngular(()=>{e.destroyed&&!t?setTimeout(()=>{throw i}):(t??=e.get($i),t.handleError(i))})}}}),Qv={provide:_a,useValue:()=>{let n=mt($i,{optional:!0})},multi:!0};function Zn(n,e){let[t,i,r]=$f(n,e?.equal),s=t,o=s[jn];return s.set=i,s.update=r,s.asReadonly=ey.bind(s),s}function ey(){let n=this[jn];if(n.readonlyFn===void 0){let e=()=>this();e[jn]=n,n.readonlyFn=e}return n.readonlyFn}var wa=new Ke("",{factory:()=>cS}),cS="ng";var kl=new Ke(""),Ta=new Ke("",{providedIn:"platform",factory:()=>"unknown"});var Bl=new Ke("",{factory:()=>mt(Yn).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce")||null});var no=class{},Ca=new Ke("",{factory:()=>!0});var rp=new Ke(""),sp=(()=>{class n{static \u0275prov=Jt({token:n,providedIn:"root",factory:()=>new _h})}return n})(),_h=class{dirtyEffectCount=0;queues=new Map;add(e){this.enqueue(e),this.schedule(e)}schedule(e){e.dirty&&this.dirtyEffectCount++}remove(e){let t=e.zone,i=this.queues.get(t);i.has(e)&&(i.delete(e),e.dirty&&this.dirtyEffectCount--)}enqueue(e){let t=e.zone;this.queues.has(t)||this.queues.set(t,new Set);let i=this.queues.get(t);i.has(e)||i.add(e)}flush(){for(;this.dirtyEffectCount>0;){let e=!1;for(let[t,i]of this.queues)t===null?e||=this.flushQueue(i):e||=t.run(()=>this.flushQueue(i));e||(this.dirtyEffectCount=0)}}flushQueue(e){let t=!1;for(let i of e)i.dirty&&(this.dirtyEffectCount--,t=!0,i.run());return t}},vh=class{[jn];constructor(e){this[jn]=e}destroy(){this[jn].destroy()}};function Ny(n){return{toString:n}.toString()}var tt=(function(n){return n[n.TemplateCreateStart=0]="TemplateCreateStart",n[n.TemplateCreateEnd=1]="TemplateCreateEnd",n[n.TemplateUpdateStart=2]="TemplateUpdateStart",n[n.TemplateUpdateEnd=3]="TemplateUpdateEnd",n[n.LifecycleHookStart=4]="LifecycleHookStart",n[n.LifecycleHookEnd=5]="LifecycleHookEnd",n[n.OutputStart=6]="OutputStart",n[n.OutputEnd=7]="OutputEnd",n[n.BootstrapApplicationStart=8]="BootstrapApplicationStart",n[n.BootstrapApplicationEnd=9]="BootstrapApplicationEnd",n[n.BootstrapComponentStart=10]="BootstrapComponentStart",n[n.BootstrapComponentEnd=11]="BootstrapComponentEnd",n[n.ChangeDetectionStart=12]="ChangeDetectionStart",n[n.ChangeDetectionEnd=13]="ChangeDetectionEnd",n[n.ChangeDetectionSyncStart=14]="ChangeDetectionSyncStart",n[n.ChangeDetectionSyncEnd=15]="ChangeDetectionSyncEnd",n[n.AfterRenderHooksStart=16]="AfterRenderHooksStart",n[n.AfterRenderHooksEnd=17]="AfterRenderHooksEnd",n[n.ComponentStart=18]="ComponentStart",n[n.ComponentEnd=19]="ComponentEnd",n[n.DeferBlockStateStart=20]="DeferBlockStateStart",n[n.DeferBlockStateEnd=21]="DeferBlockStateEnd",n[n.DynamicComponentStart=22]="DynamicComponentStart",n[n.DynamicComponentEnd=23]="DynamicComponentEnd",n[n.HostBindingsUpdateStart=24]="HostBindingsUpdateStart",n[n.HostBindingsUpdateEnd=25]="HostBindingsUpdateEnd",n})(tt||{});function DS(n,e,t,i){e!==null?e.applyValueToInputSignal(e,i):n[t]=i}var RS=null;function NS(){return RS}var ty=[];var lt=function(n,e=null,t){for(let i=0;i<ty.length;i++){let r=ty[i];r(n,e,t)}};function PS(n,e,t){let{ngOnChanges:i,ngOnInit:r,ngDoCheck:s}=e.type.prototype;if(i){let o=NS()(e);(t.preOrderHooks??=[]).push(n,o),(t.preOrderCheckHooks??=[]).push(n,o)}r&&(t.preOrderHooks??=[]).push(0-n,r),s&&((t.preOrderHooks??=[]).push(n,s),(t.preOrderCheckHooks??=[]).push(n,s))}function OS(n,e){for(let t=e.directiveStart,i=e.directiveEnd;t<i;t++){let s=n.data[t].type.prototype,{ngAfterContentInit:o,ngAfterContentChecked:a,ngAfterViewInit:c,ngAfterViewChecked:l,ngOnDestroy:u}=s;o&&(n.contentHooks??=[]).push(-t,o),a&&((n.contentHooks??=[]).push(t,a),(n.contentCheckHooks??=[]).push(t,a)),c&&(n.viewHooks??=[]).push(-t,c),l&&((n.viewHooks??=[]).push(t,l),(n.viewCheckHooks??=[]).push(t,l)),u!=null&&(n.destroyHooks??=[]).push(t,u)}}function Vl(n,e,t){Py(n,e,3,t)}function Hl(n,e,t,i){(n[Ne]&3)===t&&Py(n,e,t,i)}function op(n,e){let t=n[Ne];(t&3)===e&&(t&=16383,t+=1,n[Ne]=t)}function Py(n,e,t,i){let r=i!==void 0?n[as]&65535:0,s=i??-1,o=e.length-1,a=0;for(let c=r;c<o;c++)if(typeof e[c+1]=="number"){if(a=e[c],i!=null&&a>=i)break}else e[c]<0&&(n[as]+=65536),(a<s||s==-1)&&(LS(n,t,e,c),n[as]=(n[as]&4294901760)+c+2),c++}function ny(n,e){lt(tt.LifecycleHookStart,n,e);let t=we(null);try{e.call(n)}finally{we(t),lt(tt.LifecycleHookEnd,n,e)}}function LS(n,e,t,i){let r=t[i]<0,s=t[i+1],o=r?-t[i]:t[i],a=n[o];r?n[Ne]>>14<n[as]>>16&&(n[Ne]&3)===e&&(n[Ne]+=16384,ny(a,s)):ny(a,s)}var go=-1,Da=class{factory;name;injectImpl;resolving=!1;canSeeViewProviders;multi;componentProviders;index;providerFactory;constructor(e,t,i,r){this.factory=e,this.name=r,this.canSeeViewProviders=t,this.injectImpl=i}};function FS(n){return(n.flags&8)!==0}function kS(n){return(n.flags&16)!==0}function BS(n,e,t){let i=0;for(;i<t.length;){let r=t[i];if(typeof r=="number"){if(r!==0)break;i++;let s=t[i++],o=t[i++],a=t[i++];n.setAttribute(e,o,a,s)}else{let s=r,o=t[++i];VS(s)?n.setProperty(e,s,o):n.setAttribute(e,s,o),i++}}return i}function US(n){return n===3||n===4||n===6}function VS(n){return n.charCodeAt(0)===64}function iu(n,e){if(!(e===null||e.length===0))if(n===null||n.length===0)n=e.slice();else{let t=-1;for(let i=0;i<e.length;i++){let r=e[i];typeof r=="number"?t=r:t===0||(t===-1||t===2?iy(n,t,r,null,e[++i]):iy(n,t,r,null,null))}}return n}function iy(n,e,t,i,r){let s=0,o=n.length;if(e===-1)o=-1;else for(;s<n.length;){let a=n[s++];if(typeof a=="number"){if(a===e){o=-1;break}else if(a>e){o=s-1;break}}}for(;s<n.length;){let a=n[s];if(typeof a=="number")break;if(a===t){r!==null&&(n[s+1]=r);return}s++,r!==null&&s++}o!==-1&&(n.splice(o,0,e),s=o+1),n.splice(s++,0,t),r!==null&&n.splice(s++,0,r)}function Oy(n){return n!==go}function Wl(n){return n&32767}function HS(n){return n>>16}function jl(n,e){let t=HS(n),i=e;for(;t>0;)i=i[vr],t--;return i}var pp=!0;function ry(n){let e=pp;return pp=n,e}var zS=256,Ly=zS-1,Fy=5,GS=0,Ti={};function WS(n,e,t){let i;typeof t=="string"?i=t.charCodeAt(0)||0:Object.hasOwn(t,ss)&&(i=t[ss]),i==null&&(i=t[ss]=GS++);let r=i&Ly,s=1<<r;e.data[n+(r>>Fy)]|=s}function ky(n,e){let t=By(n,e);if(t!==-1)return t;let i=e[Te];i.firstCreatePass&&(n.injectorIndex=e.length,ap(i.data,n),ap(e,null),ap(i.blueprint,null));let r=Hp(n,e),s=n.injectorIndex;if(Oy(r)){let o=Wl(r),a=jl(r,e),c=a[Te].data;for(let l=0;l<8;l++)e[s+l]=a[o+l]|c[o+l]}return e[s+8]=r,s}function ap(n,e){n.push(0,0,0,0,0,0,0,0,e)}function By(n,e){return n.injectorIndex===-1||n.parent&&n.parent.injectorIndex===n.injectorIndex||e[n.injectorIndex+8]===null?-1:n.injectorIndex}function Hp(n,e){if(n.parent&&n.parent.injectorIndex!==-1)return n.parent.injectorIndex;let t=0,i=null,r=e;for(;r!==null;){if(i=Gy(r),i===null)return go;if(t++,r=r[vr],i.injectorIndex!==-1)return i.injectorIndex|t<<16}return go}function jS(n,e,t){WS(n,e,t)}function Uy(n,e,t){if(t&8||n!==void 0)return n;yl(e,"NodeInjector")}function Vy(n,e,t,i){if(t&8&&i===void 0&&(i=null),(t&3)===0){let r=n[qi],s=In(void 0);try{return r?r.get(e,i,t&8):Ih(e,i,t&8)}finally{In(s)}}return Uy(i,e,t)}function Hy(n,e,t,i=0,r){if(n!==null){if(e[Ne]&2048&&!(i&2)){let o=YS(n,e,t,i,Ti);if(o!==Ti)return o}let s=zy(n,e,t,i,Ti);if(s!==Ti)return s}return Vy(e,t,i,r)}function zy(n,e,t,i,r){let s=qS(t);if(typeof s=="function"){if(!Jh(e,n,i))return i&1?Uy(r,t,i):Vy(e,t,i,r);try{let o;if(o=s(i),o==null&&!(i&8))yl(t);else return o}finally{Kh()}}else if(typeof s=="number"){let o=null,a=By(n,e),c=go,l=i&1?e[Rn][mn]:null;for((a===-1||i&4)&&(c=a===-1?Hp(n,e):e[a+8],c===go||!oy(i,!1)?a=-1:(o=e[Te],a=Wl(c),e=jl(c,e)));a!==-1;){let u=e[Te];if(sy(s,a,u.data)){let d=$S(a,e,t,o,i,l);if(d!==Ti)return d}c=e[a+8],c!==go&&oy(i,e[Te].data[a+8]===l)&&sy(s,a,e)?(o=u,a=Wl(c),e=jl(c,e)):a=-1}}return r}function $S(n,e,t,i,r,s){let o=e[Te],a=o.data[n+8],c=i==null?Mr(a)&&pp:i!=o&&(a.type&3)!==0,l=r&1&&s===a,u=zl(a,o,t,c,l);return u!==null?$l(e,o,u,a,r):Ti}function zl(n,e,t,i,r){let s=n.providerIndexes,o=e.data,a=s&1048575,c=n.directiveStart,l=n.directiveEnd,u=s>>20,d=i?a:a+u,f=r?a+u:l;for(let h=d;h<f;h++){let g=o[h];if(h<c&&t===g||h>=c&&g.type===t)return h}if(r){let h=o[c];if(h&&us(h)&&h.type===t)return c}return null}function $l(n,e,t,i,r){let s=n[t],o=e.data;if(s instanceof Da){let a=s;if(a.resolving)throw Ch("");let c=ry(a.canSeeViewProviders);a.resolving=!0;let l=o[t].type||o[t],u,d=a.injectImpl?In(a.injectImpl):null,f=Jh(n,i,0);try{s=n[t]=a.factory(void 0,r,o,n,i),e.firstCreatePass&&t>=i.directiveStart&&PS(t,o[t],e)}finally{d!==null&&In(d),ry(c),a.resolving=!1,Kh()}}return s}function qS(n){if(typeof n=="string")return n.charCodeAt(0)||0;let e=Object.hasOwn(n,ss)?n[ss]:void 0;return typeof e=="number"?e>=0?e&Ly:XS:e}function sy(n,e,t){let i=1<<n;return!!(t[e+(n>>Fy)]&i)}function oy(n,e){return!(n&2)&&!(n&1&&e)}var Xi=class{_tNode;_lView;constructor(e,t){this._tNode=e,this._lView=t}get(e,t,i){return Hy(this._tNode,this._lView,e,is(i),t)}};function XS(){return new Xi(wi(),rt())}function YS(n,e,t,i,r){let s=n,o=e;for(;s!==null&&o!==null&&o[Ne]&2048&&!co(o);){let a=zy(s,o,t,i|2,Ti);if(a!==Ti)return a;i&=-5;let c=s.parent;if(!c){let l=o[Lh];if(l){let u=l.get(t,Ti,i);if(u!==Ti)return u}c=Gy(o),o=o[vr]}s=c}return r}function Gy(n){let e=n[Te],t=e.type;return t===2?e.declTNode:t===1?n[mn]:null}function ru(n){return{token:n.token,providedIn:n.autoProvided===!1?null:"root",factory:n.factory,value:void 0}}function ZS(){return xo(wi(),rt())}function xo(n,e){return new Ba(ai(n,e))}var Ba=(()=>{class n{nativeElement;constructor(t){this.nativeElement=t}static __NG_ELEMENT_ID__=ZS}return n})();function JS(n){return n instanceof Ba?n.nativeElement:n}function KS(){return this._results[Symbol.iterator]()}var ql=class{_emitDistinctChangesOnly;dirty=!0;_onDirty=void 0;_results=[];_changesDetected=!1;_changes=void 0;length=0;first=void 0;last=void 0;get changes(){return this._changes??=new $n}constructor(e=!1){this._emitDistinctChangesOnly=e}get(e){return this._results[e]}map(e){return this._results.map(e)}filter(e){return this._results.filter(e)}find(e){return this._results.find(e)}reduce(e,t){return this._results.reduce(e,t)}forEach(e){this._results.forEach(e)}some(e){return this._results.some(e)}toArray(){return this._results.slice()}toString(){return this._results.toString()}reset(e,t){this.dirty=!1;let i=hv(e);(this._changesDetected=!fv(this._results,i,t))&&(this._results=i,this.length=i.length,this.last=i[this.length-1],this.first=i[0])}notifyOnChanges(){this._changes!==void 0&&(this._changesDetected||!this._emitDistinctChangesOnly)&&this._changes.next(this)}onDirty(e){this._onDirty=e}setDirty(){this.dirty=!0,this._onDirty?.()}destroy(){this._changes!==void 0&&(this._changes.complete(),this._changes.unsubscribe())}[Symbol.iterator]=KS};function Wy(n){return(n.flags&128)===128}var zp=(function(n){return n[n.OnPush=0]="OnPush",n[n.Eager=1]="Eager",n[n.Default=1]="Default",n})(zp||{}),jy=new Map,QS=0;function ew(){return QS++}function tw(n){jy.set(n[xa],n)}function mp(n){jy.delete(n[xa])}var ay="__ngContext__";function _o(n,e){xr(e)?(n[ay]=e[xa],tw(e)):n[ay]=e}function $y(n){return Xy(n[oo])}function qy(n){return Xy(n[qn])}function Xy(n){for(;n!==null&&!Xn(n);)n=n[qn];return n}var gp;function Gp(n){gp=n}function Yy(){if(gp!==void 0)return gp;if(typeof document<"u")return document;throw new We(210,!1)}var Zy="r";var Jy="di";var Ky=!1,Qy=new Ke("",{factory:()=>Ky});var cy=new WeakMap;function nw(n,e){if(n==null||typeof n!="object")return;let t=cy.get(n);t||(t=new WeakSet,cy.set(n,t)),t.add(e)}var iw=(n,e,t,i)=>{};function rw(n,e,t,i){iw(n,e,t,i)}function Wp(n){return(n.flags&32)===32}var sw=()=>null;function e0(n,e,t=!1){return sw(n,e,t)}function t0(n,e){let t=n.contentQueries;if(t!==null){let i=we(null);try{for(let r=0;r<t.length;r+=2){let s=t[r],o=t[r+1];if(o!==-1){let a=n.data[o];Nl(s),a.contentQueries(2,e[o],o)}}}finally{we(i)}}}function _p(n,e,t){Nl(0);let i=we(null);try{e(n,t)}finally{we(i)}}function n0(n,e,t){if(kh(e)){let i=we(null);try{let r=e.directiveStart,s=e.directiveEnd;for(let o=r;o<s;o++){let a=n.data[o];if(a.contentQueries){let c=t[o];a.contentQueries(1,c,o)}}}finally{we(i)}}}var li=(function(n){return n[n.Emulated=0]="Emulated",n[n.None=2]="None",n[n.ShadowDom=3]="ShadowDom",n[n.ExperimentalIsolatedShadowDom=4]="ExperimentalIsolatedShadowDom",n})(li||{}),vp=class{changingThisBreaksApplicationSecurity;constructor(e){this.changingThisBreaksApplicationSecurity=e}toString(){return`SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}`}};function Xl(n){return n instanceof vp?n.changingThisBreaksApplicationSecurity:n}function ow(n,e){return n.createText(e)}function aw(n,e,t){n.setValue(e,t)}function i0(n,e,t){return n.createElement(e,t)}function fs(n,e,t,i,r){n.insertBefore(e,t,i,r)}function r0(n,e,t){n.appendChild(e,t)}function ly(n,e,t,i,r){i!==null?fs(n,e,t,i,r):r0(n,e,t)}function s0(n,e,t,i){n.removeChild(null,e,t,i)}function cw(n,e,t){n.setAttribute(e,"style",t)}function lw(n,e,t){t===""?n.removeAttribute(e,"class"):n.setAttribute(e,"class",t)}function o0(n,e,t){let{mergedAttrs:i,classes:r,styles:s}=t;i!==null&&BS(n,e,i),r!==null&&lw(n,e,r),s!==null&&cw(n,e,s)}function su(n){return n.ownerDocument}function uw(n,e,t){let i=n.length;for(;;){let r=n.indexOf(e,t);if(r===-1)return r;if(r===0||n.charCodeAt(r-1)<=32){let s=e.length;if(r+s===i||n.charCodeAt(r+s)<=32)return r}t=r+1}}var a0="ng-template";function dw(n,e,t,i){let r=0;if(i){for(;r<e.length&&typeof e[r]=="string";r+=2)if(e[r]==="class"&&uw(e[r+1].toLowerCase(),t,0)!==-1)return!0}else if(jp(n))return!1;if(r=e.indexOf(1,r),r>-1){let s;for(;++r<e.length&&typeof(s=e[r])=="string";)if(s.toLowerCase()===t)return!0}return!1}function jp(n){return n.type===4&&n.value!==a0}function fw(n,e,t){let i=n.type===4&&!t?a0:n.value;return e===i}function hw(n,e,t){let i=4,r=n.attrs,s=r!==null?gw(r):0,o=!1;for(let a=0;a<e.length;a++){let c=e[a];if(typeof c=="number"){if(!o&&!ci(i)&&!ci(c))return!1;if(o&&ci(c))continue;o=!1,i=c|i&1;continue}if(!o)if(i&4){if(i=2|i&1,c!==""&&!fw(n,c,t)||c===""&&e.length===1){if(ci(i))return!1;o=!0}}else if(i&8){if(r===null||!dw(n,r,c,t)){if(ci(i))return!1;o=!0}}else{let l=e[++a],u=pw(c,r,jp(n),t);if(u===-1){if(ci(i))return!1;o=!0;continue}if(l!==""){let d;if(u>s?d="":d=r[u+1].toLowerCase(),i&2&&l!==d){if(ci(i))return!1;o=!0}}}}return ci(i)||o}function ci(n){return(n&1)===0}function pw(n,e,t,i){if(e===null)return-1;let r=0;if(i||!t){let s=!1;for(;r<e.length;){let o=e[r];if(o===n)return r;if(o===3||o===6)s=!0;else if(o===1||o===2){let a=e[++r];for(;typeof a=="string";)a=e[++r];continue}else{if(o===4)break;if(o===0){r+=4;continue}}r+=s?1:2}return-1}else return _w(e,n)}function mw(n,e,t=!1){for(let i=0;i<e.length;i++)if(hw(n,e[i],t))return!0;return!1}function gw(n){for(let e=0;e<n.length;e++){let t=n[e];if(US(t))return e}return n.length}function _w(n,e){let t=n.indexOf(4);if(t>-1)for(t++;t<n.length;){let i=n[t];if(typeof i=="number")return-1;if(i===e)return t;t++}return-1}function uy(n,e){return n?":not("+e.trim()+")":e}function vw(n){let e=n[0],t=1,i=2,r="",s=!1;for(;t<n.length;){let o=n[t];if(typeof o=="string")if(i&2){let a=n[++t];r+="["+o+(a.length>0?'="'+a+'"':"")+"]"}else i&8?r+="."+o:i&4&&(r+=" "+o);else r!==""&&!ci(o)&&(e+=uy(s,r),r=""),i=o,s=s||!ci(i);t++}return r!==""&&(e+=uy(s,r)),e}function yw(n){return n.map(vw).join(",")}function xw(n){let e=[],t=[],i=1,r=2;for(;i<n.length;){let s=n[i];if(typeof s=="string")r===2?s!==""&&e.push(s,n[++i]):r===8&&t.push(s);else{if(!ci(r))break;r=s}i++}return t.length&&e.push(1,...t),e}var Zi={},Yi=(function(n){return n[n.Important=1]="Important",n[n.DashCase=2]="DashCase",n})(Yi||{}),Mw;function $p(n,e){return Mw(n,e)}var qp=new Set;var q2=typeof document<"u"&&typeof document?.documentElement?.getAnimations=="function";var yp=new WeakMap;function c0(n){return n?n[vr]??n:null}var po=new WeakSet;function Ew(n,e,t){let i=yp.get(n);if(!i||i.length===0)return;let r=e.parentNode,s=e.previousSibling,o=c0(t);for(let a=i.length-1;a>=0;a--){let{el:c,declarationView:l}=i[a],u=c.parentNode;c===e?(i.splice(a,1),po.add(c),c.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}}))):s&&c===s?(i.splice(a,1),c.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),c.parentNode?.removeChild(c)):u&&r&&u!==r&&(o===null||l===null||o===l)&&(i.splice(a,1),c.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),c.parentNode?.removeChild(c))}}function bw(n,e,t){let i=c0(t),r=yp.get(n);r?r.some(s=>s.el===e)||r.push({el:e,declarationView:i}):yp.set(n,[{el:e,declarationView:i}])}var Xp=(function(n){return n[n.CHANGE_DETECTION=0]="CHANGE_DETECTION",n[n.AFTER_NEXT_RENDER=1]="AFTER_NEXT_RENDER",n})(Xp||{}),ms=new Ke(""),dy=new Set;function Mo(n){dy.has(n)||(dy.add(n),performance?.mark?.("mark_feature_usage",{detail:{feature:n}}))}var l0=(()=>{class n{impl=null;execute(){this.impl?.execute()}static \u0275prov=Jt({token:n,providedIn:"root",factory:()=>new n})}return n})();var xp=null,u0=null;function fy(n,e,t,i){xp?.maybeQueueEnterAnimation(n,e,t,i)}function hy(n,e,t,i){xp===null?i(!1):xp.runLeaveAnimationsWithCallback(n,e,t,i)}function Sw(n){u0?.initViewDetachAnimations(n)}function ww(n){u0?.clearViewDetachAnimations(n)}function mo(n,e,t,i,r,s,o,a){if(r!=null){let c,l=!1;Xn(r)?c=r:xr(r)&&(l=!0,r=r[oi]);let u=$t(r);n===0&&i!==null?(fy(a,i,s,t),o==null?r0(e,i,u):fs(e,i,u,o||null,!0)):n===1&&i!==null?(fs(e,i,u,o||null,!0),Ew(s,u,a),po.has(u)||fy(a,i,s,t)):n===2?(a?.[Mv]?.leave?.has(s.index)&&bw(s,u,a),po.delete(u),hy(a,s,t,d=>{if(po.has(u)){po.delete(u);return}s0(e,u,l,d)})):n===3&&(po.delete(u),hy(a,s,t,()=>{e.destroyNode(u)})),c!=null&&Bw(e,n,t,c,s,i,o)}}function Tw(n,e){d0(n,e),e[oi]=null,e[mn]=null}function Cw(n,e,t,i,r,s){i[oi]=r,i[mn]=e,au(n,i,t,1,r,s)}function d0(n,e){e[Mi].changeDetectionScheduler?.notify(9),au(n,e,e[Ft],2,null,null)}function Iw(n){let e=n[oo];if(!e)return cp(n[Te],n);for(;e;){let t=null;if(xr(e))t=e[oo];else{let i=e[It];i&&(t=i)}if(!t){for(;e&&!e[qn]&&e!==n;)xr(e)&&cp(e[Te],e),e=e[Ot];e===null&&(e=n),xr(e)&&cp(e[Te],e),t=e&&e[qn]}e=t}}function Yp(n,e){let t=n[ls],i=t.indexOf(e);t.splice(i,1)}function ou(n,e){if(ds(e))return;let t=e[Ft];t.destroyNode&&au(n,e,t,3,null,null),Iw(e)}function cp(n,e){if(ds(e))return;let t=we(null);try{e[Ne]&=-129,e[Ne]|=256,e[Nn]&&el(e[Nn]),Dw(n,e),Aw(n,e),e[Te].type===1&&e[Ft].destroy();let i=e[yr];if(i!==null&&Xn(e[Ot])){i!==e[Ot]&&Yp(i,e);let r=e[Ei];r!==null&&r.detachView(n)}mp(e)}finally{we(t)}}function Aw(n,e){let t=n.cleanup,i=e[so];if(t!==null)for(let o=0;o<t.length-1;o+=2)if(typeof t[o]=="string"){let a=t[o+3];a>=0?i[a]():i[-a].unsubscribe(),o+=2}else{let a=i[t[o+1]];t[o].call(a)}i!==null&&(e[so]=null);let r=e[Gi];if(r!==null){e[Gi]=null;for(let o=0;o<r.length;o++){let a=r[o];a()}}let s=e[ao];if(s!==null){e[ao]=null;for(let o of s)o.destroy()}}function Dw(n,e){let t;if(n!=null&&(t=n.destroyHooks)!=null)for(let i=0;i<t.length;i+=2){let r=e[t[i]];if(!(r instanceof Da)){let s=t[i+1];if(Array.isArray(s))for(let o=0;o<s.length;o+=2){let a=r[s[o]],c=s[o+1];lt(tt.LifecycleHookStart,a,c);try{c.call(a)}finally{lt(tt.LifecycleHookEnd,a,c)}}else{lt(tt.LifecycleHookStart,r,s);try{s.call(r)}finally{lt(tt.LifecycleHookEnd,r,s)}}}}}function Rw(n,e,t){if(e===null)throw new We(510,!1);return Nw(n,e.parent,t)}function Nw(n,e,t){let i=e;for(;i!==null&&i.type&168;)e=i,i=e.parent;if(i===null)return t[oi];if(Mr(i)){let{encapsulation:r}=n.data[i.directiveStart+i.componentOffset];if(r===li.None||r===li.Emulated)return null}return ai(i,t)}function Pw(n,e,t){return Lw(n,e,t)}function Ow(n,e,t){return n.type&40?ai(n,t):null}var Lw=Ow,py;function Zp(n,e,t,i){let r=Rw(n,i,e),s=e[Ft],o=i.parent||e[mn],a=Pw(o,i,e);if(r!=null)if(Array.isArray(t))for(let c=0;c<t.length;c++)ly(s,r,t[c],a,!1);else ly(s,r,t,a,!1);py!==void 0&&py(s,i,e,t,r)}function Ia(n,e){if(e!==null){let t=e.type;if(t&3)return ai(e,n);if(t&4)return Mp(-1,n[e.index]);if(t&8){let i=e.child;if(i!==null)return Ia(n,i);{let r=n[e.index];return Xn(r)?Mp(-1,r):$t(r)}}else{if(t&128)return Ia(n,e.next);if(t&32)return $p(e,n)()||$t(n[e.index]);{let i=f0(n,e);if(i!==null){if(Array.isArray(i))return i[0];let r=Wi(n[Rn]);return Ia(r,i)}else return Ia(n,e.next)}}}return null}function f0(n,e){if(e!==null){let i=n[Rn][mn],r=e.projection;return i.projection[r]}return null}function Mp(n,e){let t=It+n+1;if(t<e.length){let i=e[t],r=i[Te].firstChild;if(r!==null)return Ia(i,r)}return e[cs]}function Jp(n,e,t,i,r,s,o){for(;t!=null;){let a=i[qi];if(t.type===128){t=t.next;continue}let c=i[t.index],l=t.type;if(o&&e===0&&(c&&_o($t(c),i),t.flags|=2),!Wp(t))if(l&8)Jp(n,e,t.child,i,r,s,!1),mo(e,n,a,r,c,t,s,i);else if(l&32){let u=$p(t,i),d;for(;d=u();)mo(e,n,a,r,d,t,s,i);mo(e,n,a,r,c,t,s,i)}else l&16?kw(n,e,i,t,r,s):mo(e,n,a,r,c,t,s,i);t=o?t.projectionNext:t.next}}function au(n,e,t,i,r,s){n.type===3?Fw(t,i,e,r,s):Jp(t,i,n.firstChild,e,r,s,!1)}function Fw(n,e,t,i,r){let o=t[Te].firstChild,a=o.next,c=$t(t[o.index]),l=$t(t[a.index]),u=a.index+1,d=t[u];if(e===1||e===0)i!==null&&(d&&d.hasChildNodes()?fs(n,i,d,r,!0):(fs(n,i,c,r,!0),fs(n,i,l,r,!0)));else if(e===2){if(d||(d=document.createDocumentFragment(),t[u]=d),c&&c.parentNode===d)return;let f=c;for(;f!==null;){let h=f.nextSibling;if(d.appendChild(f),f===l)break;f=h}}}function kw(n,e,t,i,r,s){let o=t[Rn],c=o[mn].projection[i.projection];if(Array.isArray(c))for(let l=0;l<c.length;l++){let u=c[l];mo(e,n,t[qi],r,u,i,s,t)}else{let l=c,u=o[Ot];Wy(i)&&(l.flags|=128),Jp(n,e,l,u,r,s,!0)}}function Bw(n,e,t,i,r,s,o){let a=i[cs],c=$t(i);if(a!==c&&mo(e,n,t,s,a,r,o),(i[Ne]&4)===0)for(let l=It;l<i.length;l++){let u=i[l];au(u[Te],u,n,e,s,a)}}function Uw(n,e,t,i,r){if(e)r?n.addClass(t,i):n.removeClass(t,i);else{let s=i.indexOf("-")===-1?void 0:Yi.DashCase;r==null?n.removeStyle(t,i,s):(typeof r=="string"&&r.endsWith("!important")&&(r=r.slice(0,-10),s|=Yi.Important),n.setStyle(t,i,r,s))}}function Kp(n,e,t,i,r,s,o,a,c,l,u){let d=jt+i,f=d+r,h=Vw(d,f),g=typeof l=="function"?l():l;return h[Te]={type:n,blueprint:h,template:t,queries:null,viewQuery:a,declTNode:e,data:h.slice().fill(null,d),bindingStartIndex:d,expandoStartIndex:f,hostBindingOpCodes:null,firstCreatePass:!0,firstUpdatePass:!0,staticViewQueries:!1,staticContentQueries:!1,preOrderHooks:null,preOrderCheckHooks:null,contentHooks:null,contentCheckHooks:null,viewHooks:null,viewCheckHooks:null,destroyHooks:null,cleanup:null,contentQueries:null,components:null,directiveRegistry:typeof s=="function"?s():s,pipeRegistry:typeof o=="function"?o():o,firstChild:null,schemas:c,consts:g,incompleteFirstPass:!1,ssrId:u}}function Vw(n,e){let t=[];for(let i=0;i<e;i++)t.push(i<n?null:Zi);return t}function Hw(n){let e=n.tView;return e===null||e.incompleteFirstPass?n.tView=Kp(1,null,n.template,n.decls,n.vars,n.directiveDefs,n.pipeDefs,n.viewQuery,n.schemas,n.consts,n.id):e}function Qp(n,e,t,i,r,s,o,a,c,l,u){let d=e.blueprint.slice();return d[oi]=r,d[Ne]=i|4|128|8|64|1024,(l!==null||n&&n[Ne]&2048)&&(d[Ne]|=2048),Uh(d),d[Ot]=d[vr]=n,d[Ct]=t,d[Mi]=o||n&&n[Mi],d[Ft]=a||n&&n[Ft],d[qi]=c||n&&n[qi]||null,d[mn]=s,d[xa]=ew(),d[ro]=u,d[Lh]=l,d[Rn]=e.type==2?n[Rn]:d,d}function zw(n,e,t){let i=ai(e,n),r=Hw(t),s=n[Mi].rendererFactory,o=em(n,Qp(n,r,null,h0(t),i,e,null,s.createRenderer(i,t),null,null,null));return n[e.index]=o}function h0(n){let e=16;return n.signals?e=4096:n.onPush&&(e=64),e}function p0(n,e,t,i){if(t===0)return-1;let r=e.length;for(let s=0;s<t;s++)e.push(i),n.blueprint.push(i),n.data.push(null);return r}function em(n,e){return n[oo]?n[Oh][qn]=e:n[oo]=e,n[Oh]=e,e}function Qe(n=1){m0(Pn(),rt(),Sr()+n,!1)}function m0(n,e,t,i){if(!i)if((e[Ne]&3)===3){let s=n.preOrderCheckHooks;s!==null&&Vl(e,s,t)}else{let s=n.preOrderHooks;s!==null&&Hl(e,s,0,t)}wr(t)}var cu=(function(n){return n[n.None=0]="None",n[n.SignalBased=1]="SignalBased",n[n.HasDecoratorInputTransform=2]="HasDecoratorInputTransform",n})(cu||{});function Ep(n,e,t,i){let r=we(null);try{let[s,o,a]=n.inputs[t],c=null;(o&cu.SignalBased)!==0&&(c=e[s][jn]),c!==null&&c.transformFn!==void 0?i=c.transformFn(i):a!==null&&(i=a.call(e,i)),n.setInput!==null?n.setInput(e,c,i,t,s):DS(e,c,s,i)}finally{we(r)}}function g0(n,e,t,i,r){let s=Sr(),o=i&2;try{wr(-1),o&&e.length>jt&&m0(n,e,jt,!1);let a=o?tt.TemplateUpdateStart:tt.TemplateCreateStart;lt(a,r,t),t(i,r)}finally{wr(s);let a=o?tt.TemplateUpdateEnd:tt.TemplateCreateEnd;lt(a,r,t)}}function _0(n,e,t){Zw(n,e,t),(t.flags&64)===64&&Jw(n,e,t)}function tm(n,e,t=ai){let i=e.localNames;if(i!==null){let r=e.index+1;for(let s=0;s<i.length;s+=2){let o=i[s+1],a=o===-1?t(e,n):n[o];n[r++]=a}}}function Gw(n,e,t,i){let s=i.get(Qy,Ky)||t===li.ShadowDom||t===li.ExperimentalIsolatedShadowDom,o=n.selectRootElement(e,s);return Ww(o),o}function Ww(n){jw(n)}var jw=()=>null;function $w(n){return n==="class"?"className":n==="for"?"htmlFor":n==="formaction"?"formAction":n==="innerHtml"?"innerHTML":n==="readonly"?"readOnly":n==="tabindex"?"tabIndex":n}function qw(n,e,t,i,r,s){let o=e[Te];if(nm(n,o,e,t,i)){Mr(n)&&Yw(e,n.index);return}n.type&3&&(t=$w(t)),Xw(n,e,t,i,r,s)}function Xw(n,e,t,i,r,s){if(n.type&3){let o=ai(n,e);i=s!=null?s(i,n.value||"",t):i,i=v0(t,o,i),r.setProperty(o,t,i)}else n.type&12}function v0(n,e,t,i=!1){return n==="src"&&(e.tagName==="IMG"||e.tagName==="VIDEO")?t==null?i?t:"":Xl(t):t}function Yw(n,e){let t=bi(e,n);t[Ne]&16||(t[Ne]|=64)}function Zw(n,e,t){let i=t.directiveStart,r=t.directiveEnd;Mr(t)&&zw(e,t,n.data[i+t.componentOffset]),n.firstCreatePass||ky(t,e);let s=t.initialInputs;for(let o=i;o<r;o++){let a=n.data[o],c=$l(e,n,o,t);if(_o(c,e),s!==null&&nT(e,o-i,c,a,t,s),us(a)){let l=bi(t.index,e);l[Ct]=$l(e,n,o,t)}}}function Jw(n,e,t){let i=t.directiveStart,r=t.directiveEnd,s=t.index,o=Vv();try{wr(s);for(let a=i;a<r;a++){let c=n.data[a],l=e[a];Rl(a),(c.hostBindings!==null||c.hostVars!==0||c.hostAttrs!==null)&&Kw(c,l)}}finally{wr(-1),Rl(o)}}function Kw(n,e){n.hostBindings!==null&&n.hostBindings(1,e)}function Qw(n,e){let t=n.directiveRegistry,i=null;if(t)for(let r=0;r<t.length;r++){let s=t[r];mw(e,s.selectors,!1)&&(i??=[],us(s)?i.unshift(s):i.push(s))}return i}function eT(n,e,t,i,r,s){let o=ai(n,e);i=v0(t,o,i,!0),tT(e[Ft],o,s,n.value,t,i,r)}function tT(n,e,t,i,r,s,o){if(s==null)o?.(s,i||"",r),n.removeAttribute(e,r,t);else{let a=o==null?Th(s):o(s,i||"",r);n.setAttribute(e,r,a,t)}}function nT(n,e,t,i,r,s){let o=s[e];if(o!==null)for(let a=0;a<o.length;a+=2){let c=o[a],l=o[a+1];Ep(i,t,c,l)}}function y0(n,e,t,i,r){let s=jt+t,o=e[Te],a=r(o,e,n,i,t);e[s]=a,lo(n,!0);let c=n.type===2;return c?(o0(e[Ft],a,n),(Dv()===0||Tl(n))&&_o(a,e),Rv()):_o(a,e),Ll()&&(!c||!Wp(n))&&Zp(o,e,a,n),n}function x0(n){let e=n;return qh()?Lv():(e=e.parent,lo(e,!1)),e}function iT(n,e){let t=n[qi];if(!t)return;let i;try{i=t.get(ho,null)}catch{i=null}i?.(e)}function nm(n,e,t,i,r){let s=n.inputs?.[i],o=n.hostDirectiveInputs?.[i],a=!1;if(o)for(let c=0;c<o.length;c+=2){let l=o[c],u=o[c+1],d=e.data[l];Ep(d,t[l],u,r),a=!0}if(s)for(let c of s){let l=t[c],u=e.data[c];Ep(u,l,i,r),a=!0}return a}function rT(n,e){let t=bi(e,n),i=t[Te];sT(i,t);let r=t[oi];r!==null&&t[ro]===null&&(t[ro]=e0(r,t[qi])),lt(tt.ComponentStart);try{im(i,t,t[Ct])}finally{lt(tt.ComponentEnd,t[Ct])}}function sT(n,e){for(let t=e.length;t<n.blueprint.length;t++)e.push(n.blueprint[t])}function im(n,e,t){Pl(e);try{let i=n.viewQuery;i!==null&&_p(1,i,t);let r=n.template;r!==null&&g0(n,e,r,1,t),n.firstCreatePass&&(n.firstCreatePass=!1),e[Ei]?.finishViewCreation(n),n.staticContentQueries&&t0(n,e),n.staticViewQueries&&_p(2,n.viewQuery,t);let s=n.components;s!==null&&oT(e,s)}catch(i){throw n.firstCreatePass&&(n.incompleteFirstPass=!0,n.firstCreatePass=!1),i}finally{e[Ne]&=-5,Ol()}}function oT(n,e){for(let t=0;t<e.length;t++)rT(n,e[t])}function lu(n,e,t,i){let r=we(null);try{let s=e.tView,a=n[Ne]&4096?4096:16,c=Qp(n,s,t,a,null,e,null,null,i?.injector??null,i?.embeddedViewInjector??null,i?.dehydratedView??null),l=n[e.index];c[yr]=l;let u=n[Ei];return u!==null&&(c[Ei]=u.createEmbeddedView(s)),im(s,c,t),c}finally{we(r)}}function Ra(n,e){return!e||e.firstChild===null||Wy(n)}function Na(n,e,t,i,r=!1){if(n.type===3){let s=n.firstChild,o=s.next,a=$t(e[s.index]),c=$t(e[o.index]),l=a;for(;l!==null&&(i.push(l),l!==c);)l=l.nextSibling;return i}for(;t!==null;){if(t.type===128){t=r?t.projectionNext:t.next;continue}let s=e[t.index];if(s!==null)if(Xn(s)){let a=s[cs];a!==s[oi]&&i.push($t(s)),s[Ne]&4||M0(s,i),i.push(a)}else i.push($t(s));let o=t.type;if(o&8)Na(n,e,t.child,i);else if(o&32){let a=$p(t,e),c;for(;c=a();)i.push(c)}else if(o&16){let a=f0(e,t);if(Array.isArray(a))i.push(...a);else{let c=Wi(e[Rn]);Na(c[Te],c,a,i,!0)}}t=r?t.projectionNext:t.next}return i}function M0(n,e){for(let t=It;t<n.length;t++){let i=n[t],r=i[Te].firstChild;r!==null&&Na(i[Te],i,r,e)}}function E0(n){if(n[wl]!==null){for(let e of n[wl])e.impl.addSequence(e);n[wl].length=0}}var b0=[];function aT(n){return n[Nn]??cT(n)}function cT(n){let e=b0.pop()??Object.create(uT);return e.lView=n,e}function lT(n){n.lView[Nn]!==n&&(n.lView=null,b0.push(n))}var uT=hn(Wt({},ua),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:n=>{Sa(n.lView)},consumerOnSignalRead(){this.lView[Nn]=this}});function dT(n){let e=n[Nn]??Object.create(fT);return e.lView=n,e}var fT=hn(Wt({},ua),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:n=>{let e=Wi(n.lView);for(;e&&!S0(e[Te]);)e=Wi(e);e&&Vh(e)},consumerOnSignalRead(){this.lView[Nn]=this}});function S0(n){return n.type!==2}function w0(n){if(n[ao]===null)return;let e=!0;for(;e;){let t=!1;for(let i of n[ao])if(i.dirty&&(t=!0,i.zone===null||Zone.current===i.zone?i.run():i.zone.run(()=>i.run()),n[ao]===null))return;e=t&&!!(n[Ne]&8192)}}var hT=100;function T0(n,e=0){let i=n[Mi].rendererFactory,r=!1;r||i.begin?.();try{pT(n,e)}finally{r||i.end?.()}}function pT(n,e){let t=Xh();try{Yh(!0),bp(n,e);let i=0;for(;ba(n);){if(i===hT)throw new We(103,!1);i++,bp(n,1)}}finally{Yh(t)}}function mT(n,e,t,i){if(ds(e))return;let r=e[Ne],s=!1,o=!1;Pl(e);let a=!0,c=null,l=null;s||(S0(n)?(l=aT(e),c=Qc(l)):Zc()===null?(a=!1,l=dT(e),c=Qc(l)):e[Nn]&&(el(e[Nn]),e[Nn]=null));try{Uh(e),Fv(n.bindingStartIndex),t!==null&&g0(n,e,t,2,i);let u=(r&3)===3;if(!s)if(u){let h=n.preOrderCheckHooks;h!==null&&Vl(e,h,null)}else{let h=n.preOrderHooks;h!==null&&Hl(e,h,0,null),op(e,0)}if(o||gT(e),w0(e),I0(e,0),n.contentQueries!==null&&t0(n,e),!s)if(u){let h=n.contentCheckHooks;h!==null&&Vl(e,h)}else{let h=n.contentHooks;h!==null&&Hl(e,h,1),op(e,1)}vT(n,e);let d=n.components;d!==null&&D0(e,d,0);let f=n.viewQuery;if(f!==null&&_p(2,f,i),!s)if(u){let h=n.viewCheckHooks;h!==null&&Vl(e,h)}else{let h=n.viewHooks;h!==null&&Hl(e,h,2),op(e,2)}if(n.firstUpdatePass===!0&&(n.firstUpdatePass=!1),e[Sl]){for(let h of e[Sl])h();e[Sl]=null}s||(E0(e),e[Ne]&=-73)}catch(u){C0(e,u,s)}finally{l!==null&&(Vf(l,c),a&&lT(l)),Ol()}}function C0(n,e,t){let i=!1,r=e,s=n,o=we(null);try{for(;s!==null;){if(Xn(s)){s=s[Ot];continue}let a=s[Ma];if(a)try{let c=n[Rn][Ct],l=c?.constructor,u={declarationInstance:c,declarationType:l,caughtBy:a},d=we(null);try{a(Kv(r),u)}finally{we(d)}i=!0;break}catch(c){r=c}s=s[Ot]}}finally{we(o)}if(!i)throw t||Sa(n),r}function I0(n,e){for(let t=$y(n);t!==null;t=qy(t))for(let i=It;i<t.length;i++){let r=t[i];A0(r,e)}}function gT(n){for(let e=$y(n);e!==null;e=qy(e)){if(!(e[Ne]&2))continue;let t=e[ls];for(let i=0;i<t.length;i++){let r=t[i];Vh(r)}}}function _T(n,e,t){lt(tt.ComponentStart);let i=bi(e,n);try{A0(i,t)}finally{lt(tt.ComponentEnd,i[Ct])}}function A0(n,e){Il(n)&&bp(n,e)}function bp(n,e){let i=n[Te],r=n[Ne],s=n[Nn],o=!!(e===0&&r&16);if(o||=!!(r&64&&e===0),o||=!!(r&1024),o||=!!(s?.dirty&&Hf(s)),o||=!1,s&&(s.dirty=!1),n[Ne]&=-9217,o)mT(i,n,i.template,n[Ct]);else if(r&8192){let a=we(null);try{try{w0(n)}catch(l){C0(n,l,!1)}I0(n,1);let c=i.components;c!==null&&D0(n,c,1),E0(n)}finally{we(a)}}}function D0(n,e,t){for(let i=0;i<e.length;i++)_T(n,e[i],t)}function vT(n,e){let t=n.hostBindingOpCodes;if(t!==null)try{for(let i=0;i<t.length;i++){let r=t[i];if(r<0)wr(~r);else{let s=r,o=t[++i],a=t[++i];Uv(o,s);let c=e[s];lt(tt.HostBindingsUpdateStart,c);try{a(2,c)}finally{lt(tt.HostBindingsUpdateEnd,c)}}}}finally{wr(-1)}}function rm(n,e){let t=Xh()?64:1088;for(n[Mi].changeDetectionScheduler?.notify(e);n;){n[Ne]|=t;let i=Wi(n);if(co(n)&&!i)return n;n=i}return null}function R0(n,e,t,i){return[n,!0,0,e,null,i,null,t,null,null]}function N0(n,e){let t=It+e;if(t<n.length)return n[t]}function uu(n,e,t,i=!0){let r=e[Te];if(yT(r,e,n,t),i){let o=Mp(t,n),a=e[Ft],c=a.parentNode(n[cs]);c!==null&&Cw(r,n[mn],a,e,c,o)}let s=e[ro];s!==null&&s.firstChild!==null&&(s.firstChild=null)}function P0(n,e){let t=Pa(n,e);return t!==void 0&&ou(t[Te],t),t}function Pa(n,e){if(n.length<=It)return;let t=It+e,i=n[t];if(i){let r=i[yr];r!==null&&r!==n&&Yp(r,i),e>0&&(n[t-1][qn]=i[qn]);let s=ga(n,It+e);Tw(i[Te],i);let o=s[Ei];o!==null&&o.detachView(s[Te]),i[Ot]=null,i[qn]=null,i[Ne]&=-129}return i}function yT(n,e,t,i){let r=It+i,s=t.length;i>0&&(t[r-1][qn]=e),i<s-It?(e[qn]=t[r],Ah(t,It+i,e)):(t.push(e),e[qn]=null),e[Ot]=t;let o=e[yr];o!==null&&t!==o&&O0(o,e);let a=e[Ei];a!==null&&a.insertView(n),Al(e),e[Ne]|=128}function O0(n,e){let t=n[ls],i=e[Ot];if(xr(i))n[Ne]|=2;else{let r=i[Ot][Rn];e[Rn]!==r&&(n[Ne]|=2)}t===null?n[ls]=[e]:t.push(e)}var vo=class{_lView;_cdRefInjectingView;_appRef=null;_attachedToViewContainer=!1;exhaustive;get rootNodes(){let e=this._lView,t=e[Te];return Na(t,e,t.firstChild,[])}constructor(e,t){this._lView=e,this._cdRefInjectingView=t}get context(){return this._lView[Ct]}set context(e){this._lView[Ct]=e}get destroyed(){return ds(this._lView)}destroy(){if(this._appRef)this._appRef.detachView(this);else if(this._attachedToViewContainer){let e=this._lView[Ot];if(Xn(e)){let t=e[Ea],i=t?t.indexOf(this):-1;i>-1&&(Pa(e,i),ga(t,i))}this._attachedToViewContainer=!1}ou(this._lView[Te],this._lView)}onDestroy(e){Dl(this._lView,e)}markForCheck(){rm(this._cdRefInjectingView||this._lView,4)}detach(){this._lView[Ne]&=-129}reattach(){Al(this._lView),this._lView[Ne]|=128}detectChanges(){this._lView[Ne]|=1024,T0(this._lView)}checkNoChanges(){}attachToViewContainerRef(){if(this._appRef)throw new We(902,!1);this._attachedToViewContainer=!0}detachFromAppRef(){this._appRef=null;let e=co(this._lView),t=this._lView[yr];t!==null&&!e&&Yp(t,this._lView),d0(this._lView[Te],this._lView)}attachToAppRef(e){if(this._attachedToViewContainer)throw new We(902,!1);this._appRef=e;let t=co(this._lView),i=this._lView[yr];i!==null&&!t&&O0(i,this._lView),Al(this._lView)}};var Oa=(()=>{class n{_declarationLView;_declarationTContainer;elementRef;static __NG_ELEMENT_ID__=xT;constructor(t,i,r){this._declarationLView=t,this._declarationTContainer=i,this.elementRef=r}get ssrId(){return this._declarationTContainer.tView?.ssrId||null}createEmbeddedView(t,i){return this.createEmbeddedViewImpl(t,i)}createEmbeddedViewImpl(t,i,r){let s=lu(this._declarationLView,this._declarationTContainer,t,{embeddedViewInjector:i,dehydratedView:r});return new vo(s)}}return n})();function xT(){return sm(wi(),rt())}function sm(n,e){return n.type&4?new Oa(e,n,xo(n,e)):null}function du(n,e,t,i,r){let s=n.data[e];if(s===null)s=MT(n,e,t,i,r),Bv()&&(s.flags|=32);else if(s.type&64){s.type=t,s.value=i,s.attrs=r;let o=Ov();s.injectorIndex=o===null?-1:o.injectorIndex}return lo(s,!0),s}function MT(n,e,t,i,r){let s=$h(),o=qh(),a=o?s:s&&s.parent,c=n.data[e]=bT(n,a,t,e,i,r);return ET(n,c,s,o),c}function ET(n,e,t,i){n.firstChild===null&&(n.firstChild=e),t!==null&&(i?t.child==null&&e.parent!==null&&(t.child=e):t.next===null&&(t.next=e,e.prev=t))}function bT(n,e,t,i,r,s){let o=e?e.injectorIndex:-1,a=0;return Pv()&&(a|=128),{type:t,index:i,insertBeforeIndex:null,injectorIndex:o,directiveStart:-1,directiveEnd:-1,directiveStylingLast:-1,componentOffset:-1,controlDirectiveIndex:-1,customControlIndex:-1,propertyBindings:null,flags:a,providerIndexes:0,value:r,namespace:ep(),attrs:s,mergedAttrs:null,localNames:null,initialInputs:null,inputs:null,hostDirectiveInputs:null,outputs:null,hostDirectiveOutputs:null,directiveToIndex:null,tView:null,next:null,prev:null,projectionNext:null,child:null,parent:e,projection:null,styles:null,stylesWithoutHost:null,residualStyles:void 0,classes:null,classesWithoutHost:null,residualClasses:void 0,classBindings:0,styleBindings:0}}function ST(n){let e=n[Fh]??[],i=n[Ot][Ft],r=[];for(let s of e)s.data[Jy]!==void 0?r.push(s):wT(s,i);n[Fh]=r}function wT(n,e){let t=0,i=n.firstChild;if(i){let r=n.data[Zy];for(;t<r;){let s=i.nextSibling;s0(e,i,!1),i=s,t++}}}var TT=()=>null,CT=()=>null;function Sp(n,e){return TT(n,e)}function L0(n,e,t){return CT(n,e,t)}var F0=class{},hs=class{};var k0=(()=>{class n{static \u0275prov=Jt({token:n,providedIn:"root",factory:()=>null})}return n})();function B0(n){return n.debugInfo?.className||n.type.name||null}var Gl={},Yl=class{injector;parentInjector;constructor(e,t){this.injector=e,this.parentInjector=t}get(e,t,i){let r=this.injector.get(e,Gl,i);return r!==Gl||t===Gl?r:this.parentInjector.get(e,t,i)}};function Eo(n,e,t){if(t===Zi)return!1;let i=n[e];return Object.is(i,t)?!1:(n[e]=t,!0)}function lp(n,e,t){return function i(r){let s=i.__ngNativeEl__;s!==void 0&&nw(r,s);let o=Mr(n)?bi(n.index,e):e;rm(o,5);let a=e[Ct],c=my(e,a,t,r),l=i.__ngNextListenerFn__;for(;l;)c=my(e,a,l,r)&&c,l=l.__ngNextListenerFn__;return c}}function my(n,e,t,i){let r=we(null);try{return lt(tt.OutputStart,e,t),t(i)!==!1}catch(s){return iT(n,s),!1}finally{lt(tt.OutputEnd,e,t),we(r)}}function IT(n,e,t,i,r,s,o,a){let c=Tl(n),l=!1,u=null;if(!i&&c&&(u=DT(e,t,s,n.index)),u!==null){let d=u.__ngLastListenerFn__||u;d.__ngNextListenerFn__=o,u.__ngLastListenerFn__=o,l=!0}else{let d=ai(n,t),f=i?i(d):d;rw(t,f,s,a),i||(a.__ngNativeEl__=d);let h=r.listen(f,s,a);if(!AT(s)){let g=i?_=>i($t(_[n.index])):n.index;U0(g,e,t,s,a,h,!1)}}return l}function AT(n){return n.startsWith("animation")||n.startsWith("transition")}function DT(n,e,t,i){let r=n.cleanup;if(r!=null)for(let s=0;s<r.length-1;s+=2){let o=r[s];if(o===t&&r[s+1]===i){let a=e[so],c=r[s+2];return a&&a.length>c?a[c]:null}typeof o=="string"&&(s+=2)}return null}function U0(n,e,t,i,r,s,o){let a=e.firstCreatePass?zh(e):null,c=Hh(t),l=c.length;c.push(r,s),a&&a.push(i,n,l,(l+1)*(o?-1:1))}function gy(n,e,t,i,r,s){let o=e[t],a=e[Te],l=a.data[t].outputs[i],d=o[l].subscribe(s);U0(n.index,a,e,r,s,d,!0)}var wp=Symbol("BINDING");var gs=new Ke("");function Zl(n,e,t){let i=t?n.styles:null,r=t?n.classes:null,s=0;if(e!==null)for(let o=0;o<e.length;o++){let a=e[o];if(typeof a=="number")s=a;else if(s==1)r=xh(r,a);else if(s==2){let c=a,l=e[++o];i=xh(i,c+": "+l+";")}}t?n.styles=i:n.stylesWithoutHost=i,t?n.classes=r:n.classesWithoutHost=r}function V0(n,e=0){let t=rt();if(t===null)return it(n,e);let i=wi();return Hy(i,t,An(n),e)}function RT(n,e,t,i,r){let s=i===null?null:{"":-1},o=r(n,t);if(o!==null){let a=o,c=null,l=null;for(let u of o)if(u.resolveHostDirectives!==null){[a,c,l]=u.resolveHostDirectives(o);break}OT(n,e,t,a,s,c,l)}s!==null&&i!==null&&NT(t,i,s)}function NT(n,e,t){let i=n.localNames=[];for(let r=0;r<e.length;r+=2){let s=t[e[r+1]];if(s==null)throw new We(-301,!1);i.push(e[r],s)}}function PT(n,e,t){e.componentOffset=t,(n.components??=[]).push(e.index)}function OT(n,e,t,i,r,s,o){let a=i.length,c=null;for(let f=0;f<a;f++){let h=i[f];c===null&&us(h)&&(c=h,PT(n,t,f)),jS(ky(t,e),n,h.type)}VT(t,n.data.length,a),c?.viewProvidersResolver&&c.viewProvidersResolver(c);for(let f=0;f<a;f++){let h=i[f];h.providersResolver&&h.providersResolver(h)}let l=!1,u=!1,d=p0(n,e,a,null);a>0&&(t.directiveToIndex=new Map);for(let f=0;f<a;f++){let h=i[f];if(t.mergedAttrs=iu(t.mergedAttrs,h.hostAttrs),FT(n,t,e,d,h),UT(d,h,r),o!==null&&o.has(h)){let[_,m]=o.get(h);t.directiveToIndex.set(h.type,[d,_+t.directiveStart,m+t.directiveStart])}else(s===null||!s.has(h))&&t.directiveToIndex.set(h.type,d);h.contentQueries!==null&&(t.flags|=4),(h.hostBindings!==null||h.hostAttrs!==null||h.hostVars!==0)&&(t.flags|=64);let g=h.type.prototype;!l&&(g.ngOnChanges||g.ngOnInit||g.ngDoCheck)&&((n.preOrderHooks??=[]).push(t.index),l=!0),!u&&(g.ngOnChanges||g.ngDoCheck)&&((n.preOrderCheckHooks??=[]).push(t.index),u=!0),d++}LT(n,t,s)}function LT(n,e,t){for(let i=e.directiveStart;i<e.directiveEnd;i++){let r=n.data[i];if(t===null||!t.has(r))_y(0,e,r,i),_y(1,e,r,i),yy(e,i,!1);else{let s=t.get(r);vy(0,e,s,i),vy(1,e,s,i),yy(e,i,!0)}}}function _y(n,e,t,i){let r=n===0?t.inputs:t.outputs;for(let s in r)if(Object.hasOwn(r,s)){let o;n===0?o=e.inputs??={}:o=e.outputs??={},o[s]??=[],o[s].push(i),H0(e,s)}}function vy(n,e,t,i){let r=n===0?t.inputs:t.outputs;for(let s in r)if(Object.hasOwn(r,s)){let o=r[s],a;n===0?a=e.hostDirectiveInputs??={}:a=e.hostDirectiveOutputs??={},a[o]??=[],a[o].push(i,s),H0(e,o)}}function H0(n,e){e==="class"?n.flags|=8:e==="style"&&(n.flags|=16)}function yy(n,e,t){let{attrs:i,inputs:r,hostDirectiveInputs:s}=n;if(i===null||!t&&r===null||t&&s===null||jp(n)){n.initialInputs??=[],n.initialInputs.push(null);return}let o=null,a=0;for(;a<i.length;){let c=i[a];if(c===0){a+=4;continue}else if(c===5){a+=2;continue}else if(typeof c=="number")break;if(!t&&Object.hasOwn(r,c)){let l=r[c];for(let u of l)if(u===e){o??=[],o.push(c,i[a+1]);break}}else if(t&&Object.hasOwn(s,c)){let l=s[c];for(let u=0;u<l.length;u+=2)if(l[u]===e){o??=[],o.push(l[u+1],i[a+1]);break}}a+=2}n.initialInputs??=[],n.initialInputs.push(o)}function FT(n,e,t,i,r){n.data[i]=r;let s=r.factory||(r.factory=Qs(r.type,!0)),o=new Da(s,us(r),V0,null);n.blueprint[i]=o,t[i]=o,kT(n,e,i,p0(n,t,r.hostVars,Zi),r)}function kT(n,e,t,i,r){let s=r.hostBindings;if(s){let o=n.hostBindingOpCodes;o===null&&(o=n.hostBindingOpCodes=[]);let a=~e.index;BT(o)!=a&&o.push(a),o.push(t,i,s)}}function BT(n){let e=n.length;for(;e>0;){let t=n[--e];if(typeof t=="number"&&t<0)return t}return 0}function UT(n,e,t){if(t){if(e.exportAs)for(let i=0;i<e.exportAs.length;i++)t[e.exportAs[i]]=n;us(e)&&(t[""]=n)}}function VT(n,e,t){n.flags|=1,n.directiveStart=e,n.directiveEnd=e+t,n.providerIndexes=e}function z0(n,e,t,i,r,s,o,a){let c=e[Te],l=c.consts,u=Si(l,o),d=du(c,n,t,i,u);return s&&RT(c,e,d,Si(l,a),r),d.mergedAttrs=iu(d.mergedAttrs,d.attrs),d.attrs!==null&&Zl(d,d.attrs,!1),d.mergedAttrs!==null&&Zl(d,d.mergedAttrs,!0),c.queries!==null&&c.queries.elementStart(c,d),d}function G0(n,e){OS(n,e),kh(e)&&n.queries.elementEnd(e)}function HT(n,e,t,i,r,s){let o=e.consts,a=Si(o,r),c=du(e,n,t,i,a);if(c.mergedAttrs=iu(c.mergedAttrs,c.attrs),s!=null){let l=Si(o,s);c.localNames=[];for(let u=0;u<l.length;u+=2)c.localNames.push(l[u],-1)}return c.attrs!==null&&Zl(c,c.attrs,!1),c.mergedAttrs!==null&&Zl(c,c.mergedAttrs,!0),e.queries!==null&&e.queries.elementStart(e,c),c}var W0=typeof ShadowRoot<"u",zT=typeof Document<"u";function GT(n){return Object.keys(n).map(e=>{let[t,i,r]=n[e],s={propName:t,templateName:e,isSignal:(i&cu.SignalBased)!==0};return r&&(s.transform=r),s})}function WT(n){return Object.keys(n).map(e=>({propName:n[e],templateName:e}))}function jT(n,e,t){let i=e instanceof si?e:e?.injector;return i&&n.getStandaloneInjector!==null&&(i=n.getStandaloneInjector(i)||i),i?new Yl(t,i):t}function $T(n){let e=n.get(hs,null);if(e===null)throw new We(407,!1);let t=n.get(k0,null),i=n.get(no,null),r=n.get(ms,null,{optional:!0});return{rendererFactory:e,sanitizer:t,changeDetectionScheduler:i,ngReflect:!1,tracingService:r}}function qT(n,e,t){let i=j0(n);return i0(e,i,i==="svg"?bv:i==="math"?Sv:t)}function XT(n){if((n&&"localName"in n&&typeof n.localName=="string"?n.localName:n?.tagName)?.toLowerCase()==="script")throw new We(905,!1)}function j0(n){return(n.selectors[0][0]||"div").toLowerCase()}var La=class{componentDef;ngModule;selector;componentType;ngContentSelectors;isBoundToModule;cachedInputs=null;cachedOutputs=null;get inputs(){return this.cachedInputs??=GT(this.componentDef.inputs),this.cachedInputs}get outputs(){return this.cachedOutputs??=WT(this.componentDef.outputs),this.cachedOutputs}constructor(e,t){this.componentDef=e,this.ngModule=t,this.componentType=e.type,this.selector=yw(e.selectors),this.ngContentSelectors=e.ngContentSelectors??[],this.isBoundToModule=!!t}create(e,t,i,r,s,o,a,c){lt(tt.DynamicComponentStart);let l=we(null);try{let u=this.componentDef,d=jT(u,r||this.ngModule,e),f=$T(d),h=f.tracingService;return h&&h.componentCreate?h.componentCreate(B0(u),()=>this.createComponentRef(f,d,t,i,s,o,a,c)):this.createComponentRef(f,d,t,i,s,o,a,c)}finally{we(l)}}createComponentRef(e,t,i,r,s,o,a,c){let l=this.componentDef,u=YT(r,l,o,s,c),d=e.rendererFactory.createRenderer(null,l),f=r?Gw(d,r,l.encapsulation,t):qT(l,d,a??null);XT(f);let h=t.get(gs,null),g=ZT(f,()=>t.get(Yn,null)??Yy());h&&h.addHost(g);let _=o?.some(xy)||s?.some(E=>typeof E!="function"&&E.bindings.some(xy)),m=Qp(null,u,null,512|h0(l),null,null,e,d,t,null,e0(f,t,!0));h&&W0&&g instanceof ShadowRoot&&Dl(m,()=>{h.removeHost(g)}),m[jt]=f,Pl(m);let p=null;try{let E=z0(jt,m,2,"#host",()=>u.directiveRegistry,!0,0);o0(d,f,E),_o(f,m),_0(u,m,E),n0(u,E,m),G0(u,E),i!==void 0&&KT(E,this.ngContentSelectors,i),p=bi(E.index,m),m[Ct]=p[Ct],im(u,m,null)}catch(E){throw p!==null&&mp(p),mp(m),E}finally{lt(tt.DynamicComponentEnd),Ol()}return new Jl(this.componentType,m,!!_)}};function YT(n,e,t,i,r){let s=n?["ng-version","22.2.5"]:xw(e.selectors[0]),o=null,a=null,c=0;if(t)for(let d of t)c+=d[wp].requiredVars,d.create&&(d.targetIdx=0,(o??=[]).push(d)),d.update&&(d.targetIdx=0,(a??=[]).push(d));if(i)for(let d=0;d<i.length;d++){let f=i[d];if(typeof f!="function")for(let h of f.bindings){c+=h[wp].requiredVars;let g=d+1;h.create&&(h.targetIdx=g,(o??=[]).push(h)),h.update&&(h.targetIdx=g,(a??=[]).push(h))}}let l=[e];if(i)for(let d of i){let f=typeof d=="function"?d:d.type,h=vl(f);l.push(h)}return Kp(0,null,JT(o,a),1,c,l,null,null,null,[s],null)}function ZT(n,e){let t=n.getRootNode?.();return zT&&t instanceof Document?t.head:t&&W0&&t instanceof ShadowRoot?t:e().head}function JT(n,e){return!n&&!e?null:t=>{if(t&1&&n)for(let i of n)i.create();if(t&2&&e)for(let i of e)i.update()}}function xy(n){let e=n[wp].kind;return e==="input"||e==="twoWay"}var Jl=class extends F0{_rootLView;_hasInputBindings;instance;hostView;changeDetectorRef;componentType;location;previousInputValues=null;_tNode;constructor(e,t,i){super(),this._rootLView=t,this._hasInputBindings=i,this._tNode=Cl(t[Te],jt),this.location=xo(this._tNode,t),this.instance=bi(this._tNode.index,t)[Ct],this.hostView=this.changeDetectorRef=new vo(t,void 0),this.componentType=e}setInput(e,t){this._hasInputBindings;let i=this._tNode;if(this.previousInputValues??=new Map,this.previousInputValues.has(e)&&Object.is(this.previousInputValues.get(e),t))return;let r=this._rootLView,s=nm(i,r[Te],r,e,t);this.previousInputValues.set(e,t);let o=bi(i.index,r);rm(o,1)}get injector(){return new Xi(this._tNode,this._rootLView)}destroy(){this.hostView.destroy()}onDestroy(e){this.hostView.onDestroy(e)}};function KT(n,e,t){let i=n.projection=[];for(let r=0;r<e.length;r++){let s=t[r];i.push(s!=null&&s.length?Array.from(s):null)}}var fu=(()=>{class n{static __NG_ELEMENT_ID__=QT}return n})();function QT(){let n=wi();return $0(n,rt())}var Tp=class n extends fu{_lContainer;_hostTNode;_hostLView;constructor(e,t,i){super(),this._lContainer=e,this._hostTNode=t,this._hostLView=i}get element(){return xo(this._hostTNode,this._hostLView)}get injector(){return new Xi(this._hostTNode,this._hostLView)}get parentInjector(){let e=Hp(this._hostTNode,this._hostLView);if(Oy(e)){let t=jl(e,this._hostLView),i=Wl(e),r=t[Te].data[i+8];return new Xi(r,t)}else return new Xi(null,this._hostLView)}clear(){for(;this.length>0;)this.remove(this.length-1)}get(e){let t=My(this._lContainer);return t!==null&&t[e]||null}get length(){return this._lContainer.length-It}createEmbeddedView(e,t,i){let r,s,o;typeof i=="number"?r=i:i!=null&&(r=i.index,s=i.injector,o=i.onError);let a=Sp(this._lContainer,e.ssrId),c=e.createEmbeddedViewImpl(t||{},s,a);return o&&(c._lView[Ma]=o),this.insertImpl(c,r,Ra(this._hostTNode,a)),c}createComponent(e,t,i,r,s,o,a){let c,l,u=t||{};c=u.index,i=u.injector,r=u.projectableNodes,s=u.environmentInjector||u.ngModuleRef,o=u.directives,a=u.bindings,l=u.onError;let d=new La(os(e)),f=i||this.parentInjector;if(!s&&d.ngModule==null){let E=this.parentInjector.get(si,null);E&&(s=E)}let h=os(d.componentType??{}),g=Sp(this._lContainer,h?.id??null),_=g?.firstChild??null,m=d.create(f,r,_,s,o,a,this._getHostElementNamespace());return l&&(m.hostView._lView[Ma]=l),this.insertImpl(m.hostView,c,Ra(this._hostTNode,g)),m}_getHostElementNamespace(){if(this._hostTNode.type&2){let e=this._hostTNode.parent??this._hostLView[mn];return e!==null&&e.type&2&&typeof e.value=="string"&&e.value.toLowerCase()==="foreignobject"?null:e?.namespace??null}return this._hostTNode.namespace}insert(e,t){return this.insertImpl(e,t,!0)}insertImpl(e,t,i){let r=e._lView;if(Tv(r)){let a=this.indexOf(e);if(a!==-1)this.detach(a);else{let c=r[Ot],l=new n(c,c[mn],c[Ot]);l.detach(l.indexOf(e))}}let s=this._adjustIndex(t),o=this._lContainer;return uu(o,r,s,i),e.attachToViewContainerRef(),Ah(up(o),s,e),e}move(e,t){return this.insert(e,t)}indexOf(e){let t=My(this._lContainer);return t!==null?t.indexOf(e):-1}remove(e){let t=this._adjustIndex(e,-1),i=Pa(this._lContainer,t);i&&(ga(up(this._lContainer),t),ou(i[Te],i))}detach(e){let t=this._adjustIndex(e,-1),i=Pa(this._lContainer,t);return i&&ga(up(this._lContainer),t)!=null?new vo(i):null}_adjustIndex(e,t=0){return e??this.length+t}};function My(n){return n[Ea]}function up(n){return n[Ea]||(n[Ea]=[])}function $0(n,e){let t,i=e[n.index];return Xn(i)?t=i:(t=R0(i,e,null,n),e[n.index]=t,em(e,t)),tC(t,e,n,i),new Tp(t,n,e)}function eC(n,e){let t=n[Ft],i=t.createComment(""),r=ai(e,n),s=t.parentNode(r);return fs(t,s,i,t.nextSibling(r),!1),i}var tC=rC,nC=()=>!1;function iC(n,e,t){return nC(n,e,t)}function rC(n,e,t,i){if(n[cs])return;let r;t.type&8?r=$t(i):r=eC(e,t),n[cs]=r}var Cp=class n{queryList;matches=null;constructor(e){this.queryList=e}clone(){return new n(this.queryList)}setDirty(){this.queryList.setDirty()}},Ip=class n{queries;constructor(e=[]){this.queries=e}createEmbeddedView(e){let t=e.queries;if(t!==null){let i=e.contentQueries!==null?e.contentQueries[0]:t.length,r=[];for(let s=0;s<i;s++){let o=t.getByIndex(s),a=this.queries[o.indexInDeclarationView];r.push(a.clone())}return new n(r)}return null}insertView(e){this.dirtyQueriesWithMatches(e)}detachView(e){this.dirtyQueriesWithMatches(e)}finishViewCreation(e){this.dirtyQueriesWithMatches(e)}dirtyQueriesWithMatches(e){for(let t=0;t<this.queries.length;t++)om(e,t).matches!==null&&this.queries[t].setDirty()}},Ap=class{flags;read;predicate;constructor(e,t,i=null){this.flags=t,this.read=i,typeof e=="string"?this.predicate=fC(e):this.predicate=e}},Dp=class n{queries;constructor(e=[]){this.queries=e}elementStart(e,t){for(let i=0;i<this.queries.length;i++)this.queries[i].elementStart(e,t)}elementEnd(e){for(let t=0;t<this.queries.length;t++)this.queries[t].elementEnd(e)}embeddedTView(e){let t=null;for(let i=0;i<this.length;i++){let r=t!==null?t.length:0,s=this.getByIndex(i).embeddedTView(e,r);s&&(s.indexInDeclarationView=i,t!==null?t.push(s):t=[s])}return t!==null?new n(t):null}template(e,t){for(let i=0;i<this.queries.length;i++)this.queries[i].template(e,t)}getByIndex(e){return this.queries[e]}get length(){return this.queries.length}track(e){this.queries.push(e)}},Rp=class n{metadata;matches=null;indexInDeclarationView=-1;crossesNgTemplate=!1;_declarationNodeIndex;_appliesToNextNode=!0;constructor(e,t=-1){this.metadata=e,this._declarationNodeIndex=t}elementStart(e,t){this.isApplyingToNode(t)&&this.matchTNode(e,t)}elementEnd(e){this._declarationNodeIndex===e.index&&(this._appliesToNextNode=!1)}template(e,t){this.elementStart(e,t)}embeddedTView(e,t){return this.isApplyingToNode(e)?(this.crossesNgTemplate=!0,this.addMatch(-e.index,t),new n(this.metadata)):null}isApplyingToNode(e){if(this._appliesToNextNode&&(this.metadata.flags&1)!==1){let t=this._declarationNodeIndex,i=e.parent;for(;i!==null&&i.type&8&&i.index!==t;)i=i.parent;return t===(i!==null?i.index:-1)}return this._appliesToNextNode}matchTNode(e,t){let i=this.metadata.predicate;if(Array.isArray(i))for(let r=0;r<i.length;r++){let s=i[r];this.matchTNodeWithReadOption(e,t,sC(t,s)),this.matchTNodeWithReadOption(e,t,zl(t,e,s,!1,!1))}else i===Oa?t.type&4&&this.matchTNodeWithReadOption(e,t,-1):this.matchTNodeWithReadOption(e,t,zl(t,e,i,!1,!1))}matchTNodeWithReadOption(e,t,i){if(i!==null){let r=this.metadata.read;if(r!==null)if(r===Ba||r===fu||r===ji||r===Oa&&t.type&4)this.addMatch(t.index,-2);else{let s=zl(t,e,r,!1,!1);s!==null&&this.addMatch(t.index,s)}else this.addMatch(t.index,i)}}addMatch(e,t){this.matches===null?this.matches=[e,t]:this.matches.push(e,t)}};function sC(n,e){let t=n.localNames;if(t!==null){for(let i=0;i<t.length;i+=2)if(t[i]===e)return t[i+1]}return null}function oC(n,e){return n.type&11?xo(n,e):n.type&4?sm(n,e):null}function aC(n,e,t,i){return t===-1?oC(e,n):t===-2?cC(n,e,i):$l(n,n[Te],t,e)}function cC(n,e,t){if(t===Ba)return xo(e,n);if(t===Oa)return sm(e,n);if(t===fu)return $0(e,n);if(t===ji)return new Xi(e,n)}function q0(n,e,t,i){let r=e[Ei].queries[i];if(r.matches===null){let s=n.data,o=t.matches,a=[];for(let c=0;o!==null&&c<o.length;c+=2){let l=o[c];if(l<0)a.push(null);else{let u=s[l];a.push(aC(e,u,o[c+1],t.metadata.read))}}r.matches=a}return r.matches}function Np(n,e,t,i){let r=n.queries.getByIndex(t),s=r.matches;if(s!==null){let o=q0(n,e,r,t);for(let a=0;a<s.length;a+=2){let c=s[a];if(c>0)i.push(o[a/2]);else{let l=s[a+1],u=e[-c];for(let d=It;d<u.length;d++){let f=u[d];f[yr]===f[Ot]&&Np(f[Te],f,l,i)}if(u[ls]!==null){let d=u[ls];for(let f=0;f<d.length;f++){let h=d[f];Np(h[Te],h,l,i)}}}}}return i}function lC(n,e){return n[Ei].queries[e].queryList}function uC(n,e,t){let i=new ql((t&4)===4);return Av(n,e,i,i.destroy),(e[Ei]??=new Ip).queries.push(new Cp(i))-1}function dC(n,e,t){let i=Pn();return i.firstCreatePass&&(hC(i,new Ap(n,e,t),-1),(e&2)===2&&(i.staticViewQueries=!0)),uC(i,rt(),e)}function fC(n){return n.split(",").map(e=>e.trim())}function hC(n,e,t){n.queries===null&&(n.queries=new Dp),n.queries.track(new Rp(e,t))}function om(n,e){return n.queries.getByIndex(e)}function pC(n,e){let t=n[Te],i=om(t,e);return i.crossesNgTemplate?Np(t,n,e,[]):q0(t,n,i,e)}function am(n){return!!n&&typeof n.then=="function"}function X0(n){return!!n&&typeof n.subscribe=="function"}var Kl=class{};var Fa=class extends Kl{injector;instance=null;constructor(e){super();let t=new rs([...e.providers,{provide:Kl,useValue:this}],e.parent||ya(),e.debugName,new Set(["environment"]));this.injector=t,e.runEnvironmentInitializers&&t.resolveInjectorInitializers()}destroy(){this.injector.destroy()}onDestroy(e){this.injector.onDestroy(e)}};function Y0(n,e,t=null){return new Fa({providers:n,parent:e,debugName:t,runEnvironmentInitializers:!0}).injector}var mC=(()=>{class n{_injector;cachedInjectors=new Map;constructor(t){this._injector=t}getOrCreateStandaloneInjector(t){if(!t.standalone)return null;if(!this.cachedInjectors.has(t)){let i=Nh(!1,t.type),r=i.length>0?Y0([i],this._injector,""):null;this.cachedInjectors.set(t,r)}return this.cachedInjectors.get(t)}ngOnDestroy(){try{for(let t of this.cachedInjectors.values())t!==null&&t.destroy()}finally{this.cachedInjectors.clear()}}static \u0275prov=Jt({token:n,providedIn:"environment",factory:()=>new n(it(si))})}return n})();function Ua(n){return Ny(()=>{let e=yC(n),t=hn(Wt({},e),{decls:n.decls,vars:n.vars,template:n.template,consts:n.consts||null,ngContentSelectors:n.ngContentSelectors,onPush:n.changeDetection!==zp.Eager,directiveDefs:null,pipeDefs:null,dependencies:e.standalone&&n.dependencies||null,getStandaloneInjector:e.standalone?r=>r.get(mC).getOrCreateStandaloneInjector(t):null,getExternalStyles:null,signals:n.signals??!1,data:n.data||{},encapsulation:n.encapsulation||li.Emulated,styles:n.styles||_r,_:null,schemas:n.schemas||null,tView:null,id:""});e.standalone&&Mo("NgStandalone"),xC(t);let i=n.dependencies;return t.directiveDefs=Ey(i,gC),t.pipeDefs=Ey(i,cv),t.id=MC(t),t})}function gC(n){return os(n)||vl(n)}function _C(n,e){if(n==null)return El;let t={};for(let i in n)if(Object.hasOwn(n,i)){let r=n[i],s,o,a,c;Array.isArray(r)?(a=r[0],s=r[1],o=r[2]??s,c=r[3]||null):(s=r,o=r,a=cu.None,c=null),t[s]=[i,a,c],e[s]=o}return t}function vC(n){if(n==null)return El;let e={};for(let t in n)Object.hasOwn(n,t)&&(e[n[t]]=t);return e}function yC(n){let e={};return{type:n.type,providersResolver:null,viewProvidersResolver:null,factory:null,hostBindings:n.hostBindings||null,hostVars:n.hostVars||0,hostAttrs:n.hostAttrs||null,contentQueries:n.contentQueries||null,declaredInputs:e,inputConfig:n.inputs||El,exportAs:n.exportAs||null,standalone:n.standalone??!0,signals:n.signals===!0,selectors:n.selectors||_r,viewQuery:n.viewQuery||null,features:n.features||null,setInput:null,resolveHostDirectives:null,hostDirectives:null,controlDef:null,signalFormsInputPresence:null,inputs:_C(n.inputs,e),outputs:vC(n.outputs),debugInfo:null}}function xC(n){n.features?.forEach(e=>e(n))}function Ey(n,e){return n?()=>{let t=typeof n=="function"?n():n,i=[];for(let r of t){let s=e(r);s!==null&&i.push(s)}return i}:null}function MC(n){let e=0,t=typeof n.consts=="function"?"":n.consts,i=[n.selectors,n.ngContentSelectors,n.hostVars,n.hostAttrs,t,n.vars,n.decls,n.encapsulation,n.standalone,n.signals,n.exportAs,JSON.stringify(n.inputs),JSON.stringify(n.outputs),Object.getOwnPropertyNames(n.type.prototype),!!n.contentQueries,!!n.viewQuery];for(let s of i.join("|"))e=Math.imul(31,e)+s.charCodeAt(0)<<0;return e+=2147483648,"c"+e}var Z0=new Ke("");var cm=(()=>{class n{resolve;reject;initialized=!1;done=!1;donePromise=new Promise((t,i)=>{this.resolve=t,this.reject=i});appInits=mt(Z0,{optional:!0})??[];injector=mt(ji);constructor(){}runInitializers(){if(this.initialized)return;let t=[];for(let r of this.appInits){let s=bl(this.injector,r);if(am(s))t.push(s);else if(X0(s)){let o=new Promise((a,c)=>{s.subscribe({complete:a,error:c})});t.push(o)}}let i=()=>{this.done=!0,this.resolve()};Promise.all(t).then(()=>{i()}).catch(r=>{this.reject(r)}),t.length===0&&i(),this.initialized=!0}static \u0275fac=function(i){return new(i||n)};static \u0275prov=ru({token:n,factory:n.\u0275fac})}return n})();function EC(n,e,t,i,r,s,o,a){if(t.firstCreatePass){n.mergedAttrs=iu(n.mergedAttrs,n.attrs);let u=n.tView=Kp(2,n,r,s,o,t.directiveRegistry,t.pipeRegistry,null,t.schemas,t.consts,null);t.queries!==null&&(t.queries.template(t,n),u.queries=t.queries.embeddedTView(n))}a&&(n.flags|=a),lo(n,!1);let c=bC(t,e,n,i);Ll()&&Zp(t,e,c,n),_o(c,e);let l=R0(c,e,c,n);e[i+jt]=l,em(e,l),iC(l,n,e)}function Ql(n,e,t,i,r,s,o,a,c,l,u){let d=t+jt,f;if(e.firstCreatePass){if(f=du(e,d,4,o||null,a||null),l!=null){let h=Si(e.consts,l);f.localNames=[];for(let g=0;g<h.length;g+=2)f.localNames.push(h[g],-1)}}else f=e.data[d];return EC(f,n,e,t,i,r,s,c),l!=null&&tm(n,f,u),f}var bC=SC;function SC(n,e,t,i){return Fl(!0),e[Ft].createComment("")}var lm=new Ke("");var J0=new Ke("");function K0(){jf(n=>{let e="";throw new We(-600,e)})}var wC=10;var hu=(()=>{class n{_runningTick=!1;_destroyed=!1;_destroyListeners=[];_views=[];internalErrorHandler=mt(ho);afterRenderManager=mt(l0);zonelessEnabled=mt(Ca);rootEffectScheduler=mt(sp);dirtyFlags=0;tracingSnapshot=null;allTestViews=new Set;autoDetectTestViews=new Set;includeAllTestViews=!1;afterTick=new $n;get allViews(){return[...(this.includeAllTestViews?this.allTestViews:this.autoDetectTestViews).keys(),...this._views]}get destroyed(){return this._destroyed}componentTypes=[];components=[];internalPendingTask=mt(fo);get isStable(){return this.internalPendingTask.hasPendingTasksObservable.pipe(nh(t=>!t))}constructor(){mt(ms,{optional:!0})}whenStable(){let t;return new Promise(i=>{t=this.isStable.subscribe({next:r=>{r&&i()}})}).finally(()=>{t.unsubscribe()})}_injector=mt(si);_rendererFactory=null;get injector(){return this._injector}bootstrap(t,i){return this.bootstrapImpl(t,i)}bootstrapImpl(t,i,r=ji.NULL){return this._injector.get(Dn).run(()=>{if(lt(tt.BootstrapComponentStart),!this._injector.get(cm).done){let p="";throw new We(405,p)}let a=os(t),c=this._injector.get(Kl),l=new La(a,c);this.componentTypes.push(t);let{hostElement:u,directives:d,bindings:f}=TC(i),h=u||l.selector,g=l.create(r,[],h,c.injector,d,f),_=g.location.nativeElement,m=g.injector.get(lm,null);return m?.registerApplication(_),g.onDestroy(()=>{this.detachView(g.hostView),Aa(this.components,g),m?.unregisterApplication(_)}),this._loadComponent(g),lt(tt.BootstrapComponentEnd,g),g})}tick(){this.zonelessEnabled||(this.dirtyFlags|=1),this._tick()}_tick(){lt(tt.ChangeDetectionStart),this.tracingSnapshot!==null?this.tracingSnapshot.run(Xp.CHANGE_DETECTION,this.tickImpl):this.tickImpl()}tickImpl=()=>{if(this._runningTick)throw lt(tt.ChangeDetectionEnd),new We(101,!1);let t=we(null);try{this._runningTick=!0,this.synchronize()}finally{this._runningTick=!1,this.tracingSnapshot?.dispose(),this.tracingSnapshot=null,we(t),this.afterTick.next(),lt(tt.ChangeDetectionEnd)}};synchronize(){this._rendererFactory===null&&!this._injector.destroyed&&(this._rendererFactory=this._injector.get(hs,null,{optional:!0}));let t=0;for(;this.dirtyFlags!==0&&t++<wC;){lt(tt.ChangeDetectionSyncStart);try{this.synchronizeOnce()}finally{lt(tt.ChangeDetectionSyncEnd)}}}synchronizeOnce(){this.dirtyFlags&16&&(this.dirtyFlags&=-17,this.rootEffectScheduler.flush());let t=!1;if(this.dirtyFlags&7){let i=!!(this.dirtyFlags&1);this.dirtyFlags&=-8,this.dirtyFlags|=8;for(let{_lView:r}of this.allViews){if(!i&&!ba(r))continue;let s=i&&!this.zonelessEnabled?0:1;T0(r,s),t=!0}if(this.dirtyFlags&=-5,this.syncDirtyFlagsWithViews(),this.dirtyFlags&23)return}t||(this._rendererFactory?.begin?.(),this._rendererFactory?.end?.()),this.dirtyFlags&8&&(this.dirtyFlags&=-9,this.afterRenderManager.execute()),this.syncDirtyFlagsWithViews()}syncDirtyFlagsWithViews(){if(this.allViews.some(({_lView:t})=>ba(t))){this.dirtyFlags|=2;return}else this.dirtyFlags&=-8}attachView(t){let i=t;this._views.push(i),i.attachToAppRef(this)}detachView(t){let i=t;Aa(this._views,i),i.detachFromAppRef()}_loadComponent(t){this.attachView(t.hostView);try{this.tick()}catch(r){this.internalErrorHandler(r)}this.components.push(t),this._injector.get(J0,[]).forEach(r=>r(t))}ngOnDestroy(){if(!this._destroyed)try{this._destroyListeners.forEach(t=>t()),this._views.slice().forEach(t=>t.destroy())}finally{this._destroyed=!0,this._views=[],this._destroyListeners=[]}}onDestroy(t){return this._destroyListeners.push(t),()=>Aa(this._destroyListeners,t)}destroy(){if(this._destroyed)throw new We(406,!1);let t=this._injector;t.destroy&&!t.destroyed&&t.destroy()}get viewCount(){return this._views.length}static \u0275fac=function(i){return new(i||n)};static \u0275prov=ru({token:n,factory:n.\u0275fac})}return n})();function TC(n){return n===void 0||typeof n=="string"||n instanceof Element?{hostElement:n}:n}function Aa(n,e){let t=n.indexOf(e);t>-1&&n.splice(t,1)}function cn(n,e,t,i){let r=rt(),s=uo();if(Eo(r,s,e)){let o=Pn(),a=Qh();eT(a,r,n,e,t,i)}return cn}var Pp=class{destroy(e){}updateValue(e,t){}swap(e,t){let i=Math.min(e,t),r=Math.max(e,t),s=this.detach(r);if(r-i>1){let o=this.detach(i);this.attach(i,s),this.attach(r,o)}else this.attach(i,s)}move(e,t){this.attach(t,this.detach(e))}};function dp(n,e,t,i,r){return n===t&&Object.is(e,i)?1:Object.is(r(n,e),r(t,i))?-1:0}function CC(n,e,t,i){let r,s,o=0,a=n.length-1,c=void 0;if(Array.isArray(e)){we(i);let l=e.length-1;for(we(null);o<=a&&o<=l;){let u=n.at(o),d=e[o],f=dp(o,u,o,d,t);if(f!==0){f<0&&n.updateValue(o,d),o++;continue}let h=n.at(a),g=e[l],_=dp(a,h,l,g,t);if(_!==0){_<0&&n.updateValue(a,g),a--,l--;continue}let m=t(o,u),p=t(a,h),E=t(o,d);if(Object.is(E,p)){let S=t(l,g);Object.is(S,m)?(n.swap(o,a),n.updateValue(a,g),l--,a--):n.move(a,o),n.updateValue(o,d),o++;continue}if(r??=new eu,s??=Sy(n,o,a,t),Op(n,r,o,E))n.updateValue(o,d),o++,a++;else if(s.has(E))r.set(m,n.detach(o)),a--;else{let S=n.create(o,e[o]);n.attach(o,S),o++,a++}}for(;o<=l;)by(n,r,t,o,e[o]),o++}else if(e!=null){we(i);let l=e[Symbol.iterator]();we(null);let u=l.next();for(;!u.done&&o<=a;){let d=n.at(o),f=u.value,h=dp(o,d,o,f,t);if(h!==0)h<0&&n.updateValue(o,f),o++,u=l.next();else{r??=new eu,s??=Sy(n,o,a,t);let g=t(o,f);if(Op(n,r,o,g))n.updateValue(o,f),o++,a++,u=l.next();else if(!s.has(g))n.attach(o,n.create(o,f)),o++,a++,u=l.next();else{let _=t(o,d);r.set(_,n.detach(o)),a--}}}for(;!u.done;)by(n,r,t,n.length,u.value),u=l.next()}for(;o<=a;)n.destroy(n.detach(a--));r?.forEach(l=>{n.destroy(l)})}function Op(n,e,t,i){return e!==void 0&&e.has(i)?(n.attach(t,e.get(i)),e.delete(i),!0):!1}function by(n,e,t,i,r){if(Op(n,e,i,t(i,r)))n.updateValue(i,r);else{let s=n.create(i,r);n.attach(i,s)}}function Sy(n,e,t,i){let r=new Set;for(let s=e;s<=t;s++)r.add(i(s,n.at(s)));return r}var eu=class{kvMap=new Map;_vMap=void 0;has(e){return this.kvMap.has(e)}delete(e){if(!this.has(e))return!1;let t=this.kvMap.get(e);return this._vMap!==void 0&&this._vMap.has(t)?(this.kvMap.set(e,this._vMap.get(t)),this._vMap.delete(t)):this.kvMap.delete(e),!0}get(e){return this.kvMap.get(e)}set(e,t){if(this.kvMap.has(e)){let i=this.kvMap.get(e);this._vMap===void 0&&(this._vMap=new Map);let r=this._vMap;for(;r.has(i);)i=r.get(i);r.set(i,t)}else this.kvMap.set(e,t)}forEach(e){for(let[t,i]of this.kvMap)if(e(i,t),this._vMap!==void 0){let r=this._vMap;for(;r.has(i);)i=r.get(i),e(i,t)}}};function Va(n,e,t,i,r,s,o,a){Mo("NgControlFlow");let c=rt(),l=Pn(),u=Si(l.consts,s);return Ql(c,l,n,e,t,i,r,u,256,o,a),um}function um(n,e,t,i,r,s,o,a){return Mo("NgControlFlow"),IC(n,e,t,i,r,s,o,a),um}function IC(n,e,t,i,r,s,o,a){let c=rt(),l=Pn(),u=Si(l.consts,s);Ql(c,l,n,e,t,i,r,u,512,o,a)}function Ha(n,e){Mo("NgControlFlow");let t=rt(),i=uo(),r=t[i]!==Zi?t[i]:-1,s=r!==-1?tu(t,jt+r):void 0,o=0;if(Eo(t,i,n)){let a=we(null);try{if(s!==void 0&&P0(s,o),n!==-1){let c=jt+n,l=tu(t,c),u=Bp(t[Te],c),d=L0(l,u,t),f=lu(t,u,e,{dehydratedView:d});uu(l,f,o,Ra(u,d))}}finally{we(a)}}else if(s!==void 0){let a=N0(s,o);a!==void 0&&(a[Ct]=e)}}var Lp=class{lContainer;$implicit;$index;constructor(e,t,i){this.lContainer=e,this.$implicit=t,this.$index=i}get $count(){return this.lContainer.length-It}};var Fp=class{hasEmptyBlock;trackByFn;liveCollection;constructor(e,t,i){this.hasEmptyBlock=e,this.trackByFn=t,this.liveCollection=i}};function pu(n,e,t,i,r,s,o,a,c,l,u,d,f){Mo("NgControlFlow");let h=rt(),g=Pn(),_=c!==void 0,m=rt(),p=a?o.bind(m[Rn][Ct]):o,E=new Fp(_,p);m[jt+n]=E,Ql(h,g,n+1,e,t,i,r,Si(g.consts,s),256),_&&Ql(h,g,n+2,c,l,u,d,Si(g.consts,f),512)}var kp=class extends Pp{lContainer;hostLView;templateTNode;operationsCounter=void 0;needsIndexUpdate=!1;constructor(e,t,i){super(),this.lContainer=e,this.hostLView=t,this.templateTNode=i}get length(){return this.lContainer.length-It}at(e){return this.getLView(e)[Ct].$implicit}attach(e,t){let i=t[ro];this.needsIndexUpdate||=e!==this.length,uu(this.lContainer,t,e,Ra(this.templateTNode,i)),AC(this.lContainer,e)}detach(e){return this.needsIndexUpdate||=e!==this.length-1,DC(this.lContainer,e),RC(this.lContainer,e)}create(e,t){let i=Sp(this.lContainer,this.templateTNode.tView.ssrId);return lu(this.hostLView,this.templateTNode,new Lp(this.lContainer,t,e),{dehydratedView:i})}destroy(e){ou(e[Te],e)}updateValue(e,t){this.getLView(e)[Ct].$implicit=t}reset(){this.needsIndexUpdate=!1}updateIndexes(){if(this.needsIndexUpdate)for(let e=0;e<this.length;e++)this.getLView(e)[Ct].$index=e}getLView(e){return NC(this.lContainer,e)}};function mu(n){let e=we(null),t=Sr();try{let i=rt(),r=i[Te],s=i[t],o=t+1,a=tu(i,o);if(s.liveCollection===void 0){let l=Bp(r,o);s.liveCollection=new kp(a,i,l)}else s.liveCollection.reset();let c=s.liveCollection;if(CC(c,n,s.trackByFn,e),c.updateIndexes(),s.hasEmptyBlock){let l=uo(),u=c.length===0;if(Eo(i,l,u)){let d=t+2,f=tu(i,d);if(u){let h=Bp(r,d),g=L0(f,h,i),_=lu(i,h,void 0,{dehydratedView:g});uu(f,_,0,Ra(h,g))}else r.firstUpdatePass&&ST(f),P0(f,0)}}}finally{we(e)}}function tu(n,e){return n[e]}function AC(n,e){if(n.length<=It)return;let t=It+e,i=n[t];i&&ww(i)}function DC(n,e){if(n.length<=It)return;let t=It+e,i=n[t];i&&Sw(i)}function RC(n,e){return Pa(n,e)}function NC(n,e){return N0(n,e)}function Bp(n,e){return Cl(n,e)}function gu(n,e,t){let i=rt(),r=uo();if(Eo(i,r,e)){let s=Pn(),o=Qh();qw(o,i,n,e,i[Ft],t)}return gu}function wy(n,e,t,i,r){nm(e,n,t,r?"class":"style",i)}function je(n,e,t,i){let r=rt(),s=r[Te],o=n+jt,a=s.firstCreatePass?z0(o,r,2,e,Qw,Nv(),t,i):s.data[o];if(Mr(a)){let c=r[Mi].tracingService;if(c&&c.componentCreate){let l=s.data[a.directiveStart+a.componentOffset];return c.componentCreate(B0(l),()=>(Ty(n,e,r,a,i),je))}}return Ty(n,e,r,a,i),je}function Ty(n,e,t,i,r){if(y0(i,t,n,e,Q0),Tl(i)){let s=t[Te];_0(s,t,i),n0(s,i,t)}r!=null&&tm(t,i)}function ft(){let n=Pn(),e=wi(),t=x0(e);return n.firstCreatePass&&G0(n,t),Wh(t)&&jh(),Gh(),t.classesWithoutHost!=null&&FS(t)&&wy(n,t,rt(),t.classesWithoutHost,!0),t.stylesWithoutHost!=null&&kS(t)&&wy(n,t,rt(),t.stylesWithoutHost,!1),ft}function gn(n,e,t,i){return je(n,e,t,i),ft(),gn}function za(n,e,t,i){let r=rt(),s=r[Te],o=n+jt,a=s.firstCreatePass?HT(o,s,2,e,t,i):s.data[o];return y0(a,r,n,e,Q0),i!=null&&tm(r,a),za}function Ga(){let n=wi(),e=x0(n);return Wh(e)&&jh(),Gh(),Ga}function _u(n,e,t,i){return za(n,e,t,i),Ga(),_u}var Q0=(n,e,t,i,r)=>(Fl(!0),i0(e[Ft],i,ep()));function Wa(){return rt()}var ja="en-US";var PC=ja;function ex(n){typeof n=="string"&&(PC=n.toLowerCase().replace(/_/g,"-"))}function Ci(n,e,t){let i=rt(),r=Pn(),s=wi();return OC(r,i,i[Ft],s,n,e,t),Ci}function OC(n,e,t,i,r,s,o){let a=!0,c=null;if((i.type&3||o)&&(c??=lp(i,e,s),IT(i,n,e,o,t,r,s,c)&&(a=!1)),a){let l=i.outputs?.[r],u=i.hostDirectiveOutputs?.[r];if(u&&u.length)for(let d=0;d<u.length;d+=2){let f=u[d],h=u[d+1];c??=lp(i,e,s),gy(i,e,f,h,r,c)}if(l&&l.length)for(let d of l)c??=lp(i,e,s),gy(i,e,d,r,r,c)}}function _n(n=1){return jv(n)}function bo(n,e,t){return dC(n,e,t),bo}function Ji(n){let e=rt(),t=Pn(),i=Zh();Nl(i+1);let r=om(t,i);if(n.dirty&&wv(e)===((r.metadata.flags&2)===2)){if(r.matches===null)n.reset([]);else{let s=pC(e,i);n.reset(s,JS),n.notifyOnChanges()}return!0}return!1}function Ki(){return lC(rt(),Zh())}function Ul(n,e){return n<<17|e<<2}function ps(n){return n>>17&32767}function LC(n){return(n&2)==2}function FC(n,e){return n&131071|e<<17}function Up(n){return n|2}function yo(n){return(n&131068)>>2}function fp(n,e){return n&-131069|e<<2}function kC(n){return(n&1)===1}function Vp(n){return n|1}function BC(n,e,t,i,r,s){let o=s?e.classBindings:e.styleBindings,a=ps(o),c=yo(o);n[i]=t;let l=!1,u;if(Array.isArray(t)){let d=t;u=d[1],(u===null||io(d,u)>0)&&(l=!0)}else u=t;if(r)if(c!==0){let f=ps(n[a+1]);n[i+1]=Ul(f,a),f!==0&&(n[f+1]=fp(n[f+1],i)),n[a+1]=FC(n[a+1],i)}else n[i+1]=Ul(a,0),a!==0&&(n[a+1]=fp(n[a+1],i)),a=i;else n[i+1]=Ul(c,0),a===0?a=i:n[c+1]=fp(n[c+1],i),c=i;l&&(n[i+1]=Up(n[i+1])),Cy(n,u,i,!0),Cy(n,u,i,!1),UC(e,u,n,i,s),o=Ul(a,c),s?e.classBindings=o:e.styleBindings=o}function UC(n,e,t,i,r){let s=r?n.residualClasses:n.residualStyles;s!=null&&typeof e=="string"&&io(s,e)>=0&&(t[i+1]=Vp(t[i+1]))}function Cy(n,e,t,i){let r=n[t+1],s=e===null,o=i?ps(r):yo(r),a=!1;for(;o!==0&&(a===!1||s);){let c=n[o],l=n[o+1];VC(c,e)&&(a=!0,n[o+1]=i?Vp(l):Up(l)),o=i?ps(l):yo(l)}a&&(n[t+1]=i?Up(r):Vp(r))}function VC(n,e){return n===null||e==null||(Array.isArray(n)?n[1]:n)===e?!0:Array.isArray(n)&&typeof e=="string"?io(n,e)>=0:!1}function ui(n,e){return HC(n,e,null,!0),ui}function HC(n,e,t,i){let r=rt(),s=Pn(),o=kv(2);if(s.firstUpdatePass&&GC(s,n,o,i),e!==Zi&&Eo(r,o,e)){let a=s.data[Sr()];XC(s,a,r,r[Ft],n,r[o+1]=YC(e,t),i,o)}}function zC(n,e){return e>=n.expandoStartIndex}function GC(n,e,t,i){let r=n.data;if(r[t+1]===null){let s=r[Sr()],o=zC(n,t);ZC(s,i)&&e===null&&!o&&(e=!1),e=WC(r,s,e,i),BC(r,s,e,t,o,i)}}function WC(n,e,t,i){let r=Hv(n),s=i?e.residualClasses:e.residualStyles;if(r===null)(i?e.classBindings:e.styleBindings)===0&&(t=hp(null,n,e,t,i),t=ka(t,e.attrs,i),s=null);else{let o=e.directiveStylingLast;if(o===-1||n[o]!==r)if(t=hp(r,n,e,t,i),s===null){let c=jC(n,e,i);c!==void 0&&Array.isArray(c)&&(c=hp(null,n,e,c[1],i),c=ka(c,e.attrs,i),$C(n,e,i,c))}else s=qC(n,e,i)}return s!==void 0&&(i?e.residualClasses=s:e.residualStyles=s),t}function jC(n,e,t){let i=t?e.classBindings:e.styleBindings;if(yo(i)!==0)return n[ps(i)]}function $C(n,e,t,i){let r=t?e.classBindings:e.styleBindings;n[ps(r)]=i}function qC(n,e,t){let i,r=e.directiveEnd;for(let s=1+e.directiveStylingLast;s<r;s++){let o=n[s].hostAttrs;i=ka(i,o,t)}return ka(i,e.attrs,t)}function hp(n,e,t,i,r){let s=null,o=t.directiveEnd,a=t.directiveStylingLast;for(a===-1?a=t.directiveStart:a++;a<o&&(s=e[a],i=ka(i,s.hostAttrs,r),s!==n);)a++;return n!==null&&(t.directiveStylingLast=a),i}function ka(n,e,t){let i=t?1:2,r=-1;if(e!==null)for(let s=0;s<e.length;s++){let o=e[s];typeof o=="number"?r=o:r===i&&(Array.isArray(n)||(n=n===void 0?[]:["",n]),mv(n,o,t?!0:e[++s]))}return n===void 0?null:n}function XC(n,e,t,i,r,s,o,a){if(!(e.type&3))return;let c=n.data,l=c[a+1],u=kC(l)?Iy(c,e,t,r,yo(l),o):void 0;if(!nu(u)){nu(s)||LC(l)&&(s=Iy(c,null,t,r,a,o));let d=Bh(Sr(),t);Uw(i,o,d,r,s)}}function Iy(n,e,t,i,r,s){let o=e===null,a;for(;r>0;){let c=n[r],l=Array.isArray(c),u=l?c[1]:c,d=u===null,f=t[r+1];f===Zi&&(f=d?_r:void 0);let h=d?Ml(f,i):u===i?f:void 0;if(l&&!nu(h)&&(h=Ml(c,i)),nu(h)&&(a=h,o))return a;let g=n[r+1];r=o?ps(g):yo(g)}if(e!==null){let c=s?e.residualClasses:e.residualStyles;c!=null&&(a=Ml(c,i))}return a}function nu(n){return n!==void 0}function YC(n,e){return n==null||n===""||(typeof e=="string"?n=Xl(n)+e:typeof n=="object"&&(n=pl(Xl(n)))),n}function ZC(n,e){return(n.flags&(e?8:16))!==0}function At(n,e=""){let t=rt(),i=Pn(),r=n+jt,s=i.firstCreatePass?du(i,r,1,e,null):i.data[r],o=JC(i,t,s,e);t[r]=o,Ll()&&Zp(i,t,o,s),lo(s,!1)}var JC=(n,e,t,i)=>(Fl(!0),ow(e[Ft],i));function KC(n,e,t,i=""){return Eo(n,uo(),t)?e+Th(t)+i:Zi}function On(n){return Tr("",n),On}function Tr(n,e,t){let i=rt(),r=KC(i,n,e,t);return r!==Zi&&QC(i,Sr(),r),Tr}function QC(n,e,t){let i=Bh(e,n);aw(n[Ft],i,t)}var tx=(()=>{class n{applicationErrorHandler=mt(ho);appRef=mt(hu);taskService=mt(fo);ngZone=mt(Dn);zonelessEnabled=mt(Ca);tracing=mt(ms,{optional:!0});zoneIsDefined=typeof Zone<"u"&&!!Zone.root.run;schedulerTickApplyArgs=[{data:{__scheduler_tick__:!0}}];subscriptions=new an;angularZoneId=this.zoneIsDefined?this.ngZone._inner?.get(pa):null;scheduleInRootZone=!this.zonelessEnabled&&this.zoneIsDefined&&(mt(rp,{optional:!0})??!1);cancelScheduledCallback=null;useMicrotaskScheduler=!1;runningTick=!1;pendingRenderTaskId=null;constructor(){this.subscriptions.add(this.appRef.afterTick.subscribe(()=>{let t=this.taskService.add();if(!this.runningTick&&(this.cleanup(),!this.zonelessEnabled||this.appRef.includeAllTestViews)){this.taskService.remove(t);return}this.switchToMicrotaskScheduler(),this.taskService.remove(t)})),this.subscriptions.add(this.ngZone.onUnstable.subscribe(()=>{this.runningTick||this.cleanup()}))}switchToMicrotaskScheduler(){this.ngZone.runOutsideAngular(()=>{let t=this.taskService.add();this.useMicrotaskScheduler=!0,queueMicrotask(()=>{this.useMicrotaskScheduler=!1,this.taskService.remove(t)})})}notify(t){if(!this.zonelessEnabled&&t===5)return;switch(t){case 0:case 2:{this.appRef.dirtyFlags|=2;break}case 3:case 4:case 5:case 1:{this.appRef.dirtyFlags|=4;break}case 6:{this.appRef.dirtyFlags|=2;break}case 12:{this.appRef.dirtyFlags|=16;break}case 13:{this.appRef.dirtyFlags|=2;break}case 11:break;default:this.appRef.dirtyFlags|=8}if(this.appRef.tracingSnapshot=this.tracing?.snapshot(this.appRef.tracingSnapshot)??null,!this.shouldScheduleTick())return;let i=this.useMicrotaskScheduler?Zv:tp;this.pendingRenderTaskId=this.taskService.add(),this.scheduleInRootZone?this.cancelScheduledCallback=Zone.root.run(()=>i(()=>this.tick())):this.cancelScheduledCallback=this.ngZone.runOutsideAngular(()=>i(()=>this.tick()))}shouldScheduleTick(){return!(this.appRef.destroyed||this.pendingRenderTaskId!==null||this.runningTick||this.appRef._runningTick||!this.zonelessEnabled&&this.zoneIsDefined&&Zone.current.get(pa+this.angularZoneId))}tick(){if(this.runningTick||this.appRef.destroyed)return;if(this.appRef.dirtyFlags===0){this.cleanup();return}!this.zonelessEnabled&&this.appRef.dirtyFlags&7&&(this.appRef.dirtyFlags|=1);let t=this.taskService.add();try{this.ngZone.run(()=>{this.runningTick=!0,this.appRef._tick()},void 0,this.schedulerTickApplyArgs)}catch(i){this.applicationErrorHandler(i)}finally{this.taskService.remove(t),this.cleanup()}}ngOnDestroy(){this.subscriptions.unsubscribe(),this.cleanup()}cleanup(){if(this.runningTick=!1,this.cancelScheduledCallback?.(),this.cancelScheduledCallback=null,this.pendingRenderTaskId!==null){let t=this.pendingRenderTaskId;this.pendingRenderTaskId=null,this.taskService.remove(t)}}static \u0275fac=function(i){return new(i||n)};static \u0275prov=ru({token:n,factory:n.\u0275fac})}return n})();function nx(){return[{provide:no,useExisting:tx},{provide:Dn,useClass:ma},{provide:Ca,useValue:!0}]}function eI(){return typeof $localize<"u"&&$localize.locale||ja}var dm=new Ke("",{factory:()=>mt(dm,{optional:!0,skipSelf:!0})||eI()});function fm(n,e){return tl(n,e?.equal)}var ix=class n extends Error{_brand;constructor(e){super(e)}static IDLE=new n("IDLE");static LOADING=new n("LOADING")};var cI=1e4;var y4=cI-1e3;var hm=new Ke(""),lI=new Ke("");function $a(n){return!n.moduleRef}function uI(n){let e=$a(n)?n.r3Injector:n.moduleRef.injector,t=e.get(Dn);return t.run(()=>{$a(n)?n.r3Injector.resolveInjectorInitializers():n.moduleRef.resolveInjectorInitializers();let i=e.get(ho),r;if(t.runOutsideAngular(()=>{r=t.onError.subscribe({next:i})}),$a(n)){let s=()=>e.destroy(),o=n.platformInjector.get(hm);o.add(s),e.onDestroy(()=>{r.unsubscribe(),o.delete(s)})}else{let s=()=>n.moduleRef.destroy(),o=n.platformInjector.get(hm);o.add(s),n.moduleRef.onDestroy(()=>{Aa(n.allPlatformModules,n.moduleRef),r.unsubscribe(),o.delete(s)})}return fI(i,t,()=>{let s=e.get(fo),o=s.add(),a=e.get(cm);return a.runInitializers(),a.donePromise.then(()=>{let c=e.get(dm,ja);if(ex(c||ja),!e.get(lI,!0))return $a(n)?e.get(hu):(n.allPlatformModules.push(n.moduleRef),n.moduleRef);if($a(n)){let u=e.get(hu);return n.rootComponent!==void 0&&u.bootstrap(n.rootComponent),u}else return dI?.(n.moduleRef,n.allPlatformModules),n.moduleRef}).finally(()=>{s.remove(o)})})})}var dI;function fI(n,e,t){try{let i=t();return am(i)?i.catch(r=>{throw e.runOutsideAngular(()=>n(r)),r}):i}catch(i){throw e.runOutsideAngular(()=>n(i)),i}}var vu=null;function hI(n=[],e){return ji.create({name:e,providers:[{provide:va,useValue:"platform"},{provide:hm,useValue:new Set([()=>vu=null])},...n]})}function pI(n=[]){if(vu)return vu;let e=hI(n);return vu=e,K0(),mI(e),e}function mI(n){let e=n.get(kl,null);bl(n,()=>{e?.forEach(t=>t())})}function sx(n){let{rootComponent:e,appProviders:t,platformProviders:i,platformRef:r}=n;lt(tt.BootstrapApplicationStart);try{let s=r?.injector??pI(i),o=[nx(),Qv,...t||[]],a=new Fa({providers:o,parent:s,debugName:"",runEnvironmentInitializers:!1});return uI({r3Injector:a.injector,platformInjector:s,rootComponent:e})}catch(s){return Promise.reject(s)}finally{lt(tt.BootstrapApplicationEnd)}}var ox=null;function Xa(){return ox}function pm(n){ox??=n}var qa=class{};function mm(n,e){e=encodeURIComponent(e);for(let t of n.split(";")){let i=t.indexOf("="),[r,s]=i==-1?[t,""]:[t.slice(0,i),t.slice(i+1)];if(r.trim()!==e)continue;let o=s;try{o=decodeURIComponent(s)}catch{}return o.length>1&&o[0]==='"'&&o[o.length-1]==='"'&&(o=o.slice(1,-1)),o}return null}var ax="browser";var Ya=class{_doc;constructor(e){this._doc=e}manager},xu=(()=>{class n extends Ya{constructor(t){super(t)}supports(t){return!0}addEventListener(t,i,r,s){return t.addEventListener(i,r,s),()=>this.removeEventListener(t,i,r,s)}removeEventListener(t,i,r,s){return t.removeEventListener(i,r,s)}static \u0275fac=function(i){return new(i||n)(it(Yn))};static \u0275prov=Jt({token:n,factory:n.\u0275fac})}return n})(),bu=new Ke(""),ym=(()=>{class n{_zone;_plugins;_eventNameToPlugin=new Map;constructor(t,i){this._zone=i,t.forEach(o=>{o.manager=this});let r=t.filter(o=>!(o instanceof xu));this._plugins=r.slice().reverse();let s=t.find(o=>o instanceof xu);s&&this._plugins.push(s)}addEventListener(t,i,r,s){return this._findPluginFor(i).addEventListener(t,i,r,s)}getZone(){return this._zone}_findPluginFor(t){let i=this._eventNameToPlugin.get(t);if(i)return i;if(i=this._plugins.find(s=>s.supports(t)),!i)throw new We(-5101,!1);return this._eventNameToPlugin.set(t,i),i}static \u0275fac=function(i){return new(i||n)(it(bu),it(Dn))};static \u0275prov=Jt({token:n,factory:n.\u0275fac})}return n})(),gm="ng-app-id";function cx(n){for(let e of n)e.remove()}function lx(n,e){let t=e.createElement("style");return t.textContent=n,t}function gI(n,e,t,i){let r=n.head?.querySelectorAll(`style[${gm}="${e}"],link[${gm}="${e}"]`);if(!r||r.length===0)return!1;for(let s of r)s.removeAttribute(gm),s instanceof HTMLLinkElement?i.set(s.href.slice(s.href.lastIndexOf("/")+1),{usage:0,elements:[s]}):s.textContent&&t.set(s.textContent,{usage:0,elements:[s]});return!0}function vm(n,e){let t=e.createElement("link");return t.setAttribute("rel","stylesheet"),t.setAttribute("href",n),t}var xm=(()=>{class n{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(t,i,r,s={}){this.doc=t,this.appId=i,this.nonce=r,gI(t,i,this.inline,this.external)&&this.hosts.add(t.head)}addStyles(t,i){for(let r of t)this.addUsage(r,this.inline,lx);i?.forEach(r=>this.addUsage(r,this.external,vm))}removeStyles(t,i){for(let r of t)this.removeUsage(r,this.inline);i?.forEach(r=>this.removeUsage(r,this.external))}addUsage(t,i,r){let s=i.get(t);s?s.usage++:i.set(t,{usage:1,elements:[...this.hosts].map(o=>this.addElement(o,r(t,this.doc)))})}removeUsage(t,i){let r=i.get(t);r&&(r.usage--,r.usage<=0&&(cx(r.elements),i.delete(t)))}ngOnDestroy(){for(let[,{elements:t}]of[...this.inline,...this.external])cx(t);this.hosts.clear()}addHost(t){if(!this.hosts.has(t)){this.hosts.add(t);for(let[i,{elements:r}]of this.inline)r.push(this.addElement(t,lx(i,this.doc)));for(let[i,{elements:r}]of this.external)r.push(this.addElement(t,vm(i,this.doc)))}}removeHost(t){this.hosts.delete(t);for(let i of[...this.inline.values(),...this.external.values()]){let r=[];for(let s of i.elements)s.parentNode===t?s.remove():r.push(s);i.elements=r}}addElement(t,i){return this.nonce&&i.setAttribute("nonce",this.nonce),t.appendChild(i)}static \u0275fac=function(i){return new(i||n)(it(Yn),it(wa),it(Bl,8),it(Ta))};static \u0275prov=Jt({token:n,factory:n.\u0275fac})}return n})(),_m={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},Mm=/%COMP%/g;var dx="%COMP%",_I=`_nghost-${dx}`,vI=`_ngcontent-${dx}`,yI=!0,xI=new Ke("",{factory:()=>yI}),MI=new Ke("");function EI(n){return vI.replace(Mm,n)}function bI(n){return _I.replace(Mm,n)}function fx(n,e){return e.map(t=>t.replace(Mm,n))}var Em=(()=>{class n{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;cssVarNamespace;constructor(t,i,r,s,o,a,c=null,l=null,u=null){this.eventManager=t,this.sharedStylesHost=i,this.appId=r,this.removeStylesOnCompDestroy=s,this.doc=o,this.ngZone=a,this.nonce=c,this.tracingService=l,this.cssVarNamespace=u??"",this.defaultRenderer=new Za(t,o,a,this.tracingService,this.cssVarNamespace)}createRenderer(t,i){if(!t||!i)return this.defaultRenderer;let r=this.getOrCreateRenderer(t,i);return r instanceof Eu?r.applyToHost(t):r instanceof Ja&&r.applyStyles(),r}getOrCreateRenderer(t,i){let r=this.rendererByCompId,s=r.get(i.id);if(!s){let o=this.doc,a=this.ngZone,c=this.eventManager,l=this.sharedStylesHost,u=this.removeStylesOnCompDestroy,d=this.tracingService;switch(i.encapsulation){case li.Emulated:s=new Eu(c,l,i,this.appId,u,o,a,d,this.cssVarNamespace);break;case li.ShadowDom:return new Mu(c,t,i,o,a,this.nonce,d,this.cssVarNamespace,l);case li.ExperimentalIsolatedShadowDom:return new Mu(c,t,i,o,a,this.nonce,d,this.cssVarNamespace);default:s=new Ja(c,l,i,u,o,a,d,this.cssVarNamespace);break}r.set(i.id,s)}return s}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(t){this.rendererByCompId.delete(t)}static \u0275fac=function(i){return new(i||n)(it(ym),it(gs),it(wa),it(xI),it(Yn),it(Dn),it(Bl),it(ms,8),it(MI,8))};static \u0275prov=Jt({token:n,factory:n.\u0275fac})}return n})(),Za=class{eventManager;doc;ngZone;tracingService;cssVarNamespace;data=Object.create(null);throwOnSyntheticProps=!0;constructor(e,t,i,r,s=""){this.eventManager=e,this.doc=t,this.ngZone=i,this.tracingService=r,this.cssVarNamespace=s}destroy(){}destroyNode=null;createElement(e,t){return t?this.doc.createElementNS(_m[t]||t,e):this.doc.createElement(e)}createComment(e){return this.doc.createComment(e)}createText(e){return this.doc.createTextNode(e)}appendChild(e,t){(ux(e)?e.content:e).appendChild(t)}insertBefore(e,t,i){if(e){let r=ux(e)?e.content:e;if(i!=null&&i.parentNode!==r)throw new We(-5106,!1);r.insertBefore(t,i)}}removeChild(e,t){t.remove()}selectRootElement(e,t){let i=typeof e=="string"?this.doc.querySelector(e):e;if(!i)throw new We(-5104,!1);return t||(i.textContent=""),i}parentNode(e){return e.parentNode}nextSibling(e){return e.nextSibling}setAttribute(e,t,i,r){if(r){t=r+":"+t;let s=_m[r];s?e.setAttributeNS(s,t,i):e.setAttribute(t,i)}else e.setAttribute(t,i)}removeAttribute(e,t,i){if(i){let r=_m[i];r?e.removeAttributeNS(r,t):e.removeAttribute(`${i}:${t}`)}else e.removeAttribute(t)}addClass(e,t){e.classList.add(t)}removeClass(e,t){e.classList.remove(t)}setStyle(e,t,i,r){let s=t.startsWith("--");s&&(t=t.replace("%NS%",this.cssVarNamespace)),s||r&(Yi.DashCase|Yi.Important)?e.style.setProperty(t,i,r&Yi.Important?"important":""):e.style[t]=i}removeStyle(e,t,i){let r=t.startsWith("--");r&&(t=t.replace("%NS%",this.cssVarNamespace)),r||i&Yi.DashCase?e.style.removeProperty(t):e.style[t]=""}setProperty(e,t,i){e!=null&&(e[t]=i)}setValue(e,t){e.nodeValue=t}listen(e,t,i,r){if(typeof e=="string"&&(e=Xa().getGlobalEventTarget(this.doc,e),!e))throw new We(-5102,!1);let s=this.decoratePreventDefault(i);return this.tracingService?.wrapEventListener&&(s=this.tracingService.wrapEventListener(e,t,s)),this.eventManager.addEventListener(e,t,s,r)}decoratePreventDefault(e){return t=>{if(t==="__ngUnwrap__")return e;e(t)===!1&&t.preventDefault()}}};function ux(n){return n.tagName==="TEMPLATE"&&n.content!==void 0}var Mu=class extends Za{hostEl;sharedStylesHost;shadowRoot;constructor(e,t,i,r,s,o,a,c,l){super(e,r,s,a,c),this.hostEl=t,this.sharedStylesHost=l,this.shadowRoot=t.attachShadow({mode:"open"}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let u=i.styles;u=fx(i.id,u).map(f=>f.replace(/%NS%/g,c));for(let f of u){let h=document.createElement("style");o&&h.setAttribute("nonce",o),h.textContent=f,this.shadowRoot.appendChild(h)}let d=i.getExternalStyles?.();if(d)for(let f of d){let h=vm(f,r);o&&h.setAttribute("nonce",o),this.shadowRoot.appendChild(h)}}nodeOrShadowRoot(e){return e===this.hostEl?this.shadowRoot:e}appendChild(e,t){return super.appendChild(this.nodeOrShadowRoot(e),t)}insertBefore(e,t,i){return super.insertBefore(this.nodeOrShadowRoot(e),t,i)}removeChild(e,t){return super.removeChild(null,t)}parentNode(e){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},Ja=class extends Za{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(e,t,i,r,s,o,a,c,l){super(e,s,o,a,c),this.sharedStylesHost=t,this.removeStylesOnCompDestroy=r;let u=i.styles,d=l?fx(l,u):u;this.styles=d.map(f=>f.replace(/%NS%/g,c)),this.styleUrls=i.getExternalStyles?.(l)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&qp.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},Eu=class extends Ja{contentAttr;hostAttr;constructor(e,t,i,r,s,o,a,c,l){let u=r+"-"+i.id;super(e,t,i,s,o,a,c,l,u),this.contentAttr=EI(u),this.hostAttr=bI(u)}applyToHost(e){this.applyStyles(),this.setAttribute(e,this.hostAttr,"")}createElement(e,t){let i=super.createElement(e,t);return super.setAttribute(i,this.contentAttr,""),i}};var Su=class n extends qa{supportsDOMEvents=!0;static makeCurrent(){pm(new n)}onAndCancel(e,t,i,r){return e.addEventListener(t,i,r),()=>{e.removeEventListener(t,i,r)}}dispatchEvent(e,t){e.dispatchEvent(t)}remove(e){e.remove()}createElement(e,t){return t=t||this.getDefaultDocument(),t.createElement(e)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(e){return e.nodeType===Node.ELEMENT_NODE}isShadowRoot(e){return e instanceof DocumentFragment}getGlobalEventTarget(e,t){return t==="window"?window:t==="document"?e:t==="body"?e.body:null}getBaseHref(e){let t=SI();return t==null?null:wI(t)}resetBaseElement(){Ka=null}getUserAgent(){return window.navigator.userAgent}getCookie(e){return mm(document.cookie,e)}},Ka=null;function SI(){return Ka=Ka||document.head.querySelector("base"),Ka?Ka.getAttribute("href"):null}function wI(n){return new URL(n,document.baseURI).pathname}var hx=["alt","control","meta","shift"],TI={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},CI={alt:n=>n.altKey,control:n=>n.ctrlKey,meta:n=>n.metaKey,shift:n=>n.shiftKey},px=(()=>{class n extends Ya{constructor(t){super(t)}supports(t){return n.parseEventName(t)!=null}addEventListener(t,i,r,s){let o=n.parseEventName(i),a=n.eventCallback(o.fullKey,r,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>Xa().onAndCancel(t,o.domEventName,a,s))}static parseEventName(t){let i=t.toLowerCase().split("."),r=i.shift();if(i.length===0||!(r==="keydown"||r==="keyup"))return null;let s=n._normalizeKey(i.pop()),o="",a=i.indexOf("code");if(a>-1&&(i.splice(a,1),o="code."),hx.forEach(l=>{let u=i.indexOf(l);u>-1&&(i.splice(u,1),o+=l+".")}),o+=s,i.length!=0||s.length===0)return null;let c={};return c.domEventName=r,c.fullKey=o,c}static matchEventFullKeyCode(t,i){let r=TI[t.key]||t.key,s="";return i.indexOf("code.")>-1&&(r=t.code,s="code."),r==null||!r?!1:(r=r.toLowerCase(),r===" "?r="space":r==="."&&(r="dot"),hx.forEach(o=>{if(o!==r){let a=CI[o];a(t)&&(s+=o+".")}}),s+=r,s===i)}static eventCallback(t,i,r){return s=>{n.matchEventFullKeyCode(s,t)&&r.runGuarded(()=>i(s))}}static _normalizeKey(t){return t==="esc"?"escape":t}static \u0275fac=function(i){return new(i||n)(it(Yn))};static \u0275prov=Jt({token:n,factory:n.\u0275fac})}return n})();async function bm(n,e,t){let i=Wt({rootComponent:n},II(e,t));return sx(i)}function II(n,e){return{platformRef:e?.platformRef,appProviders:[...PI,...n?.providers??[]],platformProviders:NI}}function AI(){Su.makeCurrent()}function DI(){return new $i}function RI(){return Gp(document),document}var NI=[{provide:Ta,useValue:ax},{provide:kl,useValue:AI,multi:!0},{provide:Yn,useFactory:RI}];var PI=[{provide:va,useValue:"root"},{provide:$i,useFactory:DI},{provide:bu,useClass:xu,multi:!0},{provide:bu,useClass:px,multi:!0},Em,{provide:gs,useClass:xm},{provide:xm,useExisting:gs},ym,{provide:hs,useExisting:Em},[]];var Ox=0,eg=1,Lx=2;var tg=1,Fx=2,Ni=3,sr=0,ln=1,Pi=2,cr=0,bs=1,ng=2,ig=3,rg=4,kx=5,Lr=100,Bx=101,Ux=102,Vx=103,Hx=104,zx=200,Gx=201,Wx=202,jx=203,$u=204,qu=205,$x=206,qx=207,Xx=208,Yx=209,Zx=210,Jx=211,Kx=212,Qx=213,eM=214,md=0,gd=1,_d=2,Ss=3,vd=4,yd=5,xd=6,Md=7,sg=0,tM=1,nM=2,lr=0,iM=1,rM=2,sM=3,oM=4,aM=5,cM=6,lM=7;var og=300,Is=301,As=302,Ed=303,bd=304,Sc=306,Xu=1e3,Or=1001,Yu=1002,Kn=1003,uM=1004;var wc=1005;var mi=1006,Sd=1007;var Vr=1008;var Oi=1009,ag=1010,cg=1011,Wo=1012,wd=1013,Hr=1014,Li=1015,jo=1016,Td=1017,Cd=1018,$o=1020,lg=35902,ug=35899,dg=1021,fg=1022,ei=1023,ko=1026,qo=1027,hg=1028,Id=1029,pg=1030,Ad=1031;var Dd=1033,Tc=33776,Cc=33777,Ic=33778,Ac=33779,Rd=35840,Nd=35841,Pd=35842,Od=35843,Ld=36196,Fd=37492,kd=37496,Bd=37808,Ud=37809,Vd=37810,Hd=37811,zd=37812,Gd=37813,Wd=37814,jd=37815,$d=37816,qd=37817,Xd=37818,Yd=37819,Zd=37820,Jd=37821,Kd=36492,Qd=36494,ef=36495,tf=36283,nf=36284,rf=36285,sf=36286;var rc=2300,Zu=2301,ju=2302,qm=2400,Xm=2401,Ym=2402;var dM=3200,fM=3201;var hM=0,pM=1,ur="",qt="srgb",ws="srgb-linear",sc="linear",st="srgb";var Ms=7680;var Zm=519,mM=512,gM=513,_M=514,mg=515,vM=516,yM=517,xM=518,MM=519,Jm=35044,of=35048;var gg="300 es",pi=2e3,oc=2001;var or=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Sm=Math.PI/180,Ju=180/Math.PI;function Dc(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[i&255]+Kt[i>>8&255]+Kt[i>>16&255]+Kt[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function OI(n,e){return(n%e+e)%e}function wm(n,e,t){return(1-t)*n+t*e}function Qa(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function vn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var ot=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ar=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],d=i[r+3],f=s[o+0],h=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=f,e[t+1]=h,e[t+2]=g,e[t+3]=_;return}if(d!==_||c!==f||l!==h||u!==g){let m=1-a,p=c*f+l*h+u*g+d*_,E=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){let w=Math.sqrt(S),I=Math.atan2(w,p*E);m=Math.sin(m*I)/w,a=Math.sin(a*I)/w}let x=a*E;if(c=c*m+f*x,l=l*m+h*x,u=u*m+g*x,d=d*m+_*x,m===1-a){let w=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=w,l*=w,u*=w,d*=w}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,o){let a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],d=s[o],f=s[o+1],h=s[o+2],g=s[o+3];return e[t]=a*g+u*d+c*h-l*f,e[t+1]=c*g+u*f+l*d-a*h,e[t+2]=l*g+u*h+a*f-c*d,e[t+3]=u*g-a*d-c*f-l*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),d=a(s/2),f=c(i/2),h=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=f*u*d+l*h*g,this._y=l*h*d-f*u*g,this._z=l*u*g+f*h*d,this._w=l*u*d-f*h*g;break;case"YXZ":this._x=f*u*d+l*h*g,this._y=l*h*d-f*u*g,this._z=l*u*g-f*h*d,this._w=l*u*d+f*h*g;break;case"ZXY":this._x=f*u*d-l*h*g,this._y=l*h*d+f*u*g,this._z=l*u*g+f*h*d,this._w=l*u*d-f*h*g;break;case"ZYX":this._x=f*u*d-l*h*g,this._y=l*h*d+f*u*g,this._z=l*u*g-f*h*d,this._w=l*u*d+f*h*g;break;case"YZX":this._x=f*u*d+l*h*g,this._y=l*h*d+f*u*g,this._z=l*u*g-f*h*d,this._w=l*u*d-f*h*g;break;case"XZY":this._x=f*u*d-l*h*g,this._y=l*h*d-f*u*g,this._z=l*u*g+f*h*d,this._w=l*u*d+f*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],d=t[10],f=i+a+d;if(f>0){let h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-c)*h,this._y=(s-l)*h,this._z=(o-r)*h}else if(i>a&&i>d){let h=2*Math.sqrt(1+i-a-d);this._w=(u-c)/h,this._x=.25*h,this._y=(r+o)/h,this._z=(s+l)/h}else if(a>d){let h=2*Math.sqrt(1+a-i-d);this._w=(s-l)/h,this._x=(r+o)/h,this._y=.25*h,this._z=(c+u)/h}else{let h=2*Math.sqrt(1+d-i-a);this._w=(o-r)/h,this._x=(s+l)/h,this._y=(c+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,r=this._y,s=this._z,o=this._w,a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;let c=1-a*a;if(c<=Number.EPSILON){let h=1-t;return this._w=h*o+t*this._w,this._x=h*i+t*this._x,this._y=h*r+t*this._y,this._z=h*s+t*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,a),d=Math.sin((1-t)*u)/l,f=Math.sin(t*u)/l;return this._w=o*d+this._w*f,this._x=i*d+this._x*f,this._y=r*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mx.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mx.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*i),u=2*(a*t-s*r),d=2*(s*i-o*t);return this.x=t+c*l+o*d-a*u,this.y=i+c*u+a*l-s*d,this.z=r+c*d+s*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Tm.copy(this).projectOnVector(e),this.sub(Tm)}reflect(e){return this.sub(Tm.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Tm=new B,mx=new ar,ke=class n{constructor(e,t,i,r,s,o,a,c,l){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l)}set(e,t,i,r,s,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],d=i[7],f=i[2],h=i[5],g=i[8],_=r[0],m=r[3],p=r[6],E=r[1],S=r[4],x=r[7],w=r[2],I=r[5],T=r[8];return s[0]=o*_+a*E+c*w,s[3]=o*m+a*S+c*I,s[6]=o*p+a*x+c*T,s[1]=l*_+u*E+d*w,s[4]=l*m+u*S+d*I,s[7]=l*p+u*x+d*T,s[2]=f*_+h*E+g*w,s[5]=f*m+h*S+g*I,s[8]=f*p+h*x+g*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=u*o-a*l,f=a*c-u*s,h=l*s-o*c,g=t*d+i*f+r*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=d*_,e[1]=(r*l-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=f*_,e[4]=(u*t-r*c)*_,e[5]=(r*s-a*t)*_,e[6]=h*_,e[7]=(i*c-l*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Cm.makeScale(e,t)),this}rotate(e){return this.premultiply(Cm.makeRotation(-e)),this}translate(e,t){return this.premultiply(Cm.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Cm=new ke;function _g(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ac(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function EM(){let n=ac("canvas");return n.style.display="block",n}var gx={};function Bo(n){n in gx||(gx[n]=!0,console.warn(n))}function bM(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}var _x=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),vx=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function LI(){let n={enabled:!0,workingColorSpace:ws,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===st&&(r.r=rr(r.r),r.g=rr(r.g),r.b=rr(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===st&&(r.r=Fo(r.r),r.g=Fo(r.g),r.b=Fo(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ur?sc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Bo("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Bo("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ws]:{primaries:e,whitePoint:i,transfer:sc,toXYZ:_x,fromXYZ:vx,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:qt},outputColorSpaceConfig:{drawingBufferColorSpace:qt}},[qt]:{primaries:e,whitePoint:i,transfer:st,toXYZ:_x,fromXYZ:vx,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:qt}}}),n}var Ze=LI();function rr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Fo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var So,Ku=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{So===void 0&&(So=ac("canvas")),So.width=e.width,So.height=e.height;let r=So.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=So}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ac("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=rr(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(rr(t[i]/255)*255):t[i]=rr(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},FI=0,Uo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:FI++}),this.uuid=Dc(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Im(r[o].image)):s.push(Im(r[o]))}else s=Im(r);i.url=s}return t||(e.images[this.uuid]=i),i}};function Im(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ku.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var kI=0,Am=new B,xn=class n extends or{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Or,r=Or,s=mi,o=Vr,a=ei,c=Oi,l=n.DEFAULT_ANISOTROPY,u=ur){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kI++}),this.uuid=Dc(),this.name="",this.source=new Uo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Am).x}get height(){return this.source.getSize(Am).y}get depth(){return this.source.getSize(Am).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==og)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Xu:e.x=e.x-Math.floor(e.x);break;case Or:e.x=e.x<0?0:1;break;case Yu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Xu:e.y=e.y-Math.floor(e.y);break;case Or:e.y=e.y<0?0:1;break;case Yu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=og;xn.DEFAULT_ANISOTROPY=1;var Dt=class n{constructor(e=0,t=0,i=0,r=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s,c=e.elements,l=c[0],u=c[4],d=c[8],f=c[1],h=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+h+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(l+1)/2,x=(h+1)/2,w=(p+1)/2,I=(u+f)/4,T=(d+_)/4,A=(g+m)/4;return S>x&&S>w?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=I/i,s=T/i):x>w?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=I/r,s=A/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=T/s,r=A/s),this.set(i,r,s,t),this}let E=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(f-u)*(f-u));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-_)/E,this.z=(f-u)/E,this.w=Math.acos((l+h+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Qu=class extends or{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t);let r={width:e,height:t,depth:i.depth},s=new xn(r);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:mi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Uo(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Di=class extends Qu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},cc=class extends xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Or,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ed=class extends xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Or,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fr=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(di.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(di.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=di.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,di):di.fromBufferAttribute(s,o),di.applyMatrix4(e.matrixWorld),this.expandByPoint(di);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wu.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wu.copy(i.boundingBox)),wu.applyMatrix4(e.matrixWorld),this.union(wu)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,di),di.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ec),Tu.subVectors(this.max,ec),wo.subVectors(e.a,ec),To.subVectors(e.b,ec),Co.subVectors(e.c,ec),Cr.subVectors(To,wo),Ir.subVectors(Co,To),_s.subVectors(wo,Co);let t=[0,-Cr.z,Cr.y,0,-Ir.z,Ir.y,0,-_s.z,_s.y,Cr.z,0,-Cr.x,Ir.z,0,-Ir.x,_s.z,0,-_s.x,-Cr.y,Cr.x,0,-Ir.y,Ir.x,0,-_s.y,_s.x,0];return!Dm(t,wo,To,Co,Tu)||(t=[1,0,0,0,1,0,0,0,1],!Dm(t,wo,To,Co,Tu))?!1:(Cu.crossVectors(Cr,Ir),t=[Cu.x,Cu.y,Cu.z],Dm(t,wo,To,Co,Tu))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,di).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(di).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qi=[new B,new B,new B,new B,new B,new B,new B,new B],di=new B,wu=new Fr,wo=new B,To=new B,Co=new B,Cr=new B,Ir=new B,_s=new B,ec=new B,Tu=new B,Cu=new B,vs=new B;function Dm(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){vs.fromArray(n,s);let a=r.x*Math.abs(vs.x)+r.y*Math.abs(vs.y)+r.z*Math.abs(vs.z),c=e.dot(vs),l=t.dot(vs),u=i.dot(vs);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var BI=new Fr,tc=new B,Rm=new B,Ts=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):BI.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;tc.subVectors(e,this.center);let t=tc.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(tc,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rm.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(tc.copy(e.center).add(Rm)),this.expandByPoint(tc.copy(e.center).sub(Rm))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},er=new B,Nm=new B,Iu=new B,Ar=new B,Pm=new B,Au=new B,Om=new B,lc=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,er)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=er.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(er.copy(this.origin).addScaledVector(this.direction,t),er.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Nm.copy(e).add(t).multiplyScalar(.5),Iu.copy(t).sub(e).normalize(),Ar.copy(this.origin).sub(Nm);let s=e.distanceTo(t)*.5,o=-this.direction.dot(Iu),a=Ar.dot(this.direction),c=-Ar.dot(Iu),l=Ar.lengthSq(),u=Math.abs(1-o*o),d,f,h,g;if(u>0)if(d=o*c-a,f=o*a-c,g=s*u,d>=0)if(f>=-g)if(f<=g){let _=1/u;d*=_,f*=_,h=d*(d+o*f+2*a)+f*(o*d+f+2*c)+l}else f=s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*c)+l;else f<=-g?(d=Math.max(0,-(-o*s+a)),f=d>0?-s:Math.min(Math.max(-s,-c),s),h=-d*d+f*(f+2*c)+l):f<=g?(d=0,f=Math.min(Math.max(-s,-c),s),h=f*(f+2*c)+l):(d=Math.max(0,-(o*s+a)),f=d>0?s:Math.min(Math.max(-s,-c),s),h=-d*d+f*(f+2*c)+l);else f=o>0?-s:s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Nm).addScaledVector(Iu,f),h}intersectSphere(e,t){er.subVectors(e.center,this.origin);let i=er.dot(this.direction),r=er.dot(er)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,er)!==null}intersectTriangle(e,t,i,r,s){Pm.subVectors(t,e),Au.subVectors(i,e),Om.crossVectors(Pm,Au);let o=this.direction.dot(Om),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ar.subVectors(this.origin,e);let c=a*this.direction.dot(Au.crossVectors(Ar,Au));if(c<0)return null;let l=a*this.direction.dot(Pm.cross(Ar));if(l<0||c+l>o)return null;let u=-a*Ar.dot(Om);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Bt=class n{constructor(e,t,i,r,s,o,a,c,l,u,d,f,h,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l,u,d,f,h,g,_,m)}set(e,t,i,r,s,o,a,c,l,u,d,f,h,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=d,p[14]=f,p[3]=h,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,r=1/Io.setFromMatrixColumn(e,0).length(),s=1/Io.setFromMatrixColumn(e,1).length(),o=1/Io.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let f=o*u,h=o*d,g=a*u,_=a*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=h+g*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=g+h*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*u,h=c*d,g=l*u,_=l*d;t[0]=f+_*a,t[4]=g*a-h,t[8]=o*l,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=h*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*u,h=c*d,g=l*u,_=l*d;t[0]=f-_*a,t[4]=-o*d,t[8]=g+h*a,t[1]=h+g*a,t[5]=o*u,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*u,h=o*d,g=a*u,_=a*d;t[0]=c*u,t[4]=g*l-h,t[8]=f*l+_,t[1]=c*d,t[5]=_*l+f,t[9]=h*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,h=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=_-f*d,t[8]=g*d+h,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=h*d+g,t[10]=f-_*d}else if(e.order==="XZY"){let f=o*c,h=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=f*d+_,t[5]=o*u,t[9]=h*d-g,t[2]=g*d-h,t[6]=a*u,t[10]=_*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(UI,e,VI)}lookAt(e,t,i){let r=this.elements;return Ln.subVectors(e,t),Ln.lengthSq()===0&&(Ln.z=1),Ln.normalize(),Dr.crossVectors(i,Ln),Dr.lengthSq()===0&&(Math.abs(i.z)===1?Ln.x+=1e-4:Ln.z+=1e-4,Ln.normalize(),Dr.crossVectors(i,Ln)),Dr.normalize(),Du.crossVectors(Ln,Dr),r[0]=Dr.x,r[4]=Du.x,r[8]=Ln.x,r[1]=Dr.y,r[5]=Du.y,r[9]=Ln.y,r[2]=Dr.z,r[6]=Du.z,r[10]=Ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],d=i[5],f=i[9],h=i[13],g=i[2],_=i[6],m=i[10],p=i[14],E=i[3],S=i[7],x=i[11],w=i[15],I=r[0],T=r[4],A=r[8],y=r[12],M=r[1],R=r[5],L=r[9],k=r[13],W=r[2],z=r[6],G=r[10],j=r[14],U=r[3],ne=r[7],oe=r[11],fe=r[15];return s[0]=o*I+a*M+c*W+l*U,s[4]=o*T+a*R+c*z+l*ne,s[8]=o*A+a*L+c*G+l*oe,s[12]=o*y+a*k+c*j+l*fe,s[1]=u*I+d*M+f*W+h*U,s[5]=u*T+d*R+f*z+h*ne,s[9]=u*A+d*L+f*G+h*oe,s[13]=u*y+d*k+f*j+h*fe,s[2]=g*I+_*M+m*W+p*U,s[6]=g*T+_*R+m*z+p*ne,s[10]=g*A+_*L+m*G+p*oe,s[14]=g*y+_*k+m*j+p*fe,s[3]=E*I+S*M+x*W+w*U,s[7]=E*T+S*R+x*z+w*ne,s[11]=E*A+S*L+x*G+w*oe,s[15]=E*y+S*k+x*j+w*fe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],d=e[6],f=e[10],h=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+s*c*d-r*l*d-s*a*f+i*l*f+r*a*h-i*c*h)+_*(+t*c*h-t*l*f+s*o*f-r*o*h+r*l*u-s*c*u)+m*(+t*l*d-t*a*h-s*o*d+i*o*h+s*a*u-i*l*u)+p*(-r*a*u-t*c*d+t*a*f+r*o*d-i*o*f+i*c*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],h=e[11],g=e[12],_=e[13],m=e[14],p=e[15],E=d*m*l-_*f*l+_*c*h-a*m*h-d*c*p+a*f*p,S=g*f*l-u*m*l-g*c*h+o*m*h+u*c*p-o*f*p,x=u*_*l-g*d*l+g*a*h-o*_*h-u*a*p+o*d*p,w=g*d*c-u*_*c-g*a*f+o*_*f+u*a*m-o*d*m,I=t*E+i*S+r*x+s*w;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/I;return e[0]=E*T,e[1]=(_*f*s-d*m*s-_*r*h+i*m*h+d*r*p-i*f*p)*T,e[2]=(a*m*s-_*c*s+_*r*l-i*m*l-a*r*p+i*c*p)*T,e[3]=(d*c*s-a*f*s-d*r*l+i*f*l+a*r*h-i*c*h)*T,e[4]=S*T,e[5]=(u*m*s-g*f*s+g*r*h-t*m*h-u*r*p+t*f*p)*T,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*p-t*c*p)*T,e[7]=(o*f*s-u*c*s+u*r*l-t*f*l-o*r*h+t*c*h)*T,e[8]=x*T,e[9]=(g*d*s-u*_*s-g*i*h+t*_*h+u*i*p-t*d*p)*T,e[10]=(o*_*s-g*a*s+g*i*l-t*_*l-o*i*p+t*a*p)*T,e[11]=(u*a*s-o*d*s-u*i*l+t*d*l+o*i*h-t*a*h)*T,e[12]=w*T,e[13]=(u*_*r-g*d*r+g*i*f-t*_*f-u*i*m+t*d*m)*T,e[14]=(g*a*r-o*_*r-g*i*c+t*_*c+o*i*m-t*a*m)*T,e[15]=(o*d*r-u*a*r+u*i*c-t*d*c-o*i*f+t*a*f)*T,this}scale(e){let t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){let r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,u=o+o,d=a+a,f=s*l,h=s*u,g=s*d,_=o*u,m=o*d,p=a*d,E=c*l,S=c*u,x=c*d,w=i.x,I=i.y,T=i.z;return r[0]=(1-(_+p))*w,r[1]=(h+x)*w,r[2]=(g-S)*w,r[3]=0,r[4]=(h-x)*I,r[5]=(1-(f+p))*I,r[6]=(m+E)*I,r[7]=0,r[8]=(g+S)*T,r[9]=(m-E)*T,r[10]=(1-(f+_))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){let r=this.elements,s=Io.set(r[0],r[1],r[2]).length(),o=Io.set(r[4],r[5],r[6]).length(),a=Io.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],fi.copy(this);let l=1/s,u=1/o,d=1/a;return fi.elements[0]*=l,fi.elements[1]*=l,fi.elements[2]*=l,fi.elements[4]*=u,fi.elements[5]*=u,fi.elements[6]*=u,fi.elements[8]*=d,fi.elements[9]*=d,fi.elements[10]*=d,t.setFromRotationMatrix(fi),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=pi,c=!1){let l=this.elements,u=2*s/(t-e),d=2*s/(i-r),f=(t+e)/(t-e),h=(i+r)/(i-r),g,_;if(c)g=s/(o-s),_=o*s/(o-s);else if(a===pi)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===oc)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=pi,c=!1){let l=this.elements,u=2/(t-e),d=2/(i-r),f=-(t+e)/(t-e),h=-(i+r)/(i-r),g,_;if(c)g=1/(o-s),_=o/(o-s);else if(a===pi)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===oc)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=h,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Io=new B,fi=new Bt,UI=new B(0,0,0),VI=new B(1,1,1),Dr=new B,Du=new B,Ln=new B,yx=new Bt,xx=new ar,Ri=class n{constructor(e=0,t=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],d=r[2],f=r[6],h=r[10];switch(t){case"XYZ":this._y=Math.asin($e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,h),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,h));break;case"XZY":this._z=Math.asin(-$e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return yx.makeRotationFromQuaternion(e),this.setFromRotationMatrix(yx,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xx.setFromEuler(this),this.setFromQuaternion(xx,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ri.DEFAULT_ORDER="XYZ";var uc=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},HI=0,Mx=new B,Ao=new ar,tr=new Bt,Ru=new B,nc=new B,zI=new B,GI=new ar,Ex=new B(1,0,0),bx=new B(0,1,0),Sx=new B(0,0,1),wx={type:"added"},WI={type:"removed"},Do={type:"childadded",child:null},Lm={type:"childremoved",child:null},kn=class n extends or{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:HI++}),this.uuid=Dc(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new B,t=new Ri,i=new ar,r=new B(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Bt},normalMatrix:{value:new ke}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ao.setFromAxisAngle(e,t),this.quaternion.multiply(Ao),this}rotateOnWorldAxis(e,t){return Ao.setFromAxisAngle(e,t),this.quaternion.premultiply(Ao),this}rotateX(e){return this.rotateOnAxis(Ex,e)}rotateY(e){return this.rotateOnAxis(bx,e)}rotateZ(e){return this.rotateOnAxis(Sx,e)}translateOnAxis(e,t){return Mx.copy(e).applyQuaternion(this.quaternion),this.position.add(Mx.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ex,e)}translateY(e){return this.translateOnAxis(bx,e)}translateZ(e){return this.translateOnAxis(Sx,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(tr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ru.copy(e):Ru.set(e,t,i);let r=this.parent;this.updateWorldMatrix(!0,!1),nc.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?tr.lookAt(nc,Ru,this.up):tr.lookAt(Ru,nc,this.up),this.quaternion.setFromRotationMatrix(tr),r&&(tr.extractRotation(r.matrixWorld),Ao.setFromRotationMatrix(tr),this.quaternion.premultiply(Ao.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(wx),Do.child=e,this.dispatchEvent(Do),Do.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(WI),Lm.child=e,this.dispatchEvent(Lm),Lm.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),tr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),tr.multiply(e.parent.matrixWorld)),e.applyMatrix4(tr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(wx),Do.child=e,this.dispatchEvent(Do),Do.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nc,e,zI),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nc,GI,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>hn(Wt({},a),{boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>Wt({},a)),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),d=o(e.shapes),f=o(e.skeletons),h=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),h.length>0&&(i.animations=h),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}};kn.DEFAULT_UP=new B(0,1,0);kn.DEFAULT_MATRIX_AUTO_UPDATE=!0;kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var hi=new B,nr=new B,Fm=new B,ir=new B,Ro=new B,No=new B,Tx=new B,km=new B,Bm=new B,Um=new B,Vm=new Dt,Hm=new Dt,zm=new Dt,Pr=class n{constructor(e=new B,t=new B,i=new B){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),hi.subVectors(e,t),r.cross(hi);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){hi.subVectors(r,t),nr.subVectors(i,t),Fm.subVectors(e,t);let o=hi.dot(hi),a=hi.dot(nr),c=hi.dot(Fm),l=nr.dot(nr),u=nr.dot(Fm),d=o*l-a*a;if(d===0)return s.set(0,0,0),null;let f=1/d,h=(l*c-a*u)*f,g=(o*u-a*c)*f;return s.set(1-h-g,g,h)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,ir)===null?!1:ir.x>=0&&ir.y>=0&&ir.x+ir.y<=1}static getInterpolation(e,t,i,r,s,o,a,c){return this.getBarycoord(e,t,i,r,ir)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ir.x),c.addScaledVector(o,ir.y),c.addScaledVector(a,ir.z),c)}static getInterpolatedAttribute(e,t,i,r,s,o){return Vm.setScalar(0),Hm.setScalar(0),zm.setScalar(0),Vm.fromBufferAttribute(e,t),Hm.fromBufferAttribute(e,i),zm.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Vm,s.x),o.addScaledVector(Hm,s.y),o.addScaledVector(zm,s.z),o}static isFrontFacing(e,t,i,r){return hi.subVectors(i,t),nr.subVectors(e,t),hi.cross(nr).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hi.subVectors(this.c,this.b),nr.subVectors(this.a,this.b),hi.cross(nr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,r=this.b,s=this.c,o,a;Ro.subVectors(r,i),No.subVectors(s,i),km.subVectors(e,i);let c=Ro.dot(km),l=No.dot(km);if(c<=0&&l<=0)return t.copy(i);Bm.subVectors(e,r);let u=Ro.dot(Bm),d=No.dot(Bm);if(u>=0&&d<=u)return t.copy(r);let f=c*d-u*l;if(f<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(Ro,o);Um.subVectors(e,s);let h=Ro.dot(Um),g=No.dot(Um);if(g>=0&&h<=g)return t.copy(s);let _=h*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(No,a);let m=u*g-h*d;if(m<=0&&d-u>=0&&h-g>=0)return Tx.subVectors(s,r),a=(d-u)/(d-u+(h-g)),t.copy(r).addScaledVector(Tx,a);let p=1/(m+_+f);return o=_*p,a=f*p,t.copy(i).addScaledVector(Ro,o).addScaledVector(No,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},SM={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rr={h:0,s:0,l:0},Nu={h:0,s:0,l:0};function Gm(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var qe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ze.workingColorSpace){if(e=OI(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Gm(o,s,e+1/3),this.g=Gm(o,s,e),this.b=Gm(o,s,e-1/3)}return Ze.colorSpaceToWorking(this,r),this}setStyle(e,t=qt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qt){let i=SM[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=rr(e.r),this.g=rr(e.g),this.b=rr(e.b),this}copyLinearToSRGB(e){return this.r=Fo(e.r),this.g=Fo(e.g),this.b=Fo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return Ze.workingToColorSpace(Qt.copy(this),e),Math.round($e(Qt.r*255,0,255))*65536+Math.round($e(Qt.g*255,0,255))*256+Math.round($e(Qt.b*255,0,255))}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Qt.copy(this),t);let i=Qt.r,r=Qt.g,s=Qt.b,o=Math.max(i,r,s),a=Math.min(i,r,s),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case i:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-i)/d+2;break;case s:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=qt){Ze.workingToColorSpace(Qt.copy(this),e);let t=Qt.r,i=Qt.g,r=Qt.b;return e!==qt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Rr),this.setHSL(Rr.h+e,Rr.s+t,Rr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Rr),e.getHSL(Nu);let i=wm(Rr.h,Nu.h,t),r=wm(Rr.s,Nu.s,t),s=wm(Rr.l,Nu.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qt=new qe;qe.NAMES=SM;var jI=0,kr=class extends or{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jI++}),this.uuid=Dc(),this.name="",this.type="Material",this.blending=bs,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$u,this.blendDst=qu,this.blendEquation=Lr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ms,this.stencilZFail=Ms,this.stencilZPass=Ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==bs&&(i.blending=this.blending),this.side!==sr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==$u&&(i.blendSrc=this.blendSrc),this.blendDst!==qu&&(i.blendDst=this.blendDst),this.blendEquation!==Lr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ss&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ms&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ms&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ms&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},dc=class extends kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ri,this.combine=sg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var kt=new B,Pu=new ot,$I=0,en=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$I++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Jm,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Pu.fromBufferAttribute(this,t),Pu.applyMatrix3(e),this.setXY(t,Pu.x,Pu.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Qa(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=vn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Qa(t,this.array)),t}setX(e,t){return this.normalized&&(t=vn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Qa(t,this.array)),t}setY(e,t){return this.normalized&&(t=vn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Qa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=vn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Qa(t,this.array)),t}setW(e,t){return this.normalized&&(t=vn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=vn(t,this.array),i=vn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=vn(t,this.array),i=vn(i,this.array),r=vn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=vn(t,this.array),i=vn(i,this.array),r=vn(r,this.array),s=vn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jm&&(e.usage=this.usage),e}};var fc=class extends en{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var hc=class extends en{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Ai=class extends en{constructor(e,t,i){super(new Float32Array(e),t,i)}},qI=0,Jn=new Bt,Wm=new kn,Po=new B,Fn=new Fr,ic=new Fr,Gt=new B,gi=class n extends or{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qI++}),this.uuid=Dc(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_g(e)?hc:fc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jn.makeRotationFromQuaternion(e),this.applyMatrix4(Jn),this}rotateX(e){return Jn.makeRotationX(e),this.applyMatrix4(Jn),this}rotateY(e){return Jn.makeRotationY(e),this.applyMatrix4(Jn),this}rotateZ(e){return Jn.makeRotationZ(e),this.applyMatrix4(Jn),this}translate(e,t,i){return Jn.makeTranslation(e,t,i),this.applyMatrix4(Jn),this}scale(e,t,i){return Jn.makeScale(e,t,i),this.applyMatrix4(Jn),this}lookAt(e){return Wm.lookAt(e),Wm.updateMatrix(),this.applyMatrix4(Wm.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Po).negate(),this.translate(Po.x,Po.y,Po.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ai(i,3))}else{let i=Math.min(e.length,t.count);for(let r=0;r<i;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){let s=t[i];Fn.setFromBufferAttribute(s),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,Fn.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,Fn.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(Fn.min),this.boundingBox.expandByPoint(Fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ts);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let i=this.boundingSphere.center;if(Fn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];ic.setFromBufferAttribute(a),this.morphTargetsRelative?(Gt.addVectors(Fn.min,ic.min),Fn.expandByPoint(Gt),Gt.addVectors(Fn.max,ic.max),Fn.expandByPoint(Gt)):(Fn.expandByPoint(ic.min),Fn.expandByPoint(ic.max))}Fn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Gt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Gt));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Gt.fromBufferAttribute(a,l),c&&(Po.fromBufferAttribute(e,l),Gt.add(Po)),r=Math.max(r,i.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new en(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let A=0;A<i.count;A++)a[A]=new B,c[A]=new B;let l=new B,u=new B,d=new B,f=new ot,h=new ot,g=new ot,_=new B,m=new B;function p(A,y,M){l.fromBufferAttribute(i,A),u.fromBufferAttribute(i,y),d.fromBufferAttribute(i,M),f.fromBufferAttribute(s,A),h.fromBufferAttribute(s,y),g.fromBufferAttribute(s,M),u.sub(l),d.sub(l),h.sub(f),g.sub(f);let R=1/(h.x*g.y-g.x*h.y);isFinite(R)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(R),m.copy(d).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(R),a[A].add(_),a[y].add(_),a[M].add(_),c[A].add(m),c[y].add(m),c[M].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let A=0,y=E.length;A<y;++A){let M=E[A],R=M.start,L=M.count;for(let k=R,W=R+L;k<W;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let S=new B,x=new B,w=new B,I=new B;function T(A){w.fromBufferAttribute(r,A),I.copy(w);let y=a[A];S.copy(y),S.sub(w.multiplyScalar(w.dot(y))).normalize(),x.crossVectors(I,y);let R=x.dot(c[A])<0?-1:1;o.setXYZW(A,S.x,S.y,S.z,R)}for(let A=0,y=E.length;A<y;++A){let M=E[A],R=M.start,L=M.count;for(let k=R,W=R+L;k<W;k+=3)T(e.getX(k+0)),T(e.getX(k+1)),T(e.getX(k+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new en(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,h=i.count;f<h;f++)i.setXYZ(f,0,0,0);let r=new B,s=new B,o=new B,a=new B,c=new B,l=new B,u=new B,d=new B;if(e)for(let f=0,h=e.count;f<h;f+=3){let g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,h=t.count;f<h;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Gt.fromBufferAttribute(e,t),Gt.normalize(),e.setXYZ(t,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,d=a.normalized,f=new l.constructor(c.length*u),h=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?h=c[_]*a.data.stride+a.offset:h=c[_]*u;for(let p=0;p<u;p++)f[g++]=l[h++]}return new en(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,r=this.attributes;for(let a in r){let c=r[a],l=e(c,i);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let u=0,d=l.length;u<d;u++){let f=l[u],h=e(f,i);c.push(h)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let r={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,f=l.length;d<f;d++){let h=l[d];u.push(h.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let l in r){let u=r[l];this.setAttribute(l,u.clone(t))}let s=e.morphAttributes;for(let l in s){let u=[],d=s[l];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cx=new Bt,ys=new lc,Ou=new Ts,Ix=new B,Lu=new B,Fu=new B,ku=new B,jm=new B,Bu=new B,Ax=new B,Uu=new B,Qn=class extends kn{constructor(e=new gi,t=new dc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Bu.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let u=a[c],d=s[c];u!==0&&(jm.fromBufferAttribute(d,e),o?Bu.addScaledVector(jm,u):Bu.addScaledVector(jm.sub(t),u))}t.add(Bu)}return t}raycast(e,t){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ou.copy(i.boundingSphere),Ou.applyMatrix4(s),ys.copy(e.ray).recast(e.near),!(Ou.containsPoint(ys.origin)===!1&&(ys.intersectSphere(Ou,Ix)===null||ys.origin.distanceToSquared(Ix)>(e.far-e.near)**2))&&(Cx.copy(s).invert(),ys.copy(e.ray).applyMatrix4(Cx),!(i.boundingBox!==null&&ys.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ys)))}_computeIntersections(e,t,i){let r,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,h=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=o[m.materialIndex],E=Math.max(m.start,h.start),S=Math.min(a.count,Math.min(m.start+m.count,h.start+h.count));for(let x=E,w=S;x<w;x+=3){let I=a.getX(x),T=a.getX(x+1),A=a.getX(x+2);r=Vu(this,p,e,i,l,u,d,I,T,A),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,h.start),_=Math.min(a.count,h.start+h.count);for(let m=g,p=_;m<p;m+=3){let E=a.getX(m),S=a.getX(m+1),x=a.getX(m+2);r=Vu(this,o,e,i,l,u,d,E,S,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=o[m.materialIndex],E=Math.max(m.start,h.start),S=Math.min(c.count,Math.min(m.start+m.count,h.start+h.count));for(let x=E,w=S;x<w;x+=3){let I=x,T=x+1,A=x+2;r=Vu(this,p,e,i,l,u,d,I,T,A),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,h.start),_=Math.min(c.count,h.start+h.count);for(let m=g,p=_;m<p;m+=3){let E=m,S=m+1,x=m+2;r=Vu(this,o,e,i,l,u,d,E,S,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function XI(n,e,t,i,r,s,o,a){let c;if(e.side===ln?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side===sr,a),c===null)return null;Uu.copy(a),Uu.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(Uu);return l<t.near||l>t.far?null:{distance:l,point:Uu.clone(),object:n}}function Vu(n,e,t,i,r,s,o,a,c,l){n.getVertexPosition(a,Lu),n.getVertexPosition(c,Fu),n.getVertexPosition(l,ku);let u=XI(n,e,t,i,Lu,Fu,ku,Ax);if(u){let d=new B;Pr.getBarycoord(Ax,Lu,Fu,ku,d),r&&(u.uv=Pr.getInterpolatedAttribute(r,a,c,l,d,new ot)),s&&(u.uv1=Pr.getInterpolatedAttribute(s,a,c,l,d,new ot)),o&&(u.normal=Pr.getInterpolatedAttribute(o,a,c,l,d,new B),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new B,materialIndex:0};Pr.getNormal(Lu,Fu,ku,f.normal),u.face=f,u.barycoord=d}return u}var Vo=class n extends gi{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],u=[],d=[],f=0,h=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Ai(l,3)),this.setAttribute("normal",new Ai(u,3)),this.setAttribute("uv",new Ai(d,2));function g(_,m,p,E,S,x,w,I,T,A,y){let M=x/T,R=w/A,L=x/2,k=w/2,W=I/2,z=T+1,G=A+1,j=0,U=0,ne=new B;for(let oe=0;oe<G;oe++){let fe=oe*R-k;for(let Ae=0;Ae<z;Ae++){let et=Ae*M-L;ne[_]=et*E,ne[m]=fe*S,ne[p]=W,l.push(ne.x,ne.y,ne.z),ne[_]=0,ne[m]=0,ne[p]=I>0?1:-1,u.push(ne.x,ne.y,ne.z),d.push(Ae/T),d.push(1-oe/A),j+=1}}for(let oe=0;oe<A;oe++)for(let fe=0;fe<T;fe++){let Ae=f+fe+z*oe,et=f+fe+z*(oe+1),He=f+(fe+1)+z*(oe+1),Pe=f+(fe+1)+z*oe;c.push(Ae,et,Pe),c.push(et,He,Pe),U+=6}a.addGroup(h,U,y),h+=U,f+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ds(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function tn(n){let e={};for(let t=0;t<n.length;t++){let i=Ds(n[t]);for(let r in i)e[r]=i[r]}return e}function YI(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function vg(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}var wM={clone:Ds,merge:tn},ZI=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,JI=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_i=class extends kr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ZI,this.fragmentShader=JI,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ds(e.uniforms),this.uniformsGroups=YI(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},pc=class extends kn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Nr=new B,Dx=new ot,Rx=new ot,yn=class extends pc{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ju*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Sm*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ju*2*Math.atan(Math.tan(Sm*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Nr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nr.x,Nr.y).multiplyScalar(-e/Nr.z),Nr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Nr.x,Nr.y).multiplyScalar(-e/Nr.z)}getViewSize(e,t){return this.getViewBounds(e,Dx,Rx),t.subVectors(Rx,Dx)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Sm*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Oo=-90,Lo=1,td=class extends kn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new yn(Oo,Lo,e,t);r.layers=this.layers,this.add(r);let s=new yn(Oo,Lo,e,t);s.layers=this.layers,this.add(s);let o=new yn(Oo,Lo,e,t);o.layers=this.layers,this.add(o);let a=new yn(Oo,Lo,e,t);a.layers=this.layers,this.add(a);let c=new yn(Oo,Lo,e,t);c.layers=this.layers,this.add(c);let l=new yn(Oo,Lo,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,c]=t;for(let l of t)this.remove(l);if(e===pi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===oc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},mc=class extends xn{constructor(e=[],t=Is,i,r,s,o,a,c,l,u){super(e,t,i,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},nd=class extends Di{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new mc(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Vo(5,5,5),s=new _i({name:"CubemapFromEquirect",uniforms:Ds(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ln,blending:cr});s.uniforms.tEquirect.value=t;let o=new Qn(r,s),a=t.minFilter;return t.minFilter===Vr&&(t.minFilter=mi),new td(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}},Es=class extends kn{constructor(){super(),this.isGroup=!0,this.type="Group"}},KI={type:"move"},Ho=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Es,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Es,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Es,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,g=.005;l.inputState.pinching&&f>h+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=h-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(KI)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Es;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}};var gc=class extends kn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ri,this.environmentIntensity=1,this.environmentRotation=new Ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var $m=new B,QI=new B,eA=new ke,Ii=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=$m.subVectors(i,t).cross(QI.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta($m),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||eA.getNormalMatrix(e),r=this.coplanarPoint($m).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},xs=new Ts,tA=new ot(.5,.5),Hu=new B,_c=class{constructor(e=new Ii,t=new Ii,i=new Ii,r=new Ii,s=new Ii,o=new Ii){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=pi,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],u=s[4],d=s[5],f=s[6],h=s[7],g=s[8],_=s[9],m=s[10],p=s[11],E=s[12],S=s[13],x=s[14],w=s[15];if(r[0].setComponents(l-o,h-u,p-g,w-E).normalize(),r[1].setComponents(l+o,h+u,p+g,w+E).normalize(),r[2].setComponents(l+a,h+d,p+_,w+S).normalize(),r[3].setComponents(l-a,h-d,p-_,w-S).normalize(),i)r[4].setComponents(c,f,m,x).normalize(),r[5].setComponents(l-c,h-f,p-m,w-x).normalize();else if(r[4].setComponents(l-c,h-f,p-m,w-x).normalize(),t===pi)r[5].setComponents(l+c,h+f,p+m,w+x).normalize();else if(t===oc)r[5].setComponents(c,f,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),xs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xs)}intersectsSprite(e){xs.center.set(0,0,0);let t=tA.distanceTo(e.center);return xs.radius=.7071067811865476+t,xs.applyMatrix4(e.matrixWorld),this.intersectsSphere(xs)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(Hu.x=r.normal.x>0?e.max.x:e.min.x,Hu.y=r.normal.y>0?e.max.y:e.min.y,Hu.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Hu)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var zo=class extends kr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Nx=new Bt,Km=new lc,zu=new Ts,Gu=new B,vc=class extends kn{constructor(e=new gi,t=new zo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),zu.copy(i.boundingSphere),zu.applyMatrix4(r),zu.radius+=s,e.ray.intersectsSphere(zu)===!1)return;Nx.copy(r).invert(),Km.copy(e.ray).applyMatrix4(Nx);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,d=i.attributes.position;if(l!==null){let f=Math.max(0,o.start),h=Math.min(l.count,o.start+o.count);for(let g=f,_=h;g<_;g++){let m=l.getX(g);Gu.fromBufferAttribute(d,m),Px(Gu,m,c,r,e,t,this)}}else{let f=Math.max(0,o.start),h=Math.min(d.count,o.start+o.count);for(let g=f,_=h;g<_;g++)Gu.fromBufferAttribute(d,g),Px(Gu,g,c,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Px(n,e,t,i,r,s,o){let a=Km.distanceSqToPoint(n);if(a<t){let c=new B;Km.closestPointToPoint(n,c),c.applyMatrix4(i);let l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var yc=class extends xn{constructor(e,t,i,r,s,o,a,c,l){super(e,t,i,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},xc=class extends xn{constructor(e,t,i=Hr,r,s,o,a=Kn,c=Kn,l,u=ko,d=1){if(u!==ko&&u!==qo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:d};super(f,r,s,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Uo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Mc=class extends xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Ec=class n extends gi{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,d=e/a,f=t/c,h=[],g=[],_=[],m=[];for(let p=0;p<u;p++){let E=p*f-o;for(let S=0;S<l;S++){let x=S*d-s;g.push(x,-E,0),_.push(0,0,1),m.push(S/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let E=0;E<a;E++){let S=E+l*p,x=E+l*(p+1),w=E+1+l*(p+1),I=E+1+l*p;h.push(S,x,I),h.push(x,w,I)}this.setIndex(h),this.setAttribute("position",new Ai(g,3)),this.setAttribute("normal",new Ai(_,3)),this.setAttribute("uv",new Ai(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var id=class extends kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},rd=class extends kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Wu(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function nA(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var Cs=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=t[++i],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(i=2,s=a);for(let c=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(r=s,s=t[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=i[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},sd=class extends Cs{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qm,endingEnd:qm}}intervalChanged_(e,t,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case Xm:s=e,a=2*t-i;break;case Ym:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Xm:o=e,c=2*i-t;break;case Ym:o=1,c=i+r[1]-r[0];break;default:o=e-1,c=t}let l=(i-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,h=this._weightNext,g=(i-t)/(r-t),_=g*g,m=_*g,p=-f*m+2*f*_-f*g,E=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,S=(-1-h)*m+(1.5+h)*_+.5*g,x=h*m-h*_;for(let w=0;w!==a;++w)s[w]=p*o[u+w]+E*o[l+w]+S*o[c+w]+x*o[d+w];return s}},od=class extends Cs{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(i-t)/(r-t),d=1-u;for(let f=0;f!==a;++f)s[f]=o[l+f]*d+o[c+f]*u;return s}},ad=class extends Cs{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Bn=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Wu(t,this.TimeBufferType),this.values=Wu(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Wu(e.times,Array),values:Wu(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new ad(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new od(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sd(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case rc:t=this.InterpolantFactoryMethodDiscrete;break;case Zu:t=this.InterpolantFactoryMethodLinear;break;case ju:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return rc;case this.InterpolantFactoryMethodLinear:return Zu;case this.InterpolantFactoryMethodSmooth:return ju}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e}return this}trim(e,t){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(r!==void 0&&nA(r))for(let a=0,c=r.length;a!==c;++a){let l=r[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===ju,s=e.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(r)c=!0;else{let d=a*i,f=d-i,h=d+i;for(let g=0;g!==i;++g){let _=t[d+g];if(_!==t[f+g]||_!==t[h+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*i,f=o*i;for(let h=0;h!==i;++h)t[f+h]=t[d+h]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,c=o*i,l=0;l!==i;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Bn.prototype.ValueTypeName="";Bn.prototype.TimeBufferType=Float32Array;Bn.prototype.ValueBufferType=Float32Array;Bn.prototype.DefaultInterpolation=Zu;var Br=class extends Bn{constructor(e,t,i){super(e,t,i)}};Br.prototype.ValueTypeName="bool";Br.prototype.ValueBufferType=Array;Br.prototype.DefaultInterpolation=rc;Br.prototype.InterpolantFactoryMethodLinear=void 0;Br.prototype.InterpolantFactoryMethodSmooth=void 0;var cd=class extends Bn{constructor(e,t,i,r){super(e,t,i,r)}};cd.prototype.ValueTypeName="color";var ld=class extends Bn{constructor(e,t,i,r){super(e,t,i,r)}};ld.prototype.ValueTypeName="number";var ud=class extends Cs{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(r-t),l=e*a;for(let u=l+a;l!==u;l+=4)ar.slerpFlat(s,0,o,l-a,o,l,c);return s}},bc=class extends Bn{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new ud(this.times,this.values,this.getValueSize(),e)}};bc.prototype.ValueTypeName="quaternion";bc.prototype.InterpolantFactoryMethodSmooth=void 0;var Ur=class extends Bn{constructor(e,t,i){super(e,t,i)}};Ur.prototype.ValueTypeName="string";Ur.prototype.ValueBufferType=Array;Ur.prototype.DefaultInterpolation=rc;Ur.prototype.InterpolantFactoryMethodLinear=void 0;Ur.prototype.InterpolantFactoryMethodSmooth=void 0;var dd=class extends Bn{constructor(e,t,i,r){super(e,t,i,r)}};dd.prototype.ValueTypeName="vector";var fd=class{constructor(e,t,i){let r=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,f=l.length;d<f;d+=2){let h=l[d],g=l[d+1];if(h.global&&(h.lastIndex=0),h.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},TM=new fd,hd=class{constructor(e){this.manager=e!==void 0?e:TM,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};hd.DEFAULT_MATERIAL_NAME="__DEFAULT";var Go=class extends pc{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var pd=class extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var yg="\\[\\]\\.:\\/",iA=new RegExp("["+yg+"]","g"),xg="[^"+yg+"]",rA="[^"+yg.replace("\\.","")+"]",sA=/((?:WC+[\/:])*)/.source.replace("WC",xg),oA=/(WCOD+)?/.source.replace("WCOD",rA),aA=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",xg),cA=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",xg),lA=new RegExp("^"+sA+oA+aA+cA+"$"),uA=["material","materials","bones","map"],Qm=class{constructor(e,t,i){let r=i||_t.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},_t=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(iA,"")}static parseTrackName(e){let t=lA.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);uA.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[r];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_t.Composite=Qm;_t.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_t.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_t.prototype.GetterByBindingType=[_t.prototype._getValue_direct,_t.prototype._getValue_array,_t.prototype._getValue_arrayElement,_t.prototype._getValue_toArray];_t.prototype.SetterByBindingTypeAndVersioning=[[_t.prototype._setValue_direct,_t.prototype._setValue_direct_setNeedsUpdate,_t.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_array,_t.prototype._setValue_array_setNeedsUpdate,_t.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_arrayElement,_t.prototype._setValue_arrayElement_setNeedsUpdate,_t.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_fromArray,_t.prototype._setValue_fromArray_setNeedsUpdate,_t.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var cG=new Float32Array(1);function Mg(n,e,t,i){let r=dA(i);switch(t){case dg:return n*e;case hg:return n*e/r.components*r.byteLength;case Id:return n*e/r.components*r.byteLength;case pg:return n*e*2/r.components*r.byteLength;case Ad:return n*e*2/r.components*r.byteLength;case fg:return n*e*3/r.components*r.byteLength;case ei:return n*e*4/r.components*r.byteLength;case Dd:return n*e*4/r.components*r.byteLength;case Tc:case Cc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ic:case Ac:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Nd:case Od:return Math.max(n,16)*Math.max(e,8)/4;case Rd:case Pd:return Math.max(n,8)*Math.max(e,8)/2;case Ld:case Fd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case kd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Bd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ud:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Hd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case zd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Gd:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Wd:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case jd:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case $d:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case qd:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Xd:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Yd:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Zd:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Jd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Kd:case Qd:case ef:return Math.ceil(n/4)*Math.ceil(e/4)*16;case tf:case nf:return Math.ceil(n/4)*Math.ceil(e/4)*8;case rf:case sf:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dA(n){switch(n){case Oi:case ag:return{byteLength:1,components:1};case Wo:case cg:case jo:return{byteLength:2,components:1};case Td:case Cd:return{byteLength:2,components:4};case Hr:case wd:case Li:return{byteLength:4,components:1};case lg:case ug:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ZM(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function hA(n){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,d=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),a.onUploadCallback();let h;if(l instanceof Float32Array)h=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)h=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?h=n.HALF_FLOAT:h=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)h=n.SHORT;else if(l instanceof Uint32Array)h=n.UNSIGNED_INT;else if(l instanceof Int32Array)h=n.INT;else if(l instanceof Int8Array)h=n.BYTE;else if(l instanceof Uint8Array)h=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)h=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:h,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,c,l){let u=c.array,d=c.updateRanges;if(n.bindBuffer(l,a),d.length===0)n.bufferSubData(l,0,u);else{d.sort((h,g)=>h.start-g.start);let f=0;for(let h=1;h<d.length;h++){let g=d[f],_=d[h];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let h=0,g=d.length;h<g;h++){let _=d[h];n.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var pA=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mA=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_A=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xA=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,MA=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,EA=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,bA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,SA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,wA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,TA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,CA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,IA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,AA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,DA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,RA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,NA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,PA=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,OA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,LA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,FA=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,kA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,BA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,UA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,VA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,HA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,GA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,WA="gl_FragColor = linearToOutputTexel( gl_FragColor );",jA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,$A=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,qA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,XA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,YA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ZA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,JA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,KA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,QA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,eD=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tD=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,nD=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,iD=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rD=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sD=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,oD=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,aD=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cD=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lD=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,uD=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dD=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,fD=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hD=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,pD=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,mD=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gD=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_D=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vD=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yD=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xD=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,MD=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ED=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,bD=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,SD=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,wD=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,TD=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,CD=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ID=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,AD=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,DD=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,RD=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ND=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,PD=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,OD=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,LD=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,FD=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,kD=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,BD=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,UD=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,VD=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,HD=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zD=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,GD=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,WD=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jD=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,$D=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qD=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,XD=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,YD=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ZD=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,JD=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,KD=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,QD=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,e1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,t1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,n1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,i1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,r1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,s1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,o1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,a1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,c1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,l1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,u1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,d1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,f1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,h1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,p1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,g1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,v1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,y1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,x1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,M1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,E1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,b1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,S1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,T1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,C1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,I1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,N1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,O1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,L1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,F1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,B1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,U1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,V1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,H1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,z1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,G1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,W1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,j1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:pA,alphahash_pars_fragment:mA,alphamap_fragment:gA,alphamap_pars_fragment:_A,alphatest_fragment:vA,alphatest_pars_fragment:yA,aomap_fragment:xA,aomap_pars_fragment:MA,batching_pars_vertex:EA,batching_vertex:bA,begin_vertex:SA,beginnormal_vertex:wA,bsdfs:TA,iridescence_fragment:CA,bumpmap_pars_fragment:IA,clipping_planes_fragment:AA,clipping_planes_pars_fragment:DA,clipping_planes_pars_vertex:RA,clipping_planes_vertex:NA,color_fragment:PA,color_pars_fragment:OA,color_pars_vertex:LA,color_vertex:FA,common:kA,cube_uv_reflection_fragment:BA,defaultnormal_vertex:UA,displacementmap_pars_vertex:VA,displacementmap_vertex:HA,emissivemap_fragment:zA,emissivemap_pars_fragment:GA,colorspace_fragment:WA,colorspace_pars_fragment:jA,envmap_fragment:$A,envmap_common_pars_fragment:qA,envmap_pars_fragment:XA,envmap_pars_vertex:YA,envmap_physical_pars_fragment:oD,envmap_vertex:ZA,fog_vertex:JA,fog_pars_vertex:KA,fog_fragment:QA,fog_pars_fragment:eD,gradientmap_pars_fragment:tD,lightmap_pars_fragment:nD,lights_lambert_fragment:iD,lights_lambert_pars_fragment:rD,lights_pars_begin:sD,lights_toon_fragment:aD,lights_toon_pars_fragment:cD,lights_phong_fragment:lD,lights_phong_pars_fragment:uD,lights_physical_fragment:dD,lights_physical_pars_fragment:fD,lights_fragment_begin:hD,lights_fragment_maps:pD,lights_fragment_end:mD,logdepthbuf_fragment:gD,logdepthbuf_pars_fragment:_D,logdepthbuf_pars_vertex:vD,logdepthbuf_vertex:yD,map_fragment:xD,map_pars_fragment:MD,map_particle_fragment:ED,map_particle_pars_fragment:bD,metalnessmap_fragment:SD,metalnessmap_pars_fragment:wD,morphinstance_vertex:TD,morphcolor_vertex:CD,morphnormal_vertex:ID,morphtarget_pars_vertex:AD,morphtarget_vertex:DD,normal_fragment_begin:RD,normal_fragment_maps:ND,normal_pars_fragment:PD,normal_pars_vertex:OD,normal_vertex:LD,normalmap_pars_fragment:FD,clearcoat_normal_fragment_begin:kD,clearcoat_normal_fragment_maps:BD,clearcoat_pars_fragment:UD,iridescence_pars_fragment:VD,opaque_fragment:HD,packing:zD,premultiplied_alpha_fragment:GD,project_vertex:WD,dithering_fragment:jD,dithering_pars_fragment:$D,roughnessmap_fragment:qD,roughnessmap_pars_fragment:XD,shadowmap_pars_fragment:YD,shadowmap_pars_vertex:ZD,shadowmap_vertex:JD,shadowmask_pars_fragment:KD,skinbase_vertex:QD,skinning_pars_vertex:e1,skinning_vertex:t1,skinnormal_vertex:n1,specularmap_fragment:i1,specularmap_pars_fragment:r1,tonemapping_fragment:s1,tonemapping_pars_fragment:o1,transmission_fragment:a1,transmission_pars_fragment:c1,uv_pars_fragment:l1,uv_pars_vertex:u1,uv_vertex:d1,worldpos_vertex:f1,background_vert:h1,background_frag:p1,backgroundCube_vert:m1,backgroundCube_frag:g1,cube_vert:_1,cube_frag:v1,depth_vert:y1,depth_frag:x1,distanceRGBA_vert:M1,distanceRGBA_frag:E1,equirect_vert:b1,equirect_frag:S1,linedashed_vert:w1,linedashed_frag:T1,meshbasic_vert:C1,meshbasic_frag:I1,meshlambert_vert:A1,meshlambert_frag:D1,meshmatcap_vert:R1,meshmatcap_frag:N1,meshnormal_vert:P1,meshnormal_frag:O1,meshphong_vert:L1,meshphong_frag:F1,meshphysical_vert:k1,meshphysical_frag:B1,meshtoon_vert:U1,meshtoon_frag:V1,points_vert:H1,points_frag:z1,shadow_vert:G1,shadow_frag:W1,sprite_vert:j1,sprite_frag:$1},se={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},Fi={basic:{uniforms:tn([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:tn([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:tn([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:tn([se.common,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.roughnessmap,se.metalnessmap,se.fog,se.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:tn([se.common,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.gradientmap,se.fog,se.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:tn([se.common,se.bumpmap,se.normalmap,se.displacementmap,se.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:tn([se.points,se.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:tn([se.common,se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:tn([se.common,se.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:tn([se.common,se.bumpmap,se.normalmap,se.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:tn([se.sprite,se.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:tn([se.common,se.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:tn([se.lights,se.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};Fi.physical={uniforms:tn([Fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};var af={r:0,b:0,g:0},Rs=new Ri,q1=new Bt;function X1(n,e,t,i,r,s,o){let a=new qe(0),c=s===!0?0:1,l,u,d=null,f=0,h=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?t:e).get(x)),x}function _(S){let x=!1,w=g(S);w===null?p(a,c):w&&w.isColor&&(p(w,1),x=!0);let I=n.xr.getEnvironmentBlendMode();I==="additive"?i.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,x){let w=g(x);w&&(w.isCubeTexture||w.mapping===Sc)?(u===void 0&&(u=new Qn(new Vo(1,1,1),new _i({name:"BackgroundCubeMaterial",uniforms:Ds(Fi.backgroundCube.uniforms),vertexShader:Fi.backgroundCube.vertexShader,fragmentShader:Fi.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(I,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Rs.copy(x.backgroundRotation),Rs.x*=-1,Rs.y*=-1,Rs.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Rs.y*=-1,Rs.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(q1.makeRotationFromEuler(Rs)),u.material.toneMapped=Ze.getTransfer(w.colorSpace)!==st,(d!==w||f!==w.version||h!==n.toneMapping)&&(u.material.needsUpdate=!0,d=w,f=w.version,h=n.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new Qn(new Ec(2,2),new _i({name:"BackgroundMaterial",uniforms:Ds(Fi.background.uniforms),vertexShader:Fi.background.vertexShader,fragmentShader:Fi.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Ze.getTransfer(w.colorSpace)!==st,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||f!==w.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,d=w,f=w.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,x){S.getRGB(af,vg(n)),i.buffers.color.setClear(af.r,af.g,af.b,x,o)}function E(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,p(a,c)},render:_,addToRenderList:m,dispose:E}}function Y1(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null),s=r,o=!1;function a(M,R,L,k,W){let z=!1,G=d(k,L,R);s!==G&&(s=G,l(s.object)),z=h(M,k,L,W),z&&g(M,k,L,W),W!==null&&e.update(W,n.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,x(M,R,L,k),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function d(M,R,L){let k=L.wireframe===!0,W=i[M.id];W===void 0&&(W={},i[M.id]=W);let z=W[R.id];z===void 0&&(z={},W[R.id]=z);let G=z[k];return G===void 0&&(G=f(c()),z[k]=G),G}function f(M){let R=[],L=[],k=[];for(let W=0;W<t;W++)R[W]=0,L[W]=0,k[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:L,attributeDivisors:k,object:M,attributes:{},index:null}}function h(M,R,L,k){let W=s.attributes,z=R.attributes,G=0,j=L.getAttributes();for(let U in j)if(j[U].location>=0){let oe=W[U],fe=z[U];if(fe===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(fe=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(fe=M.instanceColor)),oe===void 0||oe.attribute!==fe||fe&&oe.data!==fe.data)return!0;G++}return s.attributesNum!==G||s.index!==k}function g(M,R,L,k){let W={},z=R.attributes,G=0,j=L.getAttributes();for(let U in j)if(j[U].location>=0){let oe=z[U];oe===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(oe=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(oe=M.instanceColor));let fe={};fe.attribute=oe,oe&&oe.data&&(fe.data=oe.data),W[U]=fe,G++}s.attributes=W,s.attributesNum=G,s.index=k}function _(){let M=s.newAttributes;for(let R=0,L=M.length;R<L;R++)M[R]=0}function m(M){p(M,0)}function p(M,R){let L=s.newAttributes,k=s.enabledAttributes,W=s.attributeDivisors;L[M]=1,k[M]===0&&(n.enableVertexAttribArray(M),k[M]=1),W[M]!==R&&(n.vertexAttribDivisor(M,R),W[M]=R)}function E(){let M=s.newAttributes,R=s.enabledAttributes;for(let L=0,k=R.length;L<k;L++)R[L]!==M[L]&&(n.disableVertexAttribArray(L),R[L]=0)}function S(M,R,L,k,W,z,G){G===!0?n.vertexAttribIPointer(M,R,L,W,z):n.vertexAttribPointer(M,R,L,k,W,z)}function x(M,R,L,k){_();let W=k.attributes,z=L.getAttributes(),G=R.defaultAttributeValues;for(let j in z){let U=z[j];if(U.location>=0){let ne=W[j];if(ne===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(ne=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(ne=M.instanceColor)),ne!==void 0){let oe=ne.normalized,fe=ne.itemSize,Ae=e.get(ne);if(Ae===void 0)continue;let et=Ae.buffer,He=Ae.type,Pe=Ae.bytesPerElement,X=He===n.INT||He===n.UNSIGNED_INT||ne.gpuType===wd;if(ne.isInterleavedBufferAttribute){let Z=ne.data,he=Z.stride,Oe=ne.offset;if(Z.isInstancedInterleavedBuffer){for(let Ee=0;Ee<U.locationSize;Ee++)p(U.location+Ee,Z.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let Ee=0;Ee<U.locationSize;Ee++)m(U.location+Ee);n.bindBuffer(n.ARRAY_BUFFER,et);for(let Ee=0;Ee<U.locationSize;Ee++)S(U.location+Ee,fe/U.locationSize,He,oe,he*Pe,(Oe+fe/U.locationSize*Ee)*Pe,X)}else{if(ne.isInstancedBufferAttribute){for(let Z=0;Z<U.locationSize;Z++)p(U.location+Z,ne.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Z=0;Z<U.locationSize;Z++)m(U.location+Z);n.bindBuffer(n.ARRAY_BUFFER,et);for(let Z=0;Z<U.locationSize;Z++)S(U.location+Z,fe/U.locationSize,He,oe,fe*Pe,fe/U.locationSize*Z*Pe,X)}}else if(G!==void 0){let oe=G[j];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(U.location,oe);break;case 3:n.vertexAttrib3fv(U.location,oe);break;case 4:n.vertexAttrib4fv(U.location,oe);break;default:n.vertexAttrib1fv(U.location,oe)}}}}E()}function w(){A();for(let M in i){let R=i[M];for(let L in R){let k=R[L];for(let W in k)u(k[W].object),delete k[W];delete R[L]}delete i[M]}}function I(M){if(i[M.id]===void 0)return;let R=i[M.id];for(let L in R){let k=R[L];for(let W in k)u(k[W].object),delete k[W];delete R[L]}delete i[M.id]}function T(M){for(let R in i){let L=i[R];if(L[M.id]===void 0)continue;let k=L[M.id];for(let W in k)u(k[W].object),delete k[W];delete L[M.id]}}function A(){y(),o=!0,s!==r&&(s=r,l(s.object))}function y(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:y,dispose:w,releaseStatesOfGeometry:I,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function Z1(n,e,t){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),t.update(u,i,1)}function o(l,u,d){d!==0&&(n.drawArraysInstanced(i,l,u,d),t.update(u,i,d))}function a(l,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,d);let h=0;for(let g=0;g<d;g++)h+=u[g];t.update(h,i,1)}function c(l,u,d,f){if(d===0)return;let h=e.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<l.length;g++)o(l[g],u[g],f[g]);else{h.multiDrawArraysInstancedWEBGL(i,l,0,u,0,f,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_]*f[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function J1(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==ei&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let A=T===jo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Oi&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Li&&!A)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,I=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:w,maxSamples:I}}function K1(n){let e=this,t=null,i=0,r=!1,s=!1,o=new Ii,a=new ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let h=d.length!==0||f||i!==0||r;return r=f,i=d.length,h},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){let g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{let E=s?0:i,S=E*4,x=p.clippingState||null;c.value=x,x=u(g,f,S,h);for(let w=0;w!==S;++w)x[w]=t[w];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,h,g){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let p=h+_*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,x=h;S!==_;++S,x+=4)o.copy(d[S]).applyMatrix4(E,a),o.normal.toArray(m,x),m[x+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Q1(n){let e=new WeakMap;function t(o,a){return a===Ed?o.mapping=Is:a===bd&&(o.mapping=As),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ed||a===bd)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new nd(c.height);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}var Yo=4,CM=[.125,.215,.35,.446,.526,.582],Os=20,Eg=new Go,IM=new qe,bg=null,Sg=0,wg=0,Tg=!1,Ps=(1+Math.sqrt(5))/2,Xo=1/Ps,AM=[new B(-Ps,Xo,0),new B(Ps,Xo,0),new B(-Xo,0,Ps),new B(Xo,0,Ps),new B(0,Ps,-Xo),new B(0,Ps,Xo),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)],eR=new B,uf=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){let{size:o=256,position:a=eR}=s;bg=this._renderer.getRenderTarget(),Sg=this._renderer.getActiveCubeFace(),wg=this._renderer.getActiveMipmapLevel(),Tg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=NM(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=RM(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(bg,Sg,wg),this._renderer.xr.enabled=Tg,e.scissorTest=!1,cf(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Is||e.mapping===As?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bg=this._renderer.getRenderTarget(),Sg=this._renderer.getActiveCubeFace(),wg=this._renderer.getActiveMipmapLevel(),Tg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:mi,minFilter:mi,generateMipmaps:!1,type:jo,format:ei,colorSpace:ws,depthBuffer:!1},r=DM(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=DM(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tR(s)),this._blurMaterial=nR(s,e,t)}return r}_compileMaterial(e){let t=new Qn(this._lodPlanes[0],e);this._renderer.compile(t,Eg)}_sceneToCubeUV(e,t,i,r,s){let c=new yn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(IM),d.toneMapping=lr,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null));let _=new dc({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1}),m=new Qn(new Vo,_),p=!1,E=e.background;E?E.isColor&&(_.color.copy(E),e.background=null,p=!0):(_.color.copy(IM),p=!0);for(let S=0;S<6;S++){let x=S%3;x===0?(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[S],s.y,s.z)):x===1?(c.up.set(0,0,l[S]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[S],s.z)):(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[S]));let w=this._cubeSize;cf(r,x*w,S>2?w:0,w,w),d.setRenderTarget(r),p&&d.render(m,c),d.render(e,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=f,e.background=E}_textureToCubeUV(e,t){let i=this._renderer,r=e.mapping===Is||e.mapping===As;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=NM()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=RM());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new Qn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;let c=this._cubeSize;cf(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Eg)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=AM[(r-s-1)%AM.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,d=new Qn(this._lodPlanes[r],l),f=l.uniforms,h=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*Os-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):Os;m>Os&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Os}`);let p=[],E=0;for(let T=0;T<Os;++T){let A=T/_,y=Math.exp(-A*A/2);p.push(y),T===0?E+=y:T<m&&(E+=2*y)}for(let T=0;T<p.length;T++)p[T]=p[T]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-i;let x=this._sizeLods[r],w=3*x*(r>S-Yo?r-S+Yo:0),I=4*(this._cubeSize-x);cf(t,w,I,3*x,2*x),c.setRenderTarget(t),c.render(d,Eg)}};function tR(n){let e=[],t=[],i=[],r=n,s=n-Yo+1+CM.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);t.push(a);let c=1/a;o>n-Yo?c=CM[o-n+Yo-1]:o===0&&(c=0),i.push(c);let l=1/(a-2),u=-l,d=1+l,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,g=6,_=3,m=2,p=1,E=new Float32Array(_*g*h),S=new Float32Array(m*g*h),x=new Float32Array(p*g*h);for(let I=0;I<h;I++){let T=I%3*2/3-1,A=I>2?0:-1,y=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];E.set(y,_*g*I),S.set(f,m*g*I);let M=[I,I,I,I,I,I];x.set(M,p*g*I)}let w=new gi;w.setAttribute("position",new en(E,_)),w.setAttribute("uv",new en(S,m)),w.setAttribute("faceIndex",new en(x,p)),e.push(w),r>Yo&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function DM(n,e,t){let i=new Di(n,e,t);return i.texture.mapping=Sc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function cf(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function nR(n,e,t){let i=new Float32Array(Os),r=new B(0,1,0);return new _i({name:"SphericalGaussianBlur",defines:{n:Os,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Fg(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function RM(){return new _i({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fg(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function NM(){return new _i({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fg(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Fg(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function iR(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let c=a.mapping,l=c===Ed||c===bd,u=c===Is||c===As;if(l||u){let d=e.get(a),f=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new uf(n)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let h=a.image;return l&&h&&h.height>0||u&&h&&r(h)?(t===null&&(t=new uf(n)),d=l?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function r(a){let c=0,l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function rR(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let r=t(i);return r===null&&Bo("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function sR(n,e,t,i){let r={},s=new WeakMap;function o(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete r[f.id];let h=s.get(f);h&&(e.remove(h),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(d,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function c(d){let f=d.attributes;for(let h in f)e.update(f[h],n.ARRAY_BUFFER)}function l(d){let f=[],h=d.index,g=d.attributes.position,_=0;if(h!==null){let E=h.array;_=h.version;for(let S=0,x=E.length;S<x;S+=3){let w=E[S+0],I=E[S+1],T=E[S+2];f.push(w,I,I,T,T,w)}}else if(g!==void 0){let E=g.array;_=g.version;for(let S=0,x=E.length/3-1;S<x;S+=3){let w=S+0,I=S+1,T=S+2;f.push(w,I,I,T,T,w)}}else return;let m=new(_g(f)?hc:fc)(f,1);m.version=_;let p=s.get(d);p&&e.remove(p),s.set(d,m)}function u(d){let f=s.get(d);if(f){let h=d.index;h!==null&&f.version<h.version&&l(d)}else l(d);return s.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function oR(n,e,t){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function c(f,h){n.drawElements(i,h,s,f*o),t.update(h,i,1)}function l(f,h,g){g!==0&&(n.drawElementsInstanced(i,h,s,f*o,g),t.update(h,i,g))}function u(f,h,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,f,0,g);let m=0;for(let p=0;p<g;p++)m+=h[p];t.update(m,i,1)}function d(f,h,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,h[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,h,0,s,f,0,_,0,g);let p=0;for(let E=0;E<g;E++)p+=h[E]*_[E];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function aR(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function cR(n,e,t){let i=new WeakMap,r=new Dt;function s(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,f=i.get(a);if(f===void 0||f.count!==d){let M=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",M)};var h=M;f!==void 0&&f.texture.dispose();let g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],E=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let w=a.attributes.position.count*x,I=1;w>e.maxTextureSize&&(I=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);let T=new Float32Array(w*I*4*d),A=new cc(T,w,I,d);A.type=Li,A.needsUpdate=!0;let y=x*4;for(let R=0;R<d;R++){let L=p[R],k=E[R],W=S[R],z=w*I*4*R;for(let G=0;G<L.count;G++){let j=G*y;g===!0&&(r.fromBufferAttribute(L,G),T[z+j+0]=r.x,T[z+j+1]=r.y,T[z+j+2]=r.z,T[z+j+3]=0),_===!0&&(r.fromBufferAttribute(k,G),T[z+j+4]=r.x,T[z+j+5]=r.y,T[z+j+6]=r.z,T[z+j+7]=0),m===!0&&(r.fromBufferAttribute(W,G),T[z+j+8]=r.x,T[z+j+9]=r.y,T[z+j+10]=r.z,T[z+j+11]=W.itemSize===4?r.w:1)}}f={count:d,texture:A,size:new ot(w,I)},i.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];let _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function lR(n,e,t,i){let r=new WeakMap;function s(c){let l=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return d}function o(){r=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}var JM=new xn,PM=new xc(1,1),KM=new cc,QM=new ed,eE=new mc,OM=[],LM=[],FM=new Float32Array(16),kM=new Float32Array(9),BM=new Float32Array(4);function Jo(n,e,t){let i=n[0];if(i<=0||i>0)return n;let r=e*t,s=OM[r];if(s===void 0&&(s=new Float32Array(r),OM[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Ut(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Vt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ff(n,e){let t=LM[e];t===void 0&&(t=new Int32Array(e),LM[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function uR(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function dR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2fv(this.addr,e),Vt(t,e)}}function fR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;n.uniform3fv(this.addr,e),Vt(t,e)}}function hR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4fv(this.addr,e),Vt(t,e)}}function pR(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(Ut(t,i))return;BM.set(i),n.uniformMatrix2fv(this.addr,!1,BM),Vt(t,i)}}function mR(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(Ut(t,i))return;kM.set(i),n.uniformMatrix3fv(this.addr,!1,kM),Vt(t,i)}}function gR(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(Ut(t,i))return;FM.set(i),n.uniformMatrix4fv(this.addr,!1,FM),Vt(t,i)}}function _R(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function vR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2iv(this.addr,e),Vt(t,e)}}function yR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3iv(this.addr,e),Vt(t,e)}}function xR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4iv(this.addr,e),Vt(t,e)}}function MR(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function ER(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2uiv(this.addr,e),Vt(t,e)}}function bR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3uiv(this.addr,e),Vt(t,e)}}function SR(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4uiv(this.addr,e),Vt(t,e)}}function wR(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(PM.compareFunction=mg,s=PM):s=JM,t.setTexture2D(e||s,r)}function TR(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||QM,r)}function CR(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||eE,r)}function IR(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||KM,r)}function AR(n){switch(n){case 5126:return uR;case 35664:return dR;case 35665:return fR;case 35666:return hR;case 35674:return pR;case 35675:return mR;case 35676:return gR;case 5124:case 35670:return _R;case 35667:case 35671:return vR;case 35668:case 35672:return yR;case 35669:case 35673:return xR;case 5125:return MR;case 36294:return ER;case 36295:return bR;case 36296:return SR;case 35678:case 36198:case 36298:case 36306:case 35682:return wR;case 35679:case 36299:case 36307:return TR;case 35680:case 36300:case 36308:case 36293:return CR;case 36289:case 36303:case 36311:case 36292:return IR}}function DR(n,e){n.uniform1fv(this.addr,e)}function RR(n,e){let t=Jo(e,this.size,2);n.uniform2fv(this.addr,t)}function NR(n,e){let t=Jo(e,this.size,3);n.uniform3fv(this.addr,t)}function PR(n,e){let t=Jo(e,this.size,4);n.uniform4fv(this.addr,t)}function OR(n,e){let t=Jo(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function LR(n,e){let t=Jo(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function FR(n,e){let t=Jo(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function kR(n,e){n.uniform1iv(this.addr,e)}function BR(n,e){n.uniform2iv(this.addr,e)}function UR(n,e){n.uniform3iv(this.addr,e)}function VR(n,e){n.uniform4iv(this.addr,e)}function HR(n,e){n.uniform1uiv(this.addr,e)}function zR(n,e){n.uniform2uiv(this.addr,e)}function GR(n,e){n.uniform3uiv(this.addr,e)}function WR(n,e){n.uniform4uiv(this.addr,e)}function jR(n,e,t){let i=this.cache,r=e.length,s=ff(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Vt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||JM,s[o])}function $R(n,e,t){let i=this.cache,r=e.length,s=ff(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Vt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||QM,s[o])}function qR(n,e,t){let i=this.cache,r=e.length,s=ff(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Vt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||eE,s[o])}function XR(n,e,t){let i=this.cache,r=e.length,s=ff(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Vt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||KM,s[o])}function YR(n){switch(n){case 5126:return DR;case 35664:return RR;case 35665:return NR;case 35666:return PR;case 35674:return OR;case 35675:return LR;case 35676:return FR;case 5124:case 35670:return kR;case 35667:case 35671:return BR;case 35668:case 35672:return UR;case 35669:case 35673:return VR;case 5125:return HR;case 36294:return zR;case 36295:return GR;case 36296:return WR;case 35678:case 36198:case 36298:case 36306:case 35682:return jR;case 35679:case 36299:case 36307:return $R;case 35680:case 36300:case 36308:case 36293:return qR;case 36289:case 36303:case 36311:case 36292:return XR}}var Ig=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=AR(t.type)}},Ag=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=YR(t.type)}},Dg=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],i)}}},Cg=/(\w+)(\])?(\[|\.)?/g;function UM(n,e){n.seq.push(e),n.map[e.id]=e}function ZR(n,e,t){let i=n.name,r=i.length;for(Cg.lastIndex=0;;){let s=Cg.exec(i),o=Cg.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){UM(t,l===void 0?new Ig(a,n,e):new Ag(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new Dg(a),UM(t,d)),t=d}}}var Zo=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);ZR(s,o,this)}}setValue(e,t,i,r){let s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&i.push(o)}return i}};function VM(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var JR=37297,KR=0;function QR(n,e){let t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var HM=new ke;function eN(n){Ze._getMatrix(HM,Ze.workingColorSpace,n);let e=`mat3( ${HM.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case sc:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function zM(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+QR(n.getShaderSource(e),a)}else return s}function tN(n,e){let t=eN(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function nN(n,e){let t;switch(e){case iM:t="Linear";break;case rM:t="Reinhard";break;case sM:t="Cineon";break;case oM:t="ACESFilmic";break;case cM:t="AgX";break;case lM:t="Neutral";break;case aM:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var lf=new B;function iN(){Ze.getLuminanceCoefficients(lf);let n=lf.x.toFixed(4),e=lf.y.toFixed(4),t=lf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rN(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rc).join(`
`)}function sN(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function oN(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=n.getActiveAttrib(e,r),o=s.name,a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Rc(n){return n!==""}function GM(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function WM(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var aN=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rg(n){return n.replace(aN,lN)}var cN=new Map;function lN(n,e){let t=Ve[e];if(t===void 0){let i=cN.get(e);if(i!==void 0)t=Ve[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Rg(t)}var uN=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jM(n){return n.replace(uN,dN)}function dN(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function $M(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function fN(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===tg?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Fx?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ni&&(e="SHADOWMAP_TYPE_VSM"),e}function hN(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Is:case As:e="ENVMAP_TYPE_CUBE";break;case Sc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function pN(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===As&&(e="ENVMAP_MODE_REFRACTION"),e}function mN(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case sg:e="ENVMAP_BLENDING_MULTIPLY";break;case tM:e="ENVMAP_BLENDING_MIX";break;case nM:e="ENVMAP_BLENDING_ADD";break}return e}function gN(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function _N(n,e,t,i){let r=n.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,c=fN(t),l=hN(t),u=pN(t),d=mN(t),f=gN(t),h=rN(t),g=sN(s),_=r.createProgram(),m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Rc).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Rc).join(`
`),p.length>0&&(p+=`
`)):(m=[$M(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rc).join(`
`),p=[$M(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==lr?"#define TONE_MAPPING":"",t.toneMapping!==lr?Ve.tonemapping_pars_fragment:"",t.toneMapping!==lr?nN("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,tN("linearToOutputTexel",t.outputColorSpace),iN(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Rc).join(`
`)),o=Rg(o),o=GM(o,t),o=WM(o,t),a=Rg(a),a=GM(a,t),a=WM(a,t),o=jM(o),a=jM(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===gg?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=E+m+o,x=E+p+a,w=VM(r,r.VERTEX_SHADER,S),I=VM(r,r.FRAGMENT_SHADER,x);r.attachShader(_,w),r.attachShader(_,I),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function T(R){if(n.debug.checkShaderErrors){let L=r.getProgramInfoLog(_)||"",k=r.getShaderInfoLog(w)||"",W=r.getShaderInfoLog(I)||"",z=L.trim(),G=k.trim(),j=W.trim(),U=!0,ne=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(U=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,w,I);else{let oe=zM(r,w,"vertex"),fe=zM(r,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+z+`
`+oe+`
`+fe)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(G===""||j==="")&&(ne=!1);ne&&(R.diagnostics={runnable:U,programLog:z,vertexShader:{log:G,prefix:m},fragmentShader:{log:j,prefix:p}})}r.deleteShader(w),r.deleteShader(I),A=new Zo(r,_),y=oN(r,_)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let y;this.getAttributes=function(){return y===void 0&&T(this),y};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,JR)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=KR++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=I,this}var vN=0,Ng=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Pg(e),t.set(e,i)),i}},Pg=class{constructor(e){this.id=vN++,this.code=e,this.usedTimes=0}};function yN(n,e,t,i,r,s,o){let a=new uc,c=new Ng,l=new Set,u=[],d=r.logarithmicDepthBuffer,f=r.vertexTextures,h=r.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,M,R,L,k){let W=L.fog,z=k.geometry,G=y.isMeshStandardMaterial?L.environment:null,j=(y.isMeshStandardMaterial?t:e).get(y.envMap||G),U=j&&j.mapping===Sc?j.image.height:null,ne=g[y.type];y.precision!==null&&(h=r.getMaxPrecision(y.precision),h!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let oe=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,fe=oe!==void 0?oe.length:0,Ae=0;z.morphAttributes.position!==void 0&&(Ae=1),z.morphAttributes.normal!==void 0&&(Ae=2),z.morphAttributes.color!==void 0&&(Ae=3);let et,He,Pe,X;if(ne){let nt=Fi[ne];et=nt.vertexShader,He=nt.fragmentShader}else et=y.vertexShader,He=y.fragmentShader,c.update(y),Pe=c.getVertexShaderID(y),X=c.getFragmentShaderID(y);let Z=n.getRenderTarget(),he=n.state.buffers.depth.getReversed(),Oe=k.isInstancedMesh===!0,Ee=k.isBatchedMesh===!0,Ye=!!y.map,Zt=!!y.matcap,D=!!j,vt=!!y.aoMap,Fe=!!y.lightMap,De=!!y.bumpMap,ge=!!y.normalMap,yt=!!y.displacementMap,_e=!!y.emissiveMap,Ue=!!y.metalnessMap,zt=!!y.roughnessMap,Pt=y.anisotropy>0,C=y.clearcoat>0,v=y.dispersion>0,F=y.iridescence>0,q=y.sheen>0,J=y.transmission>0,$=Pt&&!!y.anisotropyMap,Me=C&&!!y.clearcoatMap,ie=C&&!!y.clearcoatNormalMap,ve=C&&!!y.clearcoatRoughnessMap,ye=F&&!!y.iridescenceMap,ee=F&&!!y.iridescenceThicknessMap,le=q&&!!y.sheenColorMap,Ie=q&&!!y.sheenRoughnessMap,xe=!!y.specularMap,ae=!!y.specularColorMap,Be=!!y.specularIntensityMap,N=J&&!!y.transmissionMap,te=J&&!!y.thicknessMap,re=!!y.gradientMap,de=!!y.alphaMap,K=y.alphaTest>0,Y=!!y.alphaHash,me=!!y.extensions,Le=lr;y.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Le=n.toneMapping);let pt={shaderID:ne,shaderType:y.type,shaderName:y.name,vertexShader:et,fragmentShader:He,defines:y.defines,customVertexShaderID:Pe,customFragmentShaderID:X,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:Ee,batchingColor:Ee&&k._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&k.instanceColor!==null,instancingMorph:Oe&&k.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:ws,alphaToCoverage:!!y.alphaToCoverage,map:Ye,matcap:Zt,envMap:D,envMapMode:D&&j.mapping,envMapCubeUVHeight:U,aoMap:vt,lightMap:Fe,bumpMap:De,normalMap:ge,displacementMap:f&&yt,emissiveMap:_e,normalMapObjectSpace:ge&&y.normalMapType===pM,normalMapTangentSpace:ge&&y.normalMapType===hM,metalnessMap:Ue,roughnessMap:zt,anisotropy:Pt,anisotropyMap:$,clearcoat:C,clearcoatMap:Me,clearcoatNormalMap:ie,clearcoatRoughnessMap:ve,dispersion:v,iridescence:F,iridescenceMap:ye,iridescenceThicknessMap:ee,sheen:q,sheenColorMap:le,sheenRoughnessMap:Ie,specularMap:xe,specularColorMap:ae,specularIntensityMap:Be,transmission:J,transmissionMap:N,thicknessMap:te,gradientMap:re,opaque:y.transparent===!1&&y.blending===bs&&y.alphaToCoverage===!1,alphaMap:de,alphaTest:K,alphaHash:Y,combine:y.combine,mapUv:Ye&&_(y.map.channel),aoMapUv:vt&&_(y.aoMap.channel),lightMapUv:Fe&&_(y.lightMap.channel),bumpMapUv:De&&_(y.bumpMap.channel),normalMapUv:ge&&_(y.normalMap.channel),displacementMapUv:yt&&_(y.displacementMap.channel),emissiveMapUv:_e&&_(y.emissiveMap.channel),metalnessMapUv:Ue&&_(y.metalnessMap.channel),roughnessMapUv:zt&&_(y.roughnessMap.channel),anisotropyMapUv:$&&_(y.anisotropyMap.channel),clearcoatMapUv:Me&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:ie&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:le&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&_(y.sheenRoughnessMap.channel),specularMapUv:xe&&_(y.specularMap.channel),specularColorMapUv:ae&&_(y.specularColorMap.channel),specularIntensityMapUv:Be&&_(y.specularIntensityMap.channel),transmissionMapUv:N&&_(y.transmissionMap.channel),thicknessMapUv:te&&_(y.thicknessMap.channel),alphaMapUv:de&&_(y.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(ge||Pt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!z.attributes.uv&&(Ye||de),fog:!!W,useFog:y.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:he,skinning:k.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:fe,morphTextureStride:Ae,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Le,decodeVideoTexture:Ye&&y.map.isVideoTexture===!0&&Ze.getTransfer(y.map.colorSpace)===st,decodeVideoTextureEmissive:_e&&y.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(y.emissiveMap.colorSpace)===st,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Pi,flipSided:y.side===ln,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:me&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&y.extensions.multiDraw===!0||Ee)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return pt.vertexUv1s=l.has(1),pt.vertexUv2s=l.has(2),pt.vertexUv3s=l.has(3),l.clear(),pt}function p(y){let M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)M.push(R),M.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(E(M,y),S(M,y),M.push(n.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function E(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function S(y,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),y.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),y.push(a.mask)}function x(y){let M=g[y.type],R;if(M){let L=Fi[M];R=wM.clone(L.uniforms)}else R=y.uniforms;return R}function w(y,M){let R;for(let L=0,k=u.length;L<k;L++){let W=u[L];if(W.cacheKey===M){R=W,++R.usedTimes;break}}return R===void 0&&(R=new _N(n,M,y,s),u.push(R)),R}function I(y){if(--y.usedTimes===0){let M=u.indexOf(y);u[M]=u[u.length-1],u.pop(),y.destroy()}}function T(y){c.remove(y)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:w,releaseProgram:I,releaseShaderCache:T,programs:u,dispose:A}}function xN(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,c){n.get(o)[a]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function MN(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function qM(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function XM(){let n=[],e=0,t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(d,f,h,g,_,m){let p=n[e];return p===void 0?(p={id:d.id,object:d,geometry:f,material:h,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},n[e]=p):(p.id=d.id,p.object=d,p.geometry=f,p.material=h,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),e++,p}function a(d,f,h,g,_,m){let p=o(d,f,h,g,_,m);h.transmission>0?i.push(p):h.transparent===!0?r.push(p):t.push(p)}function c(d,f,h,g,_,m){let p=o(d,f,h,g,_,m);h.transmission>0?i.unshift(p):h.transparent===!0?r.unshift(p):t.unshift(p)}function l(d,f){t.length>1&&t.sort(d||MN),i.length>1&&i.sort(f||qM),r.length>1&&r.sort(f||qM)}function u(){for(let d=e,f=n.length;d<f;d++){let h=n[d];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function EN(){let n=new WeakMap;function e(i,r){let s=n.get(i),o;return s===void 0?(o=new XM,n.set(i,[o])):r>=s.length?(o=new XM,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function bN(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new qe};break;case"SpotLight":t={position:new B,direction:new B,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new B,halfWidth:new B,halfHeight:new B};break}return n[e.id]=t,t}}}function SN(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var wN=0;function TN(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function CN(n){let e=new bN,t=SN(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new B);let r=new B,s=new Bt,o=new Bt;function a(l){let u=0,d=0,f=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let h=0,g=0,_=0,m=0,p=0,E=0,S=0,x=0,w=0,I=0,T=0;l.sort(TN);for(let y=0,M=l.length;y<M;y++){let R=l[y],L=R.color,k=R.intensity,W=R.distance,z=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=L.r*k,d+=L.g*k,f+=L.b*k;else if(R.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(R.sh.coefficients[G],k);T++}else if(R.isDirectionalLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let j=R.shadow,U=t.get(R);U.shadowIntensity=j.intensity,U.shadowBias=j.bias,U.shadowNormalBias=j.normalBias,U.shadowRadius=j.radius,U.shadowMapSize=j.mapSize,i.directionalShadow[h]=U,i.directionalShadowMap[h]=z,i.directionalShadowMatrix[h]=R.shadow.matrix,E++}i.directional[h]=G,h++}else if(R.isSpotLight){let G=e.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(L).multiplyScalar(k),G.distance=W,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,i.spot[_]=G;let j=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,j.updateMatrices(R),R.castShadow&&I++),i.spotLightMatrix[_]=j.matrix,R.castShadow){let U=t.get(R);U.shadowIntensity=j.intensity,U.shadowBias=j.bias,U.shadowNormalBias=j.normalBias,U.shadowRadius=j.radius,U.shadowMapSize=j.mapSize,i.spotShadow[_]=U,i.spotShadowMap[_]=z,x++}_++}else if(R.isRectAreaLight){let G=e.get(R);G.color.copy(L).multiplyScalar(k),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=G,m++}else if(R.isPointLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){let j=R.shadow,U=t.get(R);U.shadowIntensity=j.intensity,U.shadowBias=j.bias,U.shadowNormalBias=j.normalBias,U.shadowRadius=j.radius,U.shadowMapSize=j.mapSize,U.shadowCameraNear=j.camera.near,U.shadowCameraFar=j.camera.far,i.pointShadow[g]=U,i.pointShadowMap[g]=z,i.pointShadowMatrix[g]=R.shadow.matrix,S++}i.point[g]=G,g++}else if(R.isHemisphereLight){let G=e.get(R);G.skyColor.copy(R.color).multiplyScalar(k),G.groundColor.copy(R.groundColor).multiplyScalar(k),i.hemi[p]=G,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=se.LTC_FLOAT_1,i.rectAreaLTC2=se.LTC_FLOAT_2):(i.rectAreaLTC1=se.LTC_HALF_1,i.rectAreaLTC2=se.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;let A=i.hash;(A.directionalLength!==h||A.pointLength!==g||A.spotLength!==_||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==E||A.numPointShadows!==S||A.numSpotShadows!==x||A.numSpotMaps!==w||A.numLightProbes!==T)&&(i.directional.length=h,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=x+w-I,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=T,A.directionalLength=h,A.pointLength=g,A.spotLength=_,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=E,A.numPointShadows=S,A.numSpotShadows=x,A.numSpotMaps=w,A.numLightProbes=T,i.version=wN++)}function c(l,u){let d=0,f=0,h=0,g=0,_=0,m=u.matrixWorldInverse;for(let p=0,E=l.length;p<E;p++){let S=l[p];if(S.isDirectionalLight){let x=i.directional[d];x.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),d++}else if(S.isSpotLight){let x=i.spot[h];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),h++}else if(S.isRectAreaLight){let x=i.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(S.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){let x=i.point[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){let x=i.hemi[_];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function YM(n){let e=new CN(n),t=[],i=[];function r(u){l.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}let l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function IN(n){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new YM(n),e.set(r,[a])):s>=o.length?(a=new YM(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var AN=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,DN=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function RN(n,e,t){let i=new _c,r=new ot,s=new ot,o=new Dt,a=new id({depthPacking:fM}),c=new rd,l={},u=t.maxTextureSize,d={[sr]:ln,[ln]:sr,[Pi]:Pi},f=new _i({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:AN,fragmentShader:DN}),h=f.clone();h.defines.HORIZONTAL_PASS=1;let g=new gi;g.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Qn(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tg;let p=this.type;this.render=function(I,T,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||I.length===0)return;let y=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),L=n.state;L.setBlending(cr),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let k=p!==Ni&&this.type===Ni,W=p===Ni&&this.type!==Ni;for(let z=0,G=I.length;z<G;z++){let j=I[z],U=j.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;r.copy(U.mapSize);let ne=U.getFrameExtents();if(r.multiply(ne),s.copy(U.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ne.x),r.x=s.x*ne.x,U.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ne.y),r.y=s.y*ne.y,U.mapSize.y=s.y)),U.map===null||k===!0||W===!0){let fe=this.type!==Ni?{minFilter:Kn,magFilter:Kn}:{};U.map!==null&&U.map.dispose(),U.map=new Di(r.x,r.y,fe),U.map.texture.name=j.name+".shadowMap",U.camera.updateProjectionMatrix()}n.setRenderTarget(U.map),n.clear();let oe=U.getViewportCount();for(let fe=0;fe<oe;fe++){let Ae=U.getViewport(fe);o.set(s.x*Ae.x,s.y*Ae.y,s.x*Ae.z,s.y*Ae.w),L.viewport(o),U.updateMatrices(j,fe),i=U.getFrustum(),x(T,A,U.camera,j,this.type)}U.isPointLightShadow!==!0&&this.type===Ni&&E(U,A),U.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(y,M,R)};function E(I,T){let A=e.update(_);f.defines.VSM_SAMPLES!==I.blurSamples&&(f.defines.VSM_SAMPLES=I.blurSamples,h.defines.VSM_SAMPLES=I.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new Di(r.x,r.y)),f.uniforms.shadow_pass.value=I.map.texture,f.uniforms.resolution.value=I.mapSize,f.uniforms.radius.value=I.radius,n.setRenderTarget(I.mapPass),n.clear(),n.renderBufferDirect(T,null,A,f,_,null),h.uniforms.shadow_pass.value=I.mapPass.texture,h.uniforms.resolution.value=I.mapSize,h.uniforms.radius.value=I.radius,n.setRenderTarget(I.map),n.clear(),n.renderBufferDirect(T,null,A,h,_,null)}function S(I,T,A,y){let M=null,R=A.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(R!==void 0)M=R;else if(M=A.isPointLight===!0?c:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let L=M.uuid,k=T.uuid,W=l[L];W===void 0&&(W={},l[L]=W);let z=W[k];z===void 0&&(z=M.clone(),W[k]=z,T.addEventListener("dispose",w)),M=z}if(M.visible=T.visible,M.wireframe=T.wireframe,y===Ni?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:d[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let L=n.properties.get(M);L.light=A}return M}function x(I,T,A,y,M){if(I.visible===!1)return;if(I.layers.test(T.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&M===Ni)&&(!I.frustumCulled||i.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,I.matrixWorld);let k=e.update(I),W=I.material;if(Array.isArray(W)){let z=k.groups;for(let G=0,j=z.length;G<j;G++){let U=z[G],ne=W[U.materialIndex];if(ne&&ne.visible){let oe=S(I,ne,y,M);I.onBeforeShadow(n,I,T,A,k,oe,U),n.renderBufferDirect(A,null,k,oe,I,U),I.onAfterShadow(n,I,T,A,k,oe,U)}}}else if(W.visible){let z=S(I,W,y,M);I.onBeforeShadow(n,I,T,A,k,z,null),n.renderBufferDirect(A,null,k,z,I,null),I.onAfterShadow(n,I,T,A,k,z,null)}}let L=I.children;for(let k=0,W=L.length;k<W;k++)x(L[k],T,A,y,M)}function w(I){I.target.removeEventListener("dispose",w);for(let A in l){let y=l[A],M=I.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}var NN={[md]:gd,[_d]:xd,[vd]:Md,[Ss]:yd,[gd]:md,[xd]:_d,[Md]:vd,[yd]:Ss};function PN(n,e){function t(){let N=!1,te=new Dt,re=null,de=new Dt(0,0,0,0);return{setMask:function(K){re!==K&&!N&&(n.colorMask(K,K,K,K),re=K)},setLocked:function(K){N=K},setClear:function(K,Y,me,Le,pt){pt===!0&&(K*=Le,Y*=Le,me*=Le),te.set(K,Y,me,Le),de.equals(te)===!1&&(n.clearColor(K,Y,me,Le),de.copy(te))},reset:function(){N=!1,re=null,de.set(-1,0,0,0)}}}function i(){let N=!1,te=!1,re=null,de=null,K=null;return{setReversed:function(Y){if(te!==Y){let me=e.get("EXT_clip_control");Y?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),te=Y;let Le=K;K=null,this.setClear(Le)}},getReversed:function(){return te},setTest:function(Y){Y?Z(n.DEPTH_TEST):he(n.DEPTH_TEST)},setMask:function(Y){re!==Y&&!N&&(n.depthMask(Y),re=Y)},setFunc:function(Y){if(te&&(Y=NN[Y]),de!==Y){switch(Y){case md:n.depthFunc(n.NEVER);break;case gd:n.depthFunc(n.ALWAYS);break;case _d:n.depthFunc(n.LESS);break;case Ss:n.depthFunc(n.LEQUAL);break;case vd:n.depthFunc(n.EQUAL);break;case yd:n.depthFunc(n.GEQUAL);break;case xd:n.depthFunc(n.GREATER);break;case Md:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=Y}},setLocked:function(Y){N=Y},setClear:function(Y){K!==Y&&(te&&(Y=1-Y),n.clearDepth(Y),K=Y)},reset:function(){N=!1,re=null,de=null,K=null,te=!1}}}function r(){let N=!1,te=null,re=null,de=null,K=null,Y=null,me=null,Le=null,pt=null;return{setTest:function(nt){N||(nt?Z(n.STENCIL_TEST):he(n.STENCIL_TEST))},setMask:function(nt){te!==nt&&!N&&(n.stencilMask(nt),te=nt)},setFunc:function(nt,Hi,vi){(re!==nt||de!==Hi||K!==vi)&&(n.stencilFunc(nt,Hi,vi),re=nt,de=Hi,K=vi)},setOp:function(nt,Hi,vi){(Y!==nt||me!==Hi||Le!==vi)&&(n.stencilOp(nt,Hi,vi),Y=nt,me=Hi,Le=vi)},setLocked:function(nt){N=nt},setClear:function(nt){pt!==nt&&(n.clearStencil(nt),pt=nt)},reset:function(){N=!1,te=null,re=null,de=null,K=null,Y=null,me=null,Le=null,pt=null}}}let s=new t,o=new i,a=new r,c=new WeakMap,l=new WeakMap,u={},d={},f=new WeakMap,h=[],g=null,_=!1,m=null,p=null,E=null,S=null,x=null,w=null,I=null,T=new qe(0,0,0),A=0,y=!1,M=null,R=null,L=null,k=null,W=null,z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,j=0,U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(U)[1]),G=j>=1):U.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),G=j>=2);let ne=null,oe={},fe=n.getParameter(n.SCISSOR_BOX),Ae=n.getParameter(n.VIEWPORT),et=new Dt().fromArray(fe),He=new Dt().fromArray(Ae);function Pe(N,te,re,de){let K=new Uint8Array(4),Y=n.createTexture();n.bindTexture(N,Y),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let me=0;me<re;me++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(te,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,K):n.texImage2D(te+me,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,K);return Y}let X={};X[n.TEXTURE_2D]=Pe(n.TEXTURE_2D,n.TEXTURE_2D,1),X[n.TEXTURE_CUBE_MAP]=Pe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[n.TEXTURE_2D_ARRAY]=Pe(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),X[n.TEXTURE_3D]=Pe(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Z(n.DEPTH_TEST),o.setFunc(Ss),De(!1),ge(eg),Z(n.CULL_FACE),vt(cr);function Z(N){u[N]!==!0&&(n.enable(N),u[N]=!0)}function he(N){u[N]!==!1&&(n.disable(N),u[N]=!1)}function Oe(N,te){return d[N]!==te?(n.bindFramebuffer(N,te),d[N]=te,N===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=te),N===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=te),!0):!1}function Ee(N,te){let re=h,de=!1;if(N){re=f.get(te),re===void 0&&(re=[],f.set(te,re));let K=N.textures;if(re.length!==K.length||re[0]!==n.COLOR_ATTACHMENT0){for(let Y=0,me=K.length;Y<me;Y++)re[Y]=n.COLOR_ATTACHMENT0+Y;re.length=K.length,de=!0}}else re[0]!==n.BACK&&(re[0]=n.BACK,de=!0);de&&n.drawBuffers(re)}function Ye(N){return g!==N?(n.useProgram(N),g=N,!0):!1}let Zt={[Lr]:n.FUNC_ADD,[Bx]:n.FUNC_SUBTRACT,[Ux]:n.FUNC_REVERSE_SUBTRACT};Zt[Vx]=n.MIN,Zt[Hx]=n.MAX;let D={[zx]:n.ZERO,[Gx]:n.ONE,[Wx]:n.SRC_COLOR,[$u]:n.SRC_ALPHA,[Zx]:n.SRC_ALPHA_SATURATE,[Xx]:n.DST_COLOR,[$x]:n.DST_ALPHA,[jx]:n.ONE_MINUS_SRC_COLOR,[qu]:n.ONE_MINUS_SRC_ALPHA,[Yx]:n.ONE_MINUS_DST_COLOR,[qx]:n.ONE_MINUS_DST_ALPHA,[Jx]:n.CONSTANT_COLOR,[Kx]:n.ONE_MINUS_CONSTANT_COLOR,[Qx]:n.CONSTANT_ALPHA,[eM]:n.ONE_MINUS_CONSTANT_ALPHA};function vt(N,te,re,de,K,Y,me,Le,pt,nt){if(N===cr){_===!0&&(he(n.BLEND),_=!1);return}if(_===!1&&(Z(n.BLEND),_=!0),N!==kx){if(N!==m||nt!==y){if((p!==Lr||x!==Lr)&&(n.blendEquation(n.FUNC_ADD),p=Lr,x=Lr),nt)switch(N){case bs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ng:n.blendFunc(n.ONE,n.ONE);break;case ig:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case rg:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case bs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ng:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ig:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rg:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}E=null,S=null,w=null,I=null,T.set(0,0,0),A=0,m=N,y=nt}return}K=K||te,Y=Y||re,me=me||de,(te!==p||K!==x)&&(n.blendEquationSeparate(Zt[te],Zt[K]),p=te,x=K),(re!==E||de!==S||Y!==w||me!==I)&&(n.blendFuncSeparate(D[re],D[de],D[Y],D[me]),E=re,S=de,w=Y,I=me),(Le.equals(T)===!1||pt!==A)&&(n.blendColor(Le.r,Le.g,Le.b,pt),T.copy(Le),A=pt),m=N,y=!1}function Fe(N,te){N.side===Pi?he(n.CULL_FACE):Z(n.CULL_FACE);let re=N.side===ln;te&&(re=!re),De(re),N.blending===bs&&N.transparent===!1?vt(cr):vt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);let de=N.stencilWrite;a.setTest(de),de&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),_e(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):he(n.SAMPLE_ALPHA_TO_COVERAGE)}function De(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function ge(N){N!==Ox?(Z(n.CULL_FACE),N!==R&&(N===eg?n.cullFace(n.BACK):N===Lx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):he(n.CULL_FACE),R=N}function yt(N){N!==L&&(G&&n.lineWidth(N),L=N)}function _e(N,te,re){N?(Z(n.POLYGON_OFFSET_FILL),(k!==te||W!==re)&&(n.polygonOffset(te,re),k=te,W=re)):he(n.POLYGON_OFFSET_FILL)}function Ue(N){N?Z(n.SCISSOR_TEST):he(n.SCISSOR_TEST)}function zt(N){N===void 0&&(N=n.TEXTURE0+z-1),ne!==N&&(n.activeTexture(N),ne=N)}function Pt(N,te,re){re===void 0&&(ne===null?re=n.TEXTURE0+z-1:re=ne);let de=oe[re];de===void 0&&(de={type:void 0,texture:void 0},oe[re]=de),(de.type!==N||de.texture!==te)&&(ne!==re&&(n.activeTexture(re),ne=re),n.bindTexture(N,te||X[N]),de.type=N,de.texture=te)}function C(){let N=oe[ne];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function v(){try{n.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function F(){try{n.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function q(){try{n.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{n.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $(){try{n.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Me(){try{n.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ie(){try{n.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{n.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ye(){try{n.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{n.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function le(N){et.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),et.copy(N))}function Ie(N){He.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),He.copy(N))}function xe(N,te){let re=l.get(te);re===void 0&&(re=new WeakMap,l.set(te,re));let de=re.get(N);de===void 0&&(de=n.getUniformBlockIndex(te,N.name),re.set(N,de))}function ae(N,te){let de=l.get(te).get(N);c.get(te)!==de&&(n.uniformBlockBinding(te,de,N.__bindingPointIndex),c.set(te,de))}function Be(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ne=null,oe={},d={},f=new WeakMap,h=[],g=null,_=!1,m=null,p=null,E=null,S=null,x=null,w=null,I=null,T=new qe(0,0,0),A=0,y=!1,M=null,R=null,L=null,k=null,W=null,et.set(0,0,n.canvas.width,n.canvas.height),He.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:Z,disable:he,bindFramebuffer:Oe,drawBuffers:Ee,useProgram:Ye,setBlending:vt,setMaterial:Fe,setFlipSided:De,setCullFace:ge,setLineWidth:yt,setPolygonOffset:_e,setScissorTest:Ue,activeTexture:zt,bindTexture:Pt,unbindTexture:C,compressedTexImage2D:v,compressedTexImage3D:F,texImage2D:ye,texImage3D:ee,updateUBOMapping:xe,uniformBlockBinding:ae,texStorage2D:ie,texStorage3D:ve,texSubImage2D:q,texSubImage3D:J,compressedTexSubImage2D:$,compressedTexSubImage3D:Me,scissor:le,viewport:Ie,reset:Be}}function ON(n,e,t,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ot,u=new WeakMap,d,f=new WeakMap,h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,v){return h?new OffscreenCanvas(C,v):ac("canvas")}function _(C,v,F){let q=1,J=Pt(C);if((J.width>F||J.height>F)&&(q=F/Math.max(J.width,J.height)),q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let $=Math.floor(q*J.width),Me=Math.floor(q*J.height);d===void 0&&(d=g($,Me));let ie=v?g($,Me):d;return ie.width=$,ie.height=Me,ie.getContext("2d").drawImage(C,0,0,$,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+$+"x"+Me+")."),ie}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(C,v,F,q,J=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let $=v;if(v===n.RED&&(F===n.FLOAT&&($=n.R32F),F===n.HALF_FLOAT&&($=n.R16F),F===n.UNSIGNED_BYTE&&($=n.R8)),v===n.RED_INTEGER&&(F===n.UNSIGNED_BYTE&&($=n.R8UI),F===n.UNSIGNED_SHORT&&($=n.R16UI),F===n.UNSIGNED_INT&&($=n.R32UI),F===n.BYTE&&($=n.R8I),F===n.SHORT&&($=n.R16I),F===n.INT&&($=n.R32I)),v===n.RG&&(F===n.FLOAT&&($=n.RG32F),F===n.HALF_FLOAT&&($=n.RG16F),F===n.UNSIGNED_BYTE&&($=n.RG8)),v===n.RG_INTEGER&&(F===n.UNSIGNED_BYTE&&($=n.RG8UI),F===n.UNSIGNED_SHORT&&($=n.RG16UI),F===n.UNSIGNED_INT&&($=n.RG32UI),F===n.BYTE&&($=n.RG8I),F===n.SHORT&&($=n.RG16I),F===n.INT&&($=n.RG32I)),v===n.RGB_INTEGER&&(F===n.UNSIGNED_BYTE&&($=n.RGB8UI),F===n.UNSIGNED_SHORT&&($=n.RGB16UI),F===n.UNSIGNED_INT&&($=n.RGB32UI),F===n.BYTE&&($=n.RGB8I),F===n.SHORT&&($=n.RGB16I),F===n.INT&&($=n.RGB32I)),v===n.RGBA_INTEGER&&(F===n.UNSIGNED_BYTE&&($=n.RGBA8UI),F===n.UNSIGNED_SHORT&&($=n.RGBA16UI),F===n.UNSIGNED_INT&&($=n.RGBA32UI),F===n.BYTE&&($=n.RGBA8I),F===n.SHORT&&($=n.RGBA16I),F===n.INT&&($=n.RGBA32I)),v===n.RGB&&(F===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),F===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),v===n.RGBA){let Me=J?sc:Ze.getTransfer(q);F===n.FLOAT&&($=n.RGBA32F),F===n.HALF_FLOAT&&($=n.RGBA16F),F===n.UNSIGNED_BYTE&&($=Me===st?n.SRGB8_ALPHA8:n.RGBA8),F===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),F===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function x(C,v){let F;return C?v===null||v===Hr||v===$o?F=n.DEPTH24_STENCIL8:v===Li?F=n.DEPTH32F_STENCIL8:v===Wo&&(F=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Hr||v===$o?F=n.DEPTH_COMPONENT24:v===Li?F=n.DEPTH_COMPONENT32F:v===Wo&&(F=n.DEPTH_COMPONENT16),F}function w(C,v){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Kn&&C.minFilter!==mi?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function I(C){let v=C.target;v.removeEventListener("dispose",I),A(v),v.isVideoTexture&&u.delete(v)}function T(C){let v=C.target;v.removeEventListener("dispose",T),M(v)}function A(C){let v=i.get(C);if(v.__webglInit===void 0)return;let F=C.source,q=f.get(F);if(q){let J=q[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&y(C),Object.keys(q).length===0&&f.delete(F)}i.remove(C)}function y(C){let v=i.get(C);n.deleteTexture(v.__webglTexture);let F=C.source,q=f.get(F);delete q[v.__cacheKey],o.memory.textures--}function M(C){let v=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(v.__webglFramebuffer[q]))for(let J=0;J<v.__webglFramebuffer[q].length;J++)n.deleteFramebuffer(v.__webglFramebuffer[q][J]);else n.deleteFramebuffer(v.__webglFramebuffer[q]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[q])}else{if(Array.isArray(v.__webglFramebuffer))for(let q=0;q<v.__webglFramebuffer.length;q++)n.deleteFramebuffer(v.__webglFramebuffer[q]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let q=0;q<v.__webglColorRenderbuffer.length;q++)v.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[q]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let F=C.textures;for(let q=0,J=F.length;q<J;q++){let $=i.get(F[q]);$.__webglTexture&&(n.deleteTexture($.__webglTexture),o.memory.textures--),i.remove(F[q])}i.remove(C)}let R=0;function L(){R=0}function k(){let C=R;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),R+=1,C}function W(C){let v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function z(C,v){let F=i.get(C);if(C.isVideoTexture&&Ue(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&F.__version!==C.version){let q=C.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(F,C,v);return}}else C.isExternalTexture&&(F.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,F.__webglTexture,n.TEXTURE0+v)}function G(C,v){let F=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&F.__version!==C.version){X(F,C,v);return}t.bindTexture(n.TEXTURE_2D_ARRAY,F.__webglTexture,n.TEXTURE0+v)}function j(C,v){let F=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&F.__version!==C.version){X(F,C,v);return}t.bindTexture(n.TEXTURE_3D,F.__webglTexture,n.TEXTURE0+v)}function U(C,v){let F=i.get(C);if(C.version>0&&F.__version!==C.version){Z(F,C,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+v)}let ne={[Xu]:n.REPEAT,[Or]:n.CLAMP_TO_EDGE,[Yu]:n.MIRRORED_REPEAT},oe={[Kn]:n.NEAREST,[uM]:n.NEAREST_MIPMAP_NEAREST,[wc]:n.NEAREST_MIPMAP_LINEAR,[mi]:n.LINEAR,[Sd]:n.LINEAR_MIPMAP_NEAREST,[Vr]:n.LINEAR_MIPMAP_LINEAR},fe={[mM]:n.NEVER,[MM]:n.ALWAYS,[gM]:n.LESS,[mg]:n.LEQUAL,[_M]:n.EQUAL,[xM]:n.GEQUAL,[vM]:n.GREATER,[yM]:n.NOTEQUAL};function Ae(C,v){if(v.type===Li&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===mi||v.magFilter===Sd||v.magFilter===wc||v.magFilter===Vr||v.minFilter===mi||v.minFilter===Sd||v.minFilter===wc||v.minFilter===Vr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,ne[v.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,ne[v.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,ne[v.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,oe[v.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,oe[v.minFilter]),v.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,fe[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Kn||v.minFilter!==wc&&v.minFilter!==Vr||v.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function et(C,v){let F=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",I));let q=v.source,J=f.get(q);J===void 0&&(J={},f.set(q,J));let $=W(v);if($!==C.__cacheKey){J[$]===void 0&&(J[$]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,F=!0),J[$].usedTimes++;let Me=J[C.__cacheKey];Me!==void 0&&(J[C.__cacheKey].usedTimes--,Me.usedTimes===0&&y(v)),C.__cacheKey=$,C.__webglTexture=J[$].texture}return F}function He(C,v,F){return Math.floor(Math.floor(C/F)/v)}function Pe(C,v,F,q){let $=C.updateRanges;if($.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,F,q,v.data);else{$.sort((ee,le)=>ee.start-le.start);let Me=0;for(let ee=1;ee<$.length;ee++){let le=$[Me],Ie=$[ee],xe=le.start+le.count,ae=He(Ie.start,v.width,4),Be=He(le.start,v.width,4);Ie.start<=xe+1&&ae===Be&&He(Ie.start+Ie.count-1,v.width,4)===ae?le.count=Math.max(le.count,Ie.start+Ie.count-le.start):(++Me,$[Me]=Ie)}$.length=Me+1;let ie=n.getParameter(n.UNPACK_ROW_LENGTH),ve=n.getParameter(n.UNPACK_SKIP_PIXELS),ye=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let ee=0,le=$.length;ee<le;ee++){let Ie=$[ee],xe=Math.floor(Ie.start/4),ae=Math.ceil(Ie.count/4),Be=xe%v.width,N=Math.floor(xe/v.width),te=ae,re=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Be),n.pixelStorei(n.UNPACK_SKIP_ROWS,N),t.texSubImage2D(n.TEXTURE_2D,0,Be,N,te,re,F,q,v.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ie),n.pixelStorei(n.UNPACK_SKIP_PIXELS,ve),n.pixelStorei(n.UNPACK_SKIP_ROWS,ye)}}function X(C,v,F){let q=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(q=n.TEXTURE_3D);let J=et(C,v),$=v.source;t.bindTexture(q,C.__webglTexture,n.TEXTURE0+F);let Me=i.get($);if($.version!==Me.__version||J===!0){t.activeTexture(n.TEXTURE0+F);let ie=Ze.getPrimaries(Ze.workingColorSpace),ve=v.colorSpace===ur?null:Ze.getPrimaries(v.colorSpace),ye=v.colorSpace===ur||ie===ve?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let ee=_(v.image,!1,r.maxTextureSize);ee=zt(v,ee);let le=s.convert(v.format,v.colorSpace),Ie=s.convert(v.type),xe=S(v.internalFormat,le,Ie,v.colorSpace,v.isVideoTexture);Ae(q,v);let ae,Be=v.mipmaps,N=v.isVideoTexture!==!0,te=Me.__version===void 0||J===!0,re=$.dataReady,de=w(v,ee);if(v.isDepthTexture)xe=x(v.format===qo,v.type),te&&(N?t.texStorage2D(n.TEXTURE_2D,1,xe,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,xe,ee.width,ee.height,0,le,Ie,null));else if(v.isDataTexture)if(Be.length>0){N&&te&&t.texStorage2D(n.TEXTURE_2D,de,xe,Be[0].width,Be[0].height);for(let K=0,Y=Be.length;K<Y;K++)ae=Be[K],N?re&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,ae.width,ae.height,le,Ie,ae.data):t.texImage2D(n.TEXTURE_2D,K,xe,ae.width,ae.height,0,le,Ie,ae.data);v.generateMipmaps=!1}else N?(te&&t.texStorage2D(n.TEXTURE_2D,de,xe,ee.width,ee.height),re&&Pe(v,ee,le,Ie)):t.texImage2D(n.TEXTURE_2D,0,xe,ee.width,ee.height,0,le,Ie,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){N&&te&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,xe,Be[0].width,Be[0].height,ee.depth);for(let K=0,Y=Be.length;K<Y;K++)if(ae=Be[K],v.format!==ei)if(le!==null)if(N){if(re)if(v.layerUpdates.size>0){let me=Mg(ae.width,ae.height,v.format,v.type);for(let Le of v.layerUpdates){let pt=ae.data.subarray(Le*me/ae.data.BYTES_PER_ELEMENT,(Le+1)*me/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,Le,ae.width,ae.height,1,le,pt)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ae.width,ae.height,ee.depth,le,ae.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,xe,ae.width,ae.height,ee.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?re&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ae.width,ae.height,ee.depth,le,Ie,ae.data):t.texImage3D(n.TEXTURE_2D_ARRAY,K,xe,ae.width,ae.height,ee.depth,0,le,Ie,ae.data)}else{N&&te&&t.texStorage2D(n.TEXTURE_2D,de,xe,Be[0].width,Be[0].height);for(let K=0,Y=Be.length;K<Y;K++)ae=Be[K],v.format!==ei?le!==null?N?re&&t.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,ae.width,ae.height,le,ae.data):t.compressedTexImage2D(n.TEXTURE_2D,K,xe,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?re&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,ae.width,ae.height,le,Ie,ae.data):t.texImage2D(n.TEXTURE_2D,K,xe,ae.width,ae.height,0,le,Ie,ae.data)}else if(v.isDataArrayTexture)if(N){if(te&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,xe,ee.width,ee.height,ee.depth),re)if(v.layerUpdates.size>0){let K=Mg(ee.width,ee.height,v.format,v.type);for(let Y of v.layerUpdates){let me=ee.data.subarray(Y*K/ee.data.BYTES_PER_ELEMENT,(Y+1)*K/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Y,ee.width,ee.height,1,le,Ie,me)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,le,Ie,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,xe,ee.width,ee.height,ee.depth,0,le,Ie,ee.data);else if(v.isData3DTexture)N?(te&&t.texStorage3D(n.TEXTURE_3D,de,xe,ee.width,ee.height,ee.depth),re&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,le,Ie,ee.data)):t.texImage3D(n.TEXTURE_3D,0,xe,ee.width,ee.height,ee.depth,0,le,Ie,ee.data);else if(v.isFramebufferTexture){if(te)if(N)t.texStorage2D(n.TEXTURE_2D,de,xe,ee.width,ee.height);else{let K=ee.width,Y=ee.height;for(let me=0;me<de;me++)t.texImage2D(n.TEXTURE_2D,me,xe,K,Y,0,le,Ie,null),K>>=1,Y>>=1}}else if(Be.length>0){if(N&&te){let K=Pt(Be[0]);t.texStorage2D(n.TEXTURE_2D,de,xe,K.width,K.height)}for(let K=0,Y=Be.length;K<Y;K++)ae=Be[K],N?re&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,le,Ie,ae):t.texImage2D(n.TEXTURE_2D,K,xe,le,Ie,ae);v.generateMipmaps=!1}else if(N){if(te){let K=Pt(ee);t.texStorage2D(n.TEXTURE_2D,de,xe,K.width,K.height)}re&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,le,Ie,ee)}else t.texImage2D(n.TEXTURE_2D,0,xe,le,Ie,ee);m(v)&&p(q),Me.__version=$.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function Z(C,v,F){if(v.image.length!==6)return;let q=et(C,v),J=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+F);let $=i.get(J);if(J.version!==$.__version||q===!0){t.activeTexture(n.TEXTURE0+F);let Me=Ze.getPrimaries(Ze.workingColorSpace),ie=v.colorSpace===ur?null:Ze.getPrimaries(v.colorSpace),ve=v.colorSpace===ur||Me===ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let ye=v.isCompressedTexture||v.image[0].isCompressedTexture,ee=v.image[0]&&v.image[0].isDataTexture,le=[];for(let Y=0;Y<6;Y++)!ye&&!ee?le[Y]=_(v.image[Y],!0,r.maxCubemapSize):le[Y]=ee?v.image[Y].image:v.image[Y],le[Y]=zt(v,le[Y]);let Ie=le[0],xe=s.convert(v.format,v.colorSpace),ae=s.convert(v.type),Be=S(v.internalFormat,xe,ae,v.colorSpace),N=v.isVideoTexture!==!0,te=$.__version===void 0||q===!0,re=J.dataReady,de=w(v,Ie);Ae(n.TEXTURE_CUBE_MAP,v);let K;if(ye){N&&te&&t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Be,Ie.width,Ie.height);for(let Y=0;Y<6;Y++){K=le[Y].mipmaps;for(let me=0;me<K.length;me++){let Le=K[me];v.format!==ei?xe!==null?N?re&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,0,0,Le.width,Le.height,xe,Le.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,Be,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,0,0,Le.width,Le.height,xe,ae,Le.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,Be,Le.width,Le.height,0,xe,ae,Le.data)}}}else{if(K=v.mipmaps,N&&te){K.length>0&&de++;let Y=Pt(le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Be,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ee){N?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,le[Y].width,le[Y].height,xe,ae,le[Y].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Be,le[Y].width,le[Y].height,0,xe,ae,le[Y].data);for(let me=0;me<K.length;me++){let pt=K[me].image[Y].image;N?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,0,0,pt.width,pt.height,xe,ae,pt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,Be,pt.width,pt.height,0,xe,ae,pt.data)}}else{N?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,xe,ae,le[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Be,xe,ae,le[Y]);for(let me=0;me<K.length;me++){let Le=K[me];N?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,0,0,xe,ae,Le.image[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,Be,xe,ae,Le.image[Y])}}}m(v)&&p(n.TEXTURE_CUBE_MAP),$.__version=J.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function he(C,v,F,q,J,$){let Me=s.convert(F.format,F.colorSpace),ie=s.convert(F.type),ve=S(F.internalFormat,Me,ie,F.colorSpace),ye=i.get(v),ee=i.get(F);if(ee.__renderTarget=v,!ye.__hasExternalTextures){let le=Math.max(1,v.width>>$),Ie=Math.max(1,v.height>>$);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,$,ve,le,Ie,v.depth,0,Me,ie,null):t.texImage2D(J,$,ve,le,Ie,0,Me,ie,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),_e(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,J,ee.__webglTexture,0,yt(v)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,J,ee.__webglTexture,$),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Oe(C,v,F){if(n.bindRenderbuffer(n.RENDERBUFFER,C),v.depthBuffer){let q=v.depthTexture,J=q&&q.isDepthTexture?q.type:null,$=x(v.stencilBuffer,J),Me=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=yt(v);_e(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ie,$,v.width,v.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,$,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,$,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Me,n.RENDERBUFFER,C)}else{let q=v.textures;for(let J=0;J<q.length;J++){let $=q[J],Me=s.convert($.format,$.colorSpace),ie=s.convert($.type),ve=S($.internalFormat,Me,ie,$.colorSpace),ye=yt(v);F&&_e(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ye,ve,v.width,v.height):_e(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ye,ve,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ve,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ee(C,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=i.get(v.depthTexture);q.__renderTarget=v,(!q.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),z(v.depthTexture,0);let J=q.__webglTexture,$=yt(v);if(v.depthTexture.format===ko)_e(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(v.depthTexture.format===qo)_e(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ye(C){let v=i.get(C),F=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){let q=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),q){let J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,q.removeEventListener("dispose",J)};q.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=q}if(C.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");let q=C.texture.mipmaps;q&&q.length>0?Ee(v.__webglFramebuffer[0],C):Ee(v.__webglFramebuffer,C)}else if(F){v.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[q]),v.__webglDepthbuffer[q]===void 0)v.__webglDepthbuffer[q]=n.createRenderbuffer(),Oe(v.__webglDepthbuffer[q],C,!1);else{let J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=v.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,$)}}else{let q=C.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),Oe(v.__webglDepthbuffer,C,!1);else{let J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,$)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Zt(C,v,F){let q=i.get(C);v!==void 0&&he(q.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),F!==void 0&&Ye(C)}function D(C){let v=C.texture,F=i.get(C),q=i.get(v);C.addEventListener("dispose",T);let J=C.textures,$=C.isWebGLCubeRenderTarget===!0,Me=J.length>1;if(Me||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=v.version,o.memory.textures++),$){F.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[ie]=[];for(let ve=0;ve<v.mipmaps.length;ve++)F.__webglFramebuffer[ie][ve]=n.createFramebuffer()}else F.__webglFramebuffer[ie]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let ie=0;ie<v.mipmaps.length;ie++)F.__webglFramebuffer[ie]=n.createFramebuffer()}else F.__webglFramebuffer=n.createFramebuffer();if(Me)for(let ie=0,ve=J.length;ie<ve;ie++){let ye=i.get(J[ie]);ye.__webglTexture===void 0&&(ye.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&_e(C)===!1){F.__webglMultisampledFramebuffer=n.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ie=0;ie<J.length;ie++){let ve=J[ie];F.__webglColorRenderbuffer[ie]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,F.__webglColorRenderbuffer[ie]);let ye=s.convert(ve.format,ve.colorSpace),ee=s.convert(ve.type),le=S(ve.internalFormat,ye,ee,ve.colorSpace,C.isXRRenderTarget===!0),Ie=yt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ie,le,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ie,n.RENDERBUFFER,F.__webglColorRenderbuffer[ie])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(F.__webglDepthRenderbuffer=n.createRenderbuffer(),Oe(F.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if($){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Ae(n.TEXTURE_CUBE_MAP,v);for(let ie=0;ie<6;ie++)if(v.mipmaps&&v.mipmaps.length>0)for(let ve=0;ve<v.mipmaps.length;ve++)he(F.__webglFramebuffer[ie][ve],C,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ve);else he(F.__webglFramebuffer[ie],C,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(v)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let ie=0,ve=J.length;ie<ve;ie++){let ye=J[ie],ee=i.get(ye),le=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(le=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(le,ee.__webglTexture),Ae(le,ye),he(F.__webglFramebuffer,C,ye,n.COLOR_ATTACHMENT0+ie,le,0),m(ye)&&p(le)}t.unbindTexture()}else{let ie=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ie=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,q.__webglTexture),Ae(ie,v),v.mipmaps&&v.mipmaps.length>0)for(let ve=0;ve<v.mipmaps.length;ve++)he(F.__webglFramebuffer[ve],C,v,n.COLOR_ATTACHMENT0,ie,ve);else he(F.__webglFramebuffer,C,v,n.COLOR_ATTACHMENT0,ie,0);m(v)&&p(ie),t.unbindTexture()}C.depthBuffer&&Ye(C)}function vt(C){let v=C.textures;for(let F=0,q=v.length;F<q;F++){let J=v[F];if(m(J)){let $=E(C),Me=i.get(J).__webglTexture;t.bindTexture($,Me),p($),t.unbindTexture()}}}let Fe=[],De=[];function ge(C){if(C.samples>0){if(_e(C)===!1){let v=C.textures,F=C.width,q=C.height,J=n.COLOR_BUFFER_BIT,$=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Me=i.get(C),ie=v.length>1;if(ie)for(let ye=0;ye<v.length;ye++)t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);let ve=C.texture.mipmaps;ve&&ve.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let ye=0;ye<v.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),ie){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Me.__webglColorRenderbuffer[ye]);let ee=i.get(v[ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ee,0)}n.blitFramebuffer(0,0,F,q,0,0,F,q,J,n.NEAREST),c===!0&&(Fe.length=0,De.length=0,Fe.push(n.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Fe.push($),De.push($),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,De)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Fe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ie)for(let ye=0;ye<v.length;ye++){t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,Me.__webglColorRenderbuffer[ye]);let ee=i.get(v[ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,ee,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let v=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function yt(C){return Math.min(r.maxSamples,C.samples)}function _e(C){let v=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Ue(C){let v=o.render.frame;u.get(C)!==v&&(u.set(C,v),C.update())}function zt(C,v){let F=C.colorSpace,q=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||F!==ws&&F!==ur&&(Ze.getTransfer(F)===st?(q!==ei||J!==Oi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),v}function Pt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=L,this.setTexture2D=z,this.setTexture2DArray=G,this.setTexture3D=j,this.setTextureCube=U,this.rebindTextures=Zt,this.setupRenderTarget=D,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=he,this.useMultisampledRTT=_e}function LN(n,e){function t(i,r=ur){let s,o=Ze.getTransfer(r);if(i===Oi)return n.UNSIGNED_BYTE;if(i===Td)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Cd)return n.UNSIGNED_SHORT_5_5_5_1;if(i===lg)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ug)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ag)return n.BYTE;if(i===cg)return n.SHORT;if(i===Wo)return n.UNSIGNED_SHORT;if(i===wd)return n.INT;if(i===Hr)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===jo)return n.HALF_FLOAT;if(i===dg)return n.ALPHA;if(i===fg)return n.RGB;if(i===ei)return n.RGBA;if(i===ko)return n.DEPTH_COMPONENT;if(i===qo)return n.DEPTH_STENCIL;if(i===hg)return n.RED;if(i===Id)return n.RED_INTEGER;if(i===pg)return n.RG;if(i===Ad)return n.RG_INTEGER;if(i===Dd)return n.RGBA_INTEGER;if(i===Tc||i===Cc||i===Ic||i===Ac)if(o===st)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Tc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Cc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ic)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ac)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Tc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Cc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ic)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ac)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Rd||i===Nd||i===Pd||i===Od)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Rd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Nd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Pd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Od)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ld||i===Fd||i===kd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ld||i===Fd)return o===st?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===kd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Bd||i===Ud||i===Vd||i===Hd||i===zd||i===Gd||i===Wd||i===jd||i===$d||i===qd||i===Xd||i===Yd||i===Zd||i===Jd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Bd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ud)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Vd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Hd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===zd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Gd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Wd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===jd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===$d)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===qd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Xd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Yd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Zd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Jd)return o===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Kd||i===Qd||i===ef)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Kd)return o===st?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Qd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ef)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===tf||i===nf||i===rf||i===sf)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===tf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===nf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===rf)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===sf)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$o?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var FN=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,kN=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Og=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Mc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new _i({vertexShader:FN,fragmentShader:kN,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Qn(new Ec(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Lg=class extends or{constructor(e,t){super();let i=this,r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,f=null,h=null,g=null,_=typeof XRWebGLBinding<"u",m=new Og,p={},E=t.getContextAttributes(),S=null,x=null,w=[],I=[],T=new ot,A=null,y=new yn;y.viewport=new Dt;let M=new yn;M.viewport=new Dt;let R=[y,M],L=new pd,k=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=w[X];return Z===void 0&&(Z=new Ho,w[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=w[X];return Z===void 0&&(Z=new Ho,w[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=w[X];return Z===void 0&&(Z=new Ho,w[X]=Z),Z.getHandSpace()};function z(X){let Z=I.indexOf(X.inputSource);if(Z===-1)return;let he=w[Z];he!==void 0&&(he.update(X.inputSource,X.frame,l||o),he.dispatchEvent({type:X.type,data:X.inputSource}))}function G(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",j);for(let X=0;X<w.length;X++){let Z=I[X];Z!==null&&(I[X]=null,w[X].disconnect(Z))}k=null,W=null,m.reset();for(let X in p)delete p[X];e.setRenderTarget(S),h=null,f=null,d=null,r=null,x=null,Pe.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(S=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",G),r.addEventListener("inputsourceschange",j),E.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,Oe=null,Ee=null;E.depth&&(Ee=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=E.stencil?qo:ko,Oe=E.stencil?$o:Hr);let Ye={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(Ye),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Di(f.textureWidth,f.textureHeight,{format:ei,type:Oi,depthTexture:new xc(f.textureWidth,f.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let he={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,t,he),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),x=new Di(h.framebufferWidth,h.framebufferHeight,{format:ei,type:Oi,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),Pe.setContext(r),Pe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function j(X){for(let Z=0;Z<X.removed.length;Z++){let he=X.removed[Z],Oe=I.indexOf(he);Oe>=0&&(I[Oe]=null,w[Oe].disconnect(he))}for(let Z=0;Z<X.added.length;Z++){let he=X.added[Z],Oe=I.indexOf(he);if(Oe===-1){for(let Ye=0;Ye<w.length;Ye++)if(Ye>=I.length){I.push(he),Oe=Ye;break}else if(I[Ye]===null){I[Ye]=he,Oe=Ye;break}if(Oe===-1)break}let Ee=w[Oe];Ee&&Ee.connect(he)}}let U=new B,ne=new B;function oe(X,Z,he){U.setFromMatrixPosition(Z.matrixWorld),ne.setFromMatrixPosition(he.matrixWorld);let Oe=U.distanceTo(ne),Ee=Z.projectionMatrix.elements,Ye=he.projectionMatrix.elements,Zt=Ee[14]/(Ee[10]-1),D=Ee[14]/(Ee[10]+1),vt=(Ee[9]+1)/Ee[5],Fe=(Ee[9]-1)/Ee[5],De=(Ee[8]-1)/Ee[0],ge=(Ye[8]+1)/Ye[0],yt=Zt*De,_e=Zt*ge,Ue=Oe/(-De+ge),zt=Ue*-De;if(Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(zt),X.translateZ(Ue),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ee[10]===-1)X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{let Pt=Zt+Ue,C=D+Ue,v=yt-zt,F=_e+(Oe-zt),q=vt*D/C*Pt,J=Fe*D/C*Pt;X.projectionMatrix.makePerspective(v,F,q,J,Pt,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function fe(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let Z=X.near,he=X.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(he=m.depthFar)),L.near=M.near=y.near=Z,L.far=M.far=y.far=he,(k!==L.near||W!==L.far)&&(r.updateRenderState({depthNear:L.near,depthFar:L.far}),k=L.near,W=L.far),L.layers.mask=X.layers.mask|6,y.layers.mask=L.layers.mask&3,M.layers.mask=L.layers.mask&5;let Oe=X.parent,Ee=L.cameras;fe(L,Oe);for(let Ye=0;Ye<Ee.length;Ye++)fe(Ee[Ye],Oe);Ee.length===2?oe(L,y,M):L.projectionMatrix.copy(y.projectionMatrix),Ae(X,L,Oe)};function Ae(X,Z,he){he===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(he.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Ju*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&h===null))return c},this.setFoveation=function(X){c=X,f!==null&&(f.fixedFoveation=X),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=X)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(X){return p[X]};let et=null;function He(X,Z){if(u=Z.getViewerPose(l||o),g=Z,u!==null){let he=u.views;h!==null&&(e.setRenderTargetFramebuffer(x,h.framebuffer),e.setRenderTarget(x));let Oe=!1;he.length!==L.cameras.length&&(L.cameras.length=0,Oe=!0);for(let D=0;D<he.length;D++){let vt=he[D],Fe=null;if(h!==null)Fe=h.getViewport(vt);else{let ge=d.getViewSubImage(f,vt);Fe=ge.viewport,D===0&&(e.setRenderTargetTextures(x,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(x))}let De=R[D];De===void 0&&(De=new yn,De.layers.enable(D),De.viewport=new Dt,R[D]=De),De.matrix.fromArray(vt.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(vt.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),D===0&&(L.matrix.copy(De.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Oe===!0&&L.cameras.push(De)}let Ee=r.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){d=i.getBinding();let D=d.getDepthInformation(he[0]);D&&D.isValid&&D.texture&&m.init(D,r.renderState)}if(Ee&&Ee.includes("camera-access")&&_){e.state.unbindTexture(),d=i.getBinding();for(let D=0;D<he.length;D++){let vt=he[D].camera;if(vt){let Fe=p[vt];Fe||(Fe=new Mc,p[vt]=Fe);let De=d.getCameraImage(vt);Fe.sourceTexture=De}}}}for(let he=0;he<w.length;he++){let Oe=I[he],Ee=w[he];Oe!==null&&Ee!==void 0&&Ee.update(Oe,Z,l||o)}et&&et(X,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),g=null}let Pe=new ZM;Pe.setAnimationLoop(He),this.setAnimationLoop=function(X){et=X},this.dispose=function(){}}},Ns=new Ri,BN=new Bt;function UN(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,vg(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,E,S,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),f(m,p),p.isMeshPhysicalMaterial&&h(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,E,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===ln&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===ln&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let E=e.get(p),S=E.envMap,x=E.envMapRotation;S&&(m.envMap.value=S,Ns.copy(x),Ns.x*=-1,Ns.y*=-1,Ns.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Ns.y*=-1,Ns.z*=-1),m.envMapRotation.value.setFromMatrix4(BN.makeRotationFromEuler(Ns)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,E,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=S*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ln&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function VN(n,e,t,i){let r={},s={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,S){let x=S.program;i.uniformBlockBinding(E,x)}function l(E,S){let x=r[E.id];x===void 0&&(g(E),x=u(E),r[E.id]=x,E.addEventListener("dispose",m));let w=S.program;i.updateUBOMapping(E,w);let I=e.render.frame;s[E.id]!==I&&(f(E),s[E.id]=I)}function u(E){let S=d();E.__bindingPointIndex=S;let x=n.createBuffer(),w=E.__size,I=E.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,w,I),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,x),x}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let S=r[E.id],x=E.uniforms,w=E.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let I=0,T=x.length;I<T;I++){let A=Array.isArray(x[I])?x[I]:[x[I]];for(let y=0,M=A.length;y<M;y++){let R=A[y];if(h(R,I,y,w)===!0){let L=R.__offset,k=Array.isArray(R.value)?R.value:[R.value],W=0;for(let z=0;z<k.length;z++){let G=k[z],j=_(G);typeof G=="number"||typeof G=="boolean"?(R.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,L+W,R.__data)):G.isMatrix3?(R.__data[0]=G.elements[0],R.__data[1]=G.elements[1],R.__data[2]=G.elements[2],R.__data[3]=0,R.__data[4]=G.elements[3],R.__data[5]=G.elements[4],R.__data[6]=G.elements[5],R.__data[7]=0,R.__data[8]=G.elements[6],R.__data[9]=G.elements[7],R.__data[10]=G.elements[8],R.__data[11]=0):(G.toArray(R.__data,W),W+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,L,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(E,S,x,w){let I=E.value,T=S+"_"+x;if(w[T]===void 0)return typeof I=="number"||typeof I=="boolean"?w[T]=I:w[T]=I.clone(),!0;{let A=w[T];if(typeof I=="number"||typeof I=="boolean"){if(A!==I)return w[T]=I,!0}else if(A.equals(I)===!1)return A.copy(I),!0}return!1}function g(E){let S=E.uniforms,x=0,w=16;for(let T=0,A=S.length;T<A;T++){let y=Array.isArray(S[T])?S[T]:[S[T]];for(let M=0,R=y.length;M<R;M++){let L=y[M],k=Array.isArray(L.value)?L.value:[L.value];for(let W=0,z=k.length;W<z;W++){let G=k[W],j=_(G),U=x%w,ne=U%j.boundary,oe=U+ne;x+=ne,oe!==0&&w-oe<j.storage&&(x+=w-oe),L.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=x,x+=j.storage}}}let I=x%w;return I>0&&(x+=w-I),E.__size=x,E.__cache={},this}function _(E){let S={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(S.boundary=4,S.storage=4):E.isVector2?(S.boundary=8,S.storage=8):E.isVector3||E.isColor?(S.boundary=16,S.storage=12):E.isVector4?(S.boundary=16,S.storage=16):E.isMatrix3?(S.boundary=48,S.storage=48):E.isMatrix4?(S.boundary=64,S.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),S}function m(E){let S=E.target;S.removeEventListener("dispose",m);let x=o.indexOf(S.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function p(){for(let E in r)n.deleteBuffer(r[E]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}var df=class{constructor(e={}){let{canvas:t=EM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let h;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=i.getContextAttributes().alpha}else h=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,E=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=lr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,w=!1;this._outputColorSpace=qt;let I=0,T=0,A=null,y=-1,M=null,R=new Dt,L=new Dt,k=null,W=new qe(0),z=0,G=t.width,j=t.height,U=1,ne=null,oe=null,fe=new Dt(0,0,G,j),Ae=new Dt(0,0,G,j),et=!1,He=new _c,Pe=!1,X=!1,Z=new Bt,he=new B,Oe=new Dt,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ye=!1;function Zt(){return A===null?U:1}let D=i;function vt(b,P){return t.getContext(b,P)}try{let b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",K,!1),D===null){let P="webgl2";if(D=vt(P,b),D===null)throw vt(P)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Fe,De,ge,yt,_e,Ue,zt,Pt,C,v,F,q,J,$,Me,ie,ve,ye,ee,le,Ie,xe,ae,Be;function N(){Fe=new rR(D),Fe.init(),xe=new LN(D,Fe),De=new J1(D,Fe,e,xe),ge=new PN(D,Fe),De.reversedDepthBuffer&&f&&ge.buffers.depth.setReversed(!0),yt=new aR(D),_e=new xN,Ue=new ON(D,Fe,ge,_e,De,xe,yt),zt=new Q1(x),Pt=new iR(x),C=new hA(D),ae=new Y1(D,C),v=new sR(D,C,yt,ae),F=new lR(D,v,C,yt),ee=new cR(D,De,Ue),ie=new K1(_e),q=new yN(x,zt,Pt,Fe,De,ae,ie),J=new UN(x,_e),$=new EN,Me=new IN(Fe),ye=new X1(x,zt,Pt,ge,F,h,c),ve=new RN(x,F,De),Be=new VN(D,yt,De,ge),le=new Z1(D,Fe,yt),Ie=new oR(D,Fe,yt),yt.programs=q.programs,x.capabilities=De,x.extensions=Fe,x.properties=_e,x.renderLists=$,x.shadowMap=ve,x.state=ge,x.info=yt}N();let te=new Lg(x,D);this.xr=te,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let b=Fe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Fe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(b){b!==void 0&&(U=b,this.setSize(G,j,!1))},this.getSize=function(b){return b.set(G,j)},this.setSize=function(b,P,V=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=b,j=P,t.width=Math.floor(b*U),t.height=Math.floor(P*U),V===!0&&(t.style.width=b+"px",t.style.height=P+"px"),this.setViewport(0,0,b,P)},this.getDrawingBufferSize=function(b){return b.set(G*U,j*U).floor()},this.setDrawingBufferSize=function(b,P,V){G=b,j=P,U=V,t.width=Math.floor(b*V),t.height=Math.floor(P*V),this.setViewport(0,0,b,P)},this.getCurrentViewport=function(b){return b.copy(R)},this.getViewport=function(b){return b.copy(fe)},this.setViewport=function(b,P,V,H){b.isVector4?fe.set(b.x,b.y,b.z,b.w):fe.set(b,P,V,H),ge.viewport(R.copy(fe).multiplyScalar(U).round())},this.getScissor=function(b){return b.copy(Ae)},this.setScissor=function(b,P,V,H){b.isVector4?Ae.set(b.x,b.y,b.z,b.w):Ae.set(b,P,V,H),ge.scissor(L.copy(Ae).multiplyScalar(U).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(b){ge.setScissorTest(et=b)},this.setOpaqueSort=function(b){ne=b},this.setTransparentSort=function(b){oe=b},this.getClearColor=function(b){return b.copy(ye.getClearColor())},this.setClearColor=function(){ye.setClearColor(...arguments)},this.getClearAlpha=function(){return ye.getClearAlpha()},this.setClearAlpha=function(){ye.setClearAlpha(...arguments)},this.clear=function(b=!0,P=!0,V=!0){let H=0;if(b){let O=!1;if(A!==null){let Q=A.texture.format;O=Q===Dd||Q===Ad||Q===Id}if(O){let Q=A.texture.type,ce=Q===Oi||Q===Hr||Q===Wo||Q===$o||Q===Td||Q===Cd,pe=ye.getClearColor(),ue=ye.getClearAlpha(),Ce=pe.r,Re=pe.g,be=pe.b;ce?(g[0]=Ce,g[1]=Re,g[2]=be,g[3]=ue,D.clearBufferuiv(D.COLOR,0,g)):(_[0]=Ce,_[1]=Re,_[2]=be,_[3]=ue,D.clearBufferiv(D.COLOR,0,_))}else H|=D.COLOR_BUFFER_BIT}P&&(H|=D.DEPTH_BUFFER_BIT),V&&(H|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",K,!1),ye.dispose(),$.dispose(),Me.dispose(),_e.dispose(),zt.dispose(),Pt.dispose(),F.dispose(),ae.dispose(),Be.dispose(),q.dispose(),te.dispose(),te.removeEventListener("sessionstart",vi),te.removeEventListener("sessionend",C_),Jr.stop()};function re(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let b=yt.autoReset,P=ve.enabled,V=ve.autoUpdate,H=ve.needsUpdate,O=ve.type;N(),yt.autoReset=b,ve.enabled=P,ve.autoUpdate=V,ve.needsUpdate=H,ve.type=O}function K(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Y(b){let P=b.target;P.removeEventListener("dispose",Y),me(P)}function me(b){Le(b),_e.remove(b)}function Le(b){let P=_e.get(b).programs;P!==void 0&&(P.forEach(function(V){q.releaseProgram(V)}),b.isShaderMaterial&&q.releaseShaderCache(b))}this.renderBufferDirect=function(b,P,V,H,O,Q){P===null&&(P=Ee);let ce=O.isMesh&&O.matrixWorld.determinant()<0,pe=ab(b,P,V,H,O);ge.setMaterial(H,ce);let ue=V.index,Ce=1;if(H.wireframe===!0){if(ue=v.getWireframeAttribute(V),ue===void 0)return;Ce=2}let Re=V.drawRange,be=V.attributes.position,Ge=Re.start*Ce,at=(Re.start+Re.count)*Ce;Q!==null&&(Ge=Math.max(Ge,Q.start*Ce),at=Math.min(at,(Q.start+Q.count)*Ce)),ue!==null?(Ge=Math.max(Ge,0),at=Math.min(at,ue.count)):be!=null&&(Ge=Math.max(Ge,0),at=Math.min(at,be.count));let Tt=at-Ge;if(Tt<0||Tt===1/0)return;ae.setup(O,H,pe,V,ue);let gt,dt=le;if(ue!==null&&(gt=C.get(ue),dt=Ie,dt.setIndex(gt)),O.isMesh)H.wireframe===!0?(ge.setLineWidth(H.wireframeLinewidth*Zt()),dt.setMode(D.LINES)):dt.setMode(D.TRIANGLES);else if(O.isLine){let Se=H.linewidth;Se===void 0&&(Se=1),ge.setLineWidth(Se*Zt()),O.isLineSegments?dt.setMode(D.LINES):O.isLineLoop?dt.setMode(D.LINE_LOOP):dt.setMode(D.LINE_STRIP)}else O.isPoints?dt.setMode(D.POINTS):O.isSprite&&dt.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Bo("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))dt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Se=O._multiDrawStarts,Mt=O._multiDrawCounts,Je=O._multiDrawCount,Tn=ue?C.get(ue).bytesPerElement:1,js=_e.get(H).currentProgram.getUniforms();for(let Cn=0;Cn<Je;Cn++)js.setValue(D,"_gl_DrawID",Cn),dt.render(Se[Cn]/Tn,Mt[Cn])}else if(O.isInstancedMesh)dt.renderInstances(Ge,Tt,O.count);else if(V.isInstancedBufferGeometry){let Se=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Mt=Math.min(V.instanceCount,Se);dt.renderInstances(Ge,Tt,Mt)}else dt.render(Ge,Tt)};function pt(b,P,V){b.transparent===!0&&b.side===Pi&&b.forceSinglePass===!1?(b.side=ln,b.needsUpdate=!0,Xc(b,P,V),b.side=sr,b.needsUpdate=!0,Xc(b,P,V),b.side=Pi):Xc(b,P,V)}this.compile=function(b,P,V=null){V===null&&(V=b),p=Me.get(V),p.init(P),S.push(p),V.traverseVisible(function(O){O.isLight&&O.layers.test(P.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),b!==V&&b.traverseVisible(function(O){O.isLight&&O.layers.test(P.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let H=new Set;return b.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let Q=O.material;if(Q)if(Array.isArray(Q))for(let ce=0;ce<Q.length;ce++){let pe=Q[ce];pt(pe,V,O),H.add(pe)}else pt(Q,V,O),H.add(Q)}),p=S.pop(),H},this.compileAsync=function(b,P,V=null){let H=this.compile(b,P,V);return new Promise(O=>{function Q(){if(H.forEach(function(ce){_e.get(ce).currentProgram.isReady()&&H.delete(ce)}),H.size===0){O(b);return}setTimeout(Q,10)}Fe.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let nt=null;function Hi(b){nt&&nt(b)}function vi(){Jr.stop()}function C_(){Jr.start()}let Jr=new ZM;Jr.setAnimationLoop(Hi),typeof self<"u"&&Jr.setContext(self),this.setAnimationLoop=function(b){nt=b,te.setAnimationLoop(b),b===null?Jr.stop():Jr.start()},te.addEventListener("sessionstart",vi),te.addEventListener("sessionend",C_),this.render=function(b,P){if(P!==void 0&&P.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(P),P=te.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,P,A),p=Me.get(b,S.length),p.init(P),S.push(p),Z.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),He.setFromProjectionMatrix(Z,pi,P.reversedDepth),X=this.localClippingEnabled,Pe=ie.init(this.clippingPlanes,X),m=$.get(b,E.length),m.init(),E.push(m),te.enabled===!0&&te.isPresenting===!0){let Q=x.xr.getDepthSensingMesh();Q!==null&&Pf(Q,P,-1/0,x.sortObjects)}Pf(b,P,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(ne,oe),Ye=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ye&&ye.addToRenderList(m,b),this.info.render.frame++,Pe===!0&&ie.beginShadows();let V=p.state.shadowsArray;ve.render(V,b,P),Pe===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();let H=m.opaque,O=m.transmissive;if(p.setupLights(),P.isArrayCamera){let Q=P.cameras;if(O.length>0)for(let ce=0,pe=Q.length;ce<pe;ce++){let ue=Q[ce];A_(H,O,b,ue)}Ye&&ye.render(b);for(let ce=0,pe=Q.length;ce<pe;ce++){let ue=Q[ce];I_(m,b,ue,ue.viewport)}}else O.length>0&&A_(H,O,b,P),Ye&&ye.render(b),I_(m,b,P);A!==null&&T===0&&(Ue.updateMultisampleRenderTarget(A),Ue.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(x,b,P),ae.resetDefaultState(),y=-1,M=null,S.pop(),S.length>0?(p=S[S.length-1],Pe===!0&&ie.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Pf(b,P,V,H){if(b.visible===!1)return;if(b.layers.test(P.layers)){if(b.isGroup)V=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(P);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||He.intersectsSprite(b)){H&&Oe.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Z);let ce=F.update(b),pe=b.material;pe.visible&&m.push(b,ce,pe,V,Oe.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||He.intersectsObject(b))){let ce=F.update(b),pe=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Oe.copy(b.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),Oe.copy(ce.boundingSphere.center)),Oe.applyMatrix4(b.matrixWorld).applyMatrix4(Z)),Array.isArray(pe)){let ue=ce.groups;for(let Ce=0,Re=ue.length;Ce<Re;Ce++){let be=ue[Ce],Ge=pe[be.materialIndex];Ge&&Ge.visible&&m.push(b,ce,Ge,V,Oe.z,be)}}else pe.visible&&m.push(b,ce,pe,V,Oe.z,null)}}let Q=b.children;for(let ce=0,pe=Q.length;ce<pe;ce++)Pf(Q[ce],P,V,H)}function I_(b,P,V,H){let O=b.opaque,Q=b.transmissive,ce=b.transparent;p.setupLightsView(V),Pe===!0&&ie.setGlobalState(x.clippingPlanes,V),H&&ge.viewport(R.copy(H)),O.length>0&&qc(O,P,V),Q.length>0&&qc(Q,P,V),ce.length>0&&qc(ce,P,V),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function A_(b,P,V,H){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new Di(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?jo:Oi,minFilter:Vr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace}));let Q=p.state.transmissionRenderTarget[H.id],ce=H.viewport||R;Q.setSize(ce.z*x.transmissionResolutionScale,ce.w*x.transmissionResolutionScale);let pe=x.getRenderTarget(),ue=x.getActiveCubeFace(),Ce=x.getActiveMipmapLevel();x.setRenderTarget(Q),x.getClearColor(W),z=x.getClearAlpha(),z<1&&x.setClearColor(16777215,.5),x.clear(),Ye&&ye.render(V);let Re=x.toneMapping;x.toneMapping=lr;let be=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),Pe===!0&&ie.setGlobalState(x.clippingPlanes,H),qc(b,V,H),Ue.updateMultisampleRenderTarget(Q),Ue.updateRenderTargetMipmap(Q),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let at=0,Tt=P.length;at<Tt;at++){let gt=P[at],dt=gt.object,Se=gt.geometry,Mt=gt.material,Je=gt.group;if(Mt.side===Pi&&dt.layers.test(H.layers)){let Tn=Mt.side;Mt.side=ln,Mt.needsUpdate=!0,D_(dt,V,H,Se,Mt,Je),Mt.side=Tn,Mt.needsUpdate=!0,Ge=!0}}Ge===!0&&(Ue.updateMultisampleRenderTarget(Q),Ue.updateRenderTargetMipmap(Q))}x.setRenderTarget(pe,ue,Ce),x.setClearColor(W,z),be!==void 0&&(H.viewport=be),x.toneMapping=Re}function qc(b,P,V){let H=P.isScene===!0?P.overrideMaterial:null;for(let O=0,Q=b.length;O<Q;O++){let ce=b[O],pe=ce.object,ue=ce.geometry,Ce=ce.group,Re=ce.material;Re.allowOverride===!0&&H!==null&&(Re=H),pe.layers.test(V.layers)&&D_(pe,P,V,ue,Re,Ce)}}function D_(b,P,V,H,O,Q){b.onBeforeRender(x,P,V,H,O,Q),b.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),O.onBeforeRender(x,P,V,H,b,Q),O.transparent===!0&&O.side===Pi&&O.forceSinglePass===!1?(O.side=ln,O.needsUpdate=!0,x.renderBufferDirect(V,P,H,O,b,Q),O.side=sr,O.needsUpdate=!0,x.renderBufferDirect(V,P,H,O,b,Q),O.side=Pi):x.renderBufferDirect(V,P,H,O,b,Q),b.onAfterRender(x,P,V,H,O,Q)}function Xc(b,P,V){P.isScene!==!0&&(P=Ee);let H=_e.get(b),O=p.state.lights,Q=p.state.shadowsArray,ce=O.state.version,pe=q.getParameters(b,O.state,Q,P,V),ue=q.getProgramCacheKey(pe),Ce=H.programs;H.environment=b.isMeshStandardMaterial?P.environment:null,H.fog=P.fog,H.envMap=(b.isMeshStandardMaterial?Pt:zt).get(b.envMap||H.environment),H.envMapRotation=H.environment!==null&&b.envMap===null?P.environmentRotation:b.envMapRotation,Ce===void 0&&(b.addEventListener("dispose",Y),Ce=new Map,H.programs=Ce);let Re=Ce.get(ue);if(Re!==void 0){if(H.currentProgram===Re&&H.lightsStateVersion===ce)return N_(b,pe),Re}else pe.uniforms=q.getUniforms(b),b.onBeforeCompile(pe,x),Re=q.acquireProgram(pe,ue),Ce.set(ue,Re),H.uniforms=pe.uniforms;let be=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(be.clippingPlanes=ie.uniform),N_(b,pe),H.needsLights=lb(b),H.lightsStateVersion=ce,H.needsLights&&(be.ambientLightColor.value=O.state.ambient,be.lightProbe.value=O.state.probe,be.directionalLights.value=O.state.directional,be.directionalLightShadows.value=O.state.directionalShadow,be.spotLights.value=O.state.spot,be.spotLightShadows.value=O.state.spotShadow,be.rectAreaLights.value=O.state.rectArea,be.ltc_1.value=O.state.rectAreaLTC1,be.ltc_2.value=O.state.rectAreaLTC2,be.pointLights.value=O.state.point,be.pointLightShadows.value=O.state.pointShadow,be.hemisphereLights.value=O.state.hemi,be.directionalShadowMap.value=O.state.directionalShadowMap,be.directionalShadowMatrix.value=O.state.directionalShadowMatrix,be.spotShadowMap.value=O.state.spotShadowMap,be.spotLightMatrix.value=O.state.spotLightMatrix,be.spotLightMap.value=O.state.spotLightMap,be.pointShadowMap.value=O.state.pointShadowMap,be.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=Re,H.uniformsList=null,Re}function R_(b){if(b.uniformsList===null){let P=b.currentProgram.getUniforms();b.uniformsList=Zo.seqWithValue(P.seq,b.uniforms)}return b.uniformsList}function N_(b,P){let V=_e.get(b);V.outputColorSpace=P.outputColorSpace,V.batching=P.batching,V.batchingColor=P.batchingColor,V.instancing=P.instancing,V.instancingColor=P.instancingColor,V.instancingMorph=P.instancingMorph,V.skinning=P.skinning,V.morphTargets=P.morphTargets,V.morphNormals=P.morphNormals,V.morphColors=P.morphColors,V.morphTargetsCount=P.morphTargetsCount,V.numClippingPlanes=P.numClippingPlanes,V.numIntersection=P.numClipIntersection,V.vertexAlphas=P.vertexAlphas,V.vertexTangents=P.vertexTangents,V.toneMapping=P.toneMapping}function ab(b,P,V,H,O){P.isScene!==!0&&(P=Ee),Ue.resetTextureUnits();let Q=P.fog,ce=H.isMeshStandardMaterial?P.environment:null,pe=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ws,ue=(H.isMeshStandardMaterial?Pt:zt).get(H.envMap||ce),Ce=H.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Re=!!V.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),be=!!V.morphAttributes.position,Ge=!!V.morphAttributes.normal,at=!!V.morphAttributes.color,Tt=lr;H.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Tt=x.toneMapping);let gt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,dt=gt!==void 0?gt.length:0,Se=_e.get(H),Mt=p.state.lights;if(Pe===!0&&(X===!0||b!==M)){let on=b===M&&H.id===y;ie.setState(H,b,on)}let Je=!1;H.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Mt.state.version||Se.outputColorSpace!==pe||O.isBatchedMesh&&Se.batching===!1||!O.isBatchedMesh&&Se.batching===!0||O.isBatchedMesh&&Se.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Se.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Se.instancing===!1||!O.isInstancedMesh&&Se.instancing===!0||O.isSkinnedMesh&&Se.skinning===!1||!O.isSkinnedMesh&&Se.skinning===!0||O.isInstancedMesh&&Se.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Se.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Se.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Se.instancingMorph===!1&&O.morphTexture!==null||Se.envMap!==ue||H.fog===!0&&Se.fog!==Q||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==ie.numPlanes||Se.numIntersection!==ie.numIntersection)||Se.vertexAlphas!==Ce||Se.vertexTangents!==Re||Se.morphTargets!==be||Se.morphNormals!==Ge||Se.morphColors!==at||Se.toneMapping!==Tt||Se.morphTargetsCount!==dt)&&(Je=!0):(Je=!0,Se.__version=H.version);let Tn=Se.currentProgram;Je===!0&&(Tn=Xc(H,P,O));let js=!1,Cn=!1,ca=!1,Et=Tn.getUniforms(),Gn=Se.uniforms;if(ge.useProgram(Tn.program)&&(js=!0,Cn=!0,ca=!0),H.id!==y&&(y=H.id,Cn=!0),js||M!==b){ge.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Et.setValue(D,"projectionMatrix",b.projectionMatrix),Et.setValue(D,"viewMatrix",b.matrixWorldInverse);let fn=Et.map.cameraPosition;fn!==void 0&&fn.setValue(D,he.setFromMatrixPosition(b.matrixWorld)),De.logarithmicDepthBuffer&&Et.setValue(D,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Et.setValue(D,"isOrthographic",b.isOrthographicCamera===!0),M!==b&&(M=b,Cn=!0,ca=!0)}if(O.isSkinnedMesh){Et.setOptional(D,O,"bindMatrix"),Et.setOptional(D,O,"bindMatrixInverse");let on=O.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),Et.setValue(D,"boneTexture",on.boneTexture,Ue))}O.isBatchedMesh&&(Et.setOptional(D,O,"batchingTexture"),Et.setValue(D,"batchingTexture",O._matricesTexture,Ue),Et.setOptional(D,O,"batchingIdTexture"),Et.setValue(D,"batchingIdTexture",O._indirectTexture,Ue),Et.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&Et.setValue(D,"batchingColorTexture",O._colorsTexture,Ue));let Wn=V.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&ee.update(O,V,Tn),(Cn||Se.receiveShadow!==O.receiveShadow)&&(Se.receiveShadow=O.receiveShadow,Et.setValue(D,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Gn.envMap.value=ue,Gn.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&P.environment!==null&&(Gn.envMapIntensity.value=P.environmentIntensity),Cn&&(Et.setValue(D,"toneMappingExposure",x.toneMappingExposure),Se.needsLights&&cb(Gn,ca),Q&&H.fog===!0&&J.refreshFogUniforms(Gn,Q),J.refreshMaterialUniforms(Gn,H,U,j,p.state.transmissionRenderTarget[b.id]),Zo.upload(D,R_(Se),Gn,Ue)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Zo.upload(D,R_(Se),Gn,Ue),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Et.setValue(D,"center",O.center),Et.setValue(D,"modelViewMatrix",O.modelViewMatrix),Et.setValue(D,"normalMatrix",O.normalMatrix),Et.setValue(D,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let on=H.uniformsGroups;for(let fn=0,Of=on.length;fn<Of;fn++){let Kr=on[fn];Be.update(Kr,Tn),Be.bind(Kr,Tn)}}return Tn}function cb(b,P){b.ambientLightColor.needsUpdate=P,b.lightProbe.needsUpdate=P,b.directionalLights.needsUpdate=P,b.directionalLightShadows.needsUpdate=P,b.pointLights.needsUpdate=P,b.pointLightShadows.needsUpdate=P,b.spotLights.needsUpdate=P,b.spotLightShadows.needsUpdate=P,b.rectAreaLights.needsUpdate=P,b.hemisphereLights.needsUpdate=P}function lb(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,P,V){let H=_e.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),_e.get(b.texture).__webglTexture=P,_e.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:V,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,P){let V=_e.get(b);V.__webglFramebuffer=P,V.__useDefaultFramebuffer=P===void 0};let ub=D.createFramebuffer();this.setRenderTarget=function(b,P=0,V=0){A=b,I=P,T=V;let H=!0,O=null,Q=!1,ce=!1;if(b){let ue=_e.get(b);if(ue.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(D.FRAMEBUFFER,null),H=!1;else if(ue.__webglFramebuffer===void 0)Ue.setupRenderTarget(b);else if(ue.__hasExternalTextures)Ue.rebindTextures(b,_e.get(b.texture).__webglTexture,_e.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let be=b.depthTexture;if(ue.__boundDepthTexture!==be){if(be!==null&&_e.has(be)&&(b.width!==be.image.width||b.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(b)}}let Ce=b.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(ce=!0);let Re=_e.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Re[P])?O=Re[P][V]:O=Re[P],Q=!0):b.samples>0&&Ue.useMultisampledRTT(b)===!1?O=_e.get(b).__webglMultisampledFramebuffer:Array.isArray(Re)?O=Re[V]:O=Re,R.copy(b.viewport),L.copy(b.scissor),k=b.scissorTest}else R.copy(fe).multiplyScalar(U).floor(),L.copy(Ae).multiplyScalar(U).floor(),k=et;if(V!==0&&(O=ub),ge.bindFramebuffer(D.FRAMEBUFFER,O)&&H&&ge.drawBuffers(b,O),ge.viewport(R),ge.scissor(L),ge.setScissorTest(k),Q){let ue=_e.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+P,ue.__webglTexture,V)}else if(ce){let ue=P;for(let Ce=0;Ce<b.textures.length;Ce++){let Re=_e.get(b.textures[Ce]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ce,Re.__webglTexture,V,ue)}}else if(b!==null&&V!==0){let ue=_e.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ue.__webglTexture,V)}y=-1},this.readRenderTargetPixels=function(b,P,V,H,O,Q,ce,pe=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=_e.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ce!==void 0&&(ue=ue[ce]),ue){ge.bindFramebuffer(D.FRAMEBUFFER,ue);try{let Ce=b.textures[pe],Re=Ce.format,be=Ce.type;if(!De.textureFormatReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!De.textureTypeReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=b.width-H&&V>=0&&V<=b.height-O&&(b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+pe),D.readPixels(P,V,H,O,xe.convert(Re),xe.convert(be),Q))}finally{let Ce=A!==null?_e.get(A).__webglFramebuffer:null;ge.bindFramebuffer(D.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(b,P,V,H,O,Q,ce,pe=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=_e.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ce!==void 0&&(ue=ue[ce]),ue)if(P>=0&&P<=b.width-H&&V>=0&&V<=b.height-O){ge.bindFramebuffer(D.FRAMEBUFFER,ue);let Ce=b.textures[pe],Re=Ce.format,be=Ce.type;if(!De.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!De.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ge=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ge),D.bufferData(D.PIXEL_PACK_BUFFER,Q.byteLength,D.STREAM_READ),b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+pe),D.readPixels(P,V,H,O,xe.convert(Re),xe.convert(be),0);let at=A!==null?_e.get(A).__webglFramebuffer:null;ge.bindFramebuffer(D.FRAMEBUFFER,at);let Tt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await bM(D,Tt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ge),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Q),D.deleteBuffer(Ge),D.deleteSync(Tt),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,P=null,V=0){let H=Math.pow(2,-V),O=Math.floor(b.image.width*H),Q=Math.floor(b.image.height*H),ce=P!==null?P.x:0,pe=P!==null?P.y:0;Ue.setTexture2D(b,0),D.copyTexSubImage2D(D.TEXTURE_2D,V,0,0,ce,pe,O,Q),ge.unbindTexture()};let db=D.createFramebuffer(),fb=D.createFramebuffer();this.copyTextureToTexture=function(b,P,V=null,H=null,O=0,Q=null){Q===null&&(O!==0?(Bo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=O,O=0):Q=0);let ce,pe,ue,Ce,Re,be,Ge,at,Tt,gt=b.isCompressedTexture?b.mipmaps[Q]:b.image;if(V!==null)ce=V.max.x-V.min.x,pe=V.max.y-V.min.y,ue=V.isBox3?V.max.z-V.min.z:1,Ce=V.min.x,Re=V.min.y,be=V.isBox3?V.min.z:0;else{let Wn=Math.pow(2,-O);ce=Math.floor(gt.width*Wn),pe=Math.floor(gt.height*Wn),b.isDataArrayTexture?ue=gt.depth:b.isData3DTexture?ue=Math.floor(gt.depth*Wn):ue=1,Ce=0,Re=0,be=0}H!==null?(Ge=H.x,at=H.y,Tt=H.z):(Ge=0,at=0,Tt=0);let dt=xe.convert(P.format),Se=xe.convert(P.type),Mt;P.isData3DTexture?(Ue.setTexture3D(P,0),Mt=D.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?(Ue.setTexture2DArray(P,0),Mt=D.TEXTURE_2D_ARRAY):(Ue.setTexture2D(P,0),Mt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,P.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,P.unpackAlignment);let Je=D.getParameter(D.UNPACK_ROW_LENGTH),Tn=D.getParameter(D.UNPACK_IMAGE_HEIGHT),js=D.getParameter(D.UNPACK_SKIP_PIXELS),Cn=D.getParameter(D.UNPACK_SKIP_ROWS),ca=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,gt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,gt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ce),D.pixelStorei(D.UNPACK_SKIP_ROWS,Re),D.pixelStorei(D.UNPACK_SKIP_IMAGES,be);let Et=b.isDataArrayTexture||b.isData3DTexture,Gn=P.isDataArrayTexture||P.isData3DTexture;if(b.isDepthTexture){let Wn=_e.get(b),on=_e.get(P),fn=_e.get(Wn.__renderTarget),Of=_e.get(on.__renderTarget);ge.bindFramebuffer(D.READ_FRAMEBUFFER,fn.__webglFramebuffer),ge.bindFramebuffer(D.DRAW_FRAMEBUFFER,Of.__webglFramebuffer);for(let Kr=0;Kr<ue;Kr++)Et&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,_e.get(b).__webglTexture,O,be+Kr),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,_e.get(P).__webglTexture,Q,Tt+Kr)),D.blitFramebuffer(Ce,Re,ce,pe,Ge,at,ce,pe,D.DEPTH_BUFFER_BIT,D.NEAREST);ge.bindFramebuffer(D.READ_FRAMEBUFFER,null),ge.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(O!==0||b.isRenderTargetTexture||_e.has(b)){let Wn=_e.get(b),on=_e.get(P);ge.bindFramebuffer(D.READ_FRAMEBUFFER,db),ge.bindFramebuffer(D.DRAW_FRAMEBUFFER,fb);for(let fn=0;fn<ue;fn++)Et?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Wn.__webglTexture,O,be+fn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Wn.__webglTexture,O),Gn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,on.__webglTexture,Q,Tt+fn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,on.__webglTexture,Q),O!==0?D.blitFramebuffer(Ce,Re,ce,pe,Ge,at,ce,pe,D.COLOR_BUFFER_BIT,D.NEAREST):Gn?D.copyTexSubImage3D(Mt,Q,Ge,at,Tt+fn,Ce,Re,ce,pe):D.copyTexSubImage2D(Mt,Q,Ge,at,Ce,Re,ce,pe);ge.bindFramebuffer(D.READ_FRAMEBUFFER,null),ge.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Gn?b.isDataTexture||b.isData3DTexture?D.texSubImage3D(Mt,Q,Ge,at,Tt,ce,pe,ue,dt,Se,gt.data):P.isCompressedArrayTexture?D.compressedTexSubImage3D(Mt,Q,Ge,at,Tt,ce,pe,ue,dt,gt.data):D.texSubImage3D(Mt,Q,Ge,at,Tt,ce,pe,ue,dt,Se,gt):b.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,Q,Ge,at,ce,pe,dt,Se,gt.data):b.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,Q,Ge,at,gt.width,gt.height,dt,gt.data):D.texSubImage2D(D.TEXTURE_2D,Q,Ge,at,ce,pe,dt,Se,gt);D.pixelStorei(D.UNPACK_ROW_LENGTH,Je),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Tn),D.pixelStorei(D.UNPACK_SKIP_PIXELS,js),D.pixelStorei(D.UNPACK_SKIP_ROWS,Cn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ca),Q===0&&P.generateMipmaps&&D.generateMipmap(Mt),ge.unbindTexture()},this.initRenderTarget=function(b){_e.get(b).__webglFramebuffer===void 0&&Ue.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Ue.setTextureCube(b,0):b.isData3DTexture?Ue.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Ue.setTexture2DArray(b,0):Ue.setTexture2D(b,0),ge.unbindTexture()},this.resetState=function(){I=0,T=0,A=null,ge.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}};var zN="portraits/thiruma.png?v=2",GN="portraits/red-blue-rally.png",hf=class{canvas;hooks;image=new Image;crowdImage=new Image;pointer={x:-1e3,y:-1e3,down:!1};reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");lowMemory=navigator.deviceMemory;sampleCanvas=document.createElement("canvas");sampleContext=this.sampleCanvas.getContext("2d",{willReadFrequently:!0});renderer;scene;camera;geometry;material;particleTexture;points;resizeObserver;raf=0;resizeTimer=0;visible=!0;imageReady=!1;portraitLoaded=!1;crowdLoaded=!1;initialized=!1;hasFormed=!1;crowdSamples=[];startTime=performance.now();width=0;height=0;sourceX=0;sourceY=0;sourceWidth=0;sourceHeight=0;starts=new Float32Array;crowdPositions=new Float32Array;targets=new Float32Array;phases=new Float32Array;crowdColors=new Float32Array;portraitColors=new Float32Array;constructor(e,t){this.canvas=e,this.hooks=t;try{this.renderer=new df({canvas:e,alpha:!0,antialias:!1,powerPreference:"high-performance",premultipliedAlpha:!1}),this.renderer.outputColorSpace=qt,this.renderer.setClearColor(0,0),this.scene=new gc,this.camera=new Go(-3,3,3,-3,.1,100)}catch{t.onFallback();return}this.image.decoding="async",this.crowdImage.decoding="async",this.image.onload=()=>{this.portraitLoaded=!0,this.initializeWhenReady()},this.crowdImage.onload=()=>{this.crowdLoaded=!0,this.initializeWhenReady()},this.image.onerror=()=>t.onFallback(),this.crowdImage.onerror=()=>t.onFallback(),this.image.src=zN,this.crowdImage.src=GN,this.resizeObserver=new ResizeObserver(()=>{window.clearTimeout(this.resizeTimer),this.resizeTimer=window.setTimeout(()=>this.resize(),100)}),this.resizeObserver.observe(e),e.addEventListener("pointermove",this.onPointerMove,{passive:!0}),e.addEventListener("pointerdown",this.onPointerDown,{passive:!0}),e.addEventListener("pointerup",this.onPointerUp,{passive:!0}),e.addEventListener("pointerleave",this.onPointerLeave,{passive:!0}),document.addEventListener("visibilitychange",this.onVisibility),this.reducedMotion.addEventListener("change",this.onMotionChange)}initializeWhenReady(){if(!(this.initialized||!this.portraitLoaded||!this.crowdLoaded)){this.initialized=!0;try{if(this.findPortraitBounds(),this.readCrowdSamples(),!this.crowdSamples.length)throw new Error("The rally image has no visible pixels to sample.");this.imageReady=!0,this.startTime=performance.now(),this.resize(),this.hooks.onReady(),this.start()}catch(e){console.error("Unable to prepare the crowd-to-portrait particle scene.",e),this.hooks.onFallback()}}}get targetCount(){let e=window.matchMedia("(max-width: 600px)").matches;return(navigator.connection?.saveData??!1)||(this.lowMemory??8)<=2?e?9e3:16e3:e?32e3:56e3}findPortraitBounds(){if(!this.sampleContext)return;let e=this.sampleCanvas;e.width=this.image.naturalWidth,e.height=this.image.naturalHeight,this.sampleContext.drawImage(this.image,0,0);let t=this.sampleContext.getImageData(0,0,e.width,e.height).data,i=e.width,r=-1,s=e.height,o=-1;for(let l=0;l<e.height;l++)for(let u=0;u<e.width;u++)t[(l*e.width+u)*4+3]<12||(i=Math.min(i,u),r=Math.max(r,u),s=Math.min(s,l),o=Math.max(o,l));if(r<i||o<s)return;let a=(r-i+1)*.035,c=(o-s+1)*.025;this.sourceX=Math.max(0,i-a),this.sourceY=Math.max(0,s-c),this.sourceWidth=Math.min(e.width-this.sourceX,r-i+1+a*2),this.sourceHeight=Math.min(e.height-this.sourceY,o-s+1+c*2)}readCrowdSamples(){if(!this.sampleContext)return;let e=768,t=384;this.sampleCanvas.width=e,this.sampleCanvas.height=t,this.sampleContext.drawImage(this.crowdImage,0,0,e,t);let i=this.sampleContext.getImageData(0,0,e,t).data;this.crowdSamples=[];for(let r=0;r<t;r+=1)for(let s=0;s<e;s+=1){let o=(r*e+s)*4,a=i[o],c=i[o+1],l=i[o+2];Math.max(a,c,l)<12||r<t*.25||this.crowdSamples.push({x:s/e,y:r/t,red:a,green:c,blue:l})}}resize(){if(!this.renderer||!this.camera)return;let e=this.canvas.getBoundingClientRect();this.width=Math.max(1,e.width),this.height=Math.max(1,e.height);let t=Math.min(window.devicePixelRatio||1,(this.lowMemory??8)<=2?1:1.5);this.renderer.setPixelRatio(t),this.renderer.setSize(this.width,this.height,!1);let i=this.width/this.height,r=5.8,s=r*i;this.camera.left=-s/2,this.camera.right=s/2,this.camera.top=r/2,this.camera.bottom=-r/2,this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0),this.camera.updateProjectionMatrix(),this.imageReady&&this.createParticles()}createParticles(){if(!this.sampleContext||!this.scene)return;this.geometry?.dispose(),this.material?.dispose(),this.points&&this.scene.remove(this.points);let e=this.sourceWidth||this.image.naturalWidth,t=this.sourceHeight||this.image.naturalHeight,i=e/t,r=this.width/this.height,s=5.8,o=s*r,a=this.canvas.getBoundingClientRect(),c=this.canvas.parentElement?.querySelector(".portrait-stage")?.getBoundingClientRect(),l=c?c.width/this.width*o:o*.45,u=c?c.height/this.height*s:s*.75,d=window.matchMedia("(max-width: 760px)").matches,f=d?l:Math.min(u*.82*i,l*.88),h=f/i,g=c?(c.left+c.width/2-a.left)/this.width:.75,_=c?c.width/(this.image.naturalWidth/this.image.naturalHeight):0,m=c?(a.bottom-(d?c.bottom-_/2:c.top+c.height/2))/this.height:.5,p=(g-.5)*o,E=(m-.5)*s,S=this.targetCount,x=Math.ceil(Math.sqrt(S*i)),w=Math.ceil(S/x);this.sampleCanvas.width=x,this.sampleCanvas.height=w,this.sampleContext.drawImage(this.image,this.sourceX,this.sourceY,e,t,0,0,x,w);let I=this.sampleContext.getImageData(0,0,x,w).data,T=[],A=[],y=[],M=[],R=[],L=[];for(let z=0;z<w;z++)for(let G=0;G<x;G++){let j=(z*x+G)*4;if(I[j+3]<24)continue;let U=I[j],ne=I[j+1],oe=I[j+2],fe=(G/Math.max(1,x-1)-.5)*f+p,Ae=(.5-z/Math.max(1,w-1))*h+E;y.push(fe,Ae,0);let et=Math.floor(Math.random()*this.crowdSamples.length),He=this.crowdSamples[et],Pe=this.crowdPoint(He,o,s);A.push(Pe.x,Pe.y,Pe.z),T.push(Pe.x,Pe.y-s*(.025+Math.random()*.04),Pe.z);let X=new qe().setRGB(U/255,ne/255,oe/255,qt);R.push(X.r,X.g,X.b);let Z=new qe().setRGB(He.red/255,He.green/255,He.blue/255,qt);M.push(Z.r,Z.g,Z.b),L.push(Math.random()*Math.PI*2)}this.starts=new Float32Array(T),this.crowdPositions=new Float32Array(A),this.targets=new Float32Array(y),this.phases=new Float32Array(L),this.crowdColors=new Float32Array(M),this.portraitColors=new Float32Array(R);let k=new gi;k.setAttribute("position",new en(this.starts.slice(),3).setUsage(of)),k.setAttribute("color",new en(this.crowdColors.slice(),3).setUsage(of)),this.particleTexture?.dispose(),this.particleTexture=this.createParticleTexture();let W=new zo({size:1.8,sizeAttenuation:!0,vertexColors:!0,map:this.particleTexture,transparent:!0,alphaTest:.025,opacity:.96,depthWrite:!1});this.geometry=k,this.material=W,this.points=new vc(k,W),this.scene.add(this.points)}createParticleTexture(){let e=document.createElement("canvas");e.width=32,e.height=32;let t=e.getContext("2d"),i=t.createRadialGradient(16,16,1,16,16,16);return i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.3,"rgba(255,255,255,1)"),i.addColorStop(.52,"rgba(255,255,255,.65)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,32,32),new yc(e)}crowdPoint(e,t,i){return{x:(e.x-.5)*t*.98,y:-i*.49+(1-e.y)*i*.3,z:0}}start(){if(this.raf||!this.renderer||!this.scene||!this.camera||!this.visible||!this.imageReady||!this.geometry||!this.material)return;let e=t=>{if(this.raf=0,!this.visible||!this.renderer||!this.scene||!this.camera||!this.geometry||!this.material)return;let i=t-this.startTime,r=this.reducedMotion.matches?1:Math.max(0,Math.min(1,(i-1450)/2600)),s=r*r*(3-2*r),o=this.reducedMotion.matches?0:Math.sin(i/8200)*.025,a=this.reducedMotion.matches||this.pointer.x<-500?0:1,c=a?this.pointer.x/this.width-.5:0,l=a?this.pointer.y/this.height-.5:0,u=this.geometry.getAttribute("position"),d=u.array,f=this.geometry.getAttribute("color"),h=f.array;for(let g=0;g<this.targets.length;g+=3){let _=g/3,m=this.reducedMotion.matches?0:this.phases[_]/(Math.PI*2)*.22,p=this.reducedMotion.matches?1:Math.min(1,Math.max(0,i/1050-m)),E=1-Math.pow(1-p,3),S=0,x=c*.16,w=-l*.12,I=Math.sin(i*.001+g)*o,T=this.starts[g]+(this.crowdPositions[g]-this.starts[g])*E,A=this.starts[g+1]+(this.crowdPositions[g+1]-this.starts[g+1])*E,y=this.starts[g+2]+(this.crowdPositions[g+2]-this.starts[g+2])*E,M=T+(this.targets[g]+x-T)*s+I,R=A+(this.targets[g+1]+w-A)*s+I,L=y+(S-y)*s;d[g]+=(M-d[g])*.12,d[g+1]+=(R-d[g+1])*.12,d[g+2]+=(L-d[g+2])*.12,s<1&&(h[g]=this.crowdColors[g]+(this.portraitColors[g]-this.crowdColors[g])*s,h[g+1]=this.crowdColors[g+1]+(this.portraitColors[g+1]-this.crowdColors[g+1])*s,h[g+2]=this.crowdColors[g+2]+(this.portraitColors[g+2]-this.crowdColors[g+2])*s)}u.needsUpdate=!0,s<1&&(f.needsUpdate=!0),this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera),s>=1&&!this.hasFormed&&(this.hasFormed=!0,this.hooks.onFormed()),this.hasFormed||(this.raf=requestAnimationFrame(e))};this.raf=requestAnimationFrame(e)}onPointerMove=e=>{let t=this.canvas.getBoundingClientRect();this.pointer.x=e.clientX-t.left,this.pointer.y=e.clientY-t.top};onPointerDown=e=>{this.pointer.down=!0,this.onPointerMove(e)};onPointerUp=()=>{this.pointer.down=!1};onPointerLeave=()=>{this.pointer.x=-1e3,this.pointer.y=-1e3,this.pointer.down=!1};onVisibility=()=>{this.visible=document.visibilityState==="visible",this.visible?this.start():(cancelAnimationFrame(this.raf),this.raf=0)};onMotionChange=()=>{this.raf||this.start()};destroy(){cancelAnimationFrame(this.raf),window.clearTimeout(this.resizeTimer),this.resizeObserver?.disconnect(),this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas.removeEventListener("pointerdown",this.onPointerDown),this.canvas.removeEventListener("pointerup",this.onPointerUp),this.canvas.removeEventListener("pointerleave",this.onPointerLeave),document.removeEventListener("visibilitychange",this.onVisibility),this.reducedMotion.removeEventListener("change",this.onMotionChange),this.geometry?.dispose(),this.material?.dispose(),this.particleTexture?.dispose(),this.renderer?.dispose(),this.image.onload=null,this.image.onerror=null,this.crowdImage.onload=null,this.crowdImage.onerror=null}};function dr(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function lE(n,e){n.prototype=Object.create(e.prototype),n.prototype.constructor=n,n.__proto__=e}var Sn={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},kc={duration:.5,overwrite:!1,delay:0},Kg,Xt,xt,ni=1e8,ut=1/ni,Wg=Math.PI*2,WN=Wg/4,jN=0,uE=Math.sqrt,$N=Math.cos,qN=Math.sin,Ht=function(e){return typeof e=="string"},Rt=function(e){return typeof e=="function"},hr=function(e){return typeof e=="number"},wf=function(e){return typeof e>"u"},Ui=function(e){return typeof e=="object"},bn=function(e){return e!==!1},Qg=function(){return typeof window<"u"},pf=function(e){return Rt(e)||Ht(e)},dE=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},rn=Array.isArray,XN=/random\([^)]+\)/g,YN=/,\s*/g,tE=/(?:-?\.?\d|\.)+/gi,e_=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Bs=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,kg=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,t_=/[+-]=-?[.\d]+/,ZN=/[^,'"\[\]\s]+/gi,JN=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,St,ki,jg,n_,Vn={},vf={},fE,hE=function(e){return(vf=Qo(e,Vn))&&sn},Tf=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},Bc=function(e,t){return!t&&console.warn(e)},pE=function(e,t){return e&&(Vn[e]=t)&&vf&&(vf[e]=t)||Vn},Uc=function(){return 0},KN={suppressEvents:!0,isStart:!0,kill:!1},mf={suppressEvents:!0,kill:!1},QN={suppressEvents:!0},i_={},Gr=[],$g={},mE,Mn={},Bg={},nE=30,gf=[],r_="",s_=function(e){var t=e[0],i,r;if(Ui(t)||Rt(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(r=gf.length;r--&&!gf[r].targetTest(t););i=gf[r]}for(r=e.length;r--;)e[r]&&(e[r]._gsap||(e[r]._gsap=new l_(e[r],i)))||e.splice(r,1);return e},Wr=function(e){return e._gsap||s_(ii(e))[0]._gsap},o_=function(e,t,i){return(i=e[t])&&Rt(i)?e[t]():wf(i)&&e.getAttribute&&e.getAttribute(t)||i},un=function(e,t){return(e=e.split(",")).forEach(t)||e},Nt=function(e){return Math.round(e*1e5)/1e5||0},bt=function(e){return Math.round(e*1e7)/1e7||0},Us=function(e,t){var i=t.charAt(0),r=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+r:i==="-"?e-r:i==="*"?e*r:e/r},eP=function(e,t){for(var i=t.length,r=0;e.indexOf(t[r])<0&&++r<i;);return r<i},yf=function(){var e=Gr.length,t=Gr.slice(0),i,r;for($g={},Gr.length=0,i=0;i<e;i++)r=t[i],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},a_=function(e){return!!(e._initted||e._startAt||e.add)},gE=function(e,t,i,r){Gr.length&&!Xt&&yf(),e.render(t,i,r||!!(Xt&&t<0&&a_(e))),Gr.length&&!Xt&&yf()},_E=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(ZN).length<2?t:Ht(e)?e.trim():e},vE=function(e){return e},Hn=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},tP=function(e){return function(t,i){for(var r in i)r in t||r==="duration"&&e||r==="ease"||(t[r]=i[r])}},Qo=function(e,t){for(var i in t)e[i]=t[i];return e},iE=function n(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=Ui(t[i])?n(e[i]||(e[i]={}),t[i]):t[i]);return e},xf=function(e,t){var i={},r;for(r in e)r in t||(i[r]=e[r]);return i},Oc=function(e){var t=e.parent||St,i=e.keyframes?tP(rn(e.keyframes)):Hn;if(bn(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},nP=function(e,t){for(var i=e.length,r=i===t.length;r&&i--&&e[i]===t[i];);return i<0},yE=function(e,t,i,r,s){i===void 0&&(i="_first"),r===void 0&&(r="_last");var o=e[r],a;if(s)for(a=t[s];o&&o[s]>a;)o=o._prev;return o?(t._next=o._next,o._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[r]=t,t._prev=o,t.parent=t._dp=e,t},Cf=function(e,t,i,r){i===void 0&&(i="_first"),r===void 0&&(r="_last");var s=t._prev,o=t._next;s?s._next=o:e[i]===t&&(e[i]=o),o?o._prev=s:e[r]===t&&(e[r]=s),t._next=t._prev=t.parent=null},jr=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},Ls=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},iP=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},qg=function(e,t,i,r){return e._startAt&&(Xt?e._startAt.revert(mf):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,r))},rP=function n(e){return!e||e._ts&&n(e.parent)},rE=function(e){return e._repeat?ea(e._tTime,e=e.duration()+e._rDelay)*e:0},ea=function(e,t){var i=Math.floor(e=bt(e/t));return e&&i===e?i-1:i},Mf=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},If=function(e){return e._end=bt(e._start+(e._tDur/Math.abs(e._ts||e._rts||ut)||0))},Af=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=bt(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),If(e),i._dirty||Ls(i,e)),e},xE=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=Mf(e.rawTime(),t),(!t._dur||Gc(0,t.totalDuration(),i)-t._tTime>ut)&&t.render(i,!0)),Ls(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-ut}},Bi=function(e,t,i,r){return t.parent&&jr(t),t._start=bt((hr(i)?i:!i&&Ef(t)&&(!e._last||e._last._start>=e._time)?e._last?e._last._start:e._time:i||e!==St?ti(e,i,t):e._time)+t._delay),t._end=bt(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),yE(e,t,"_first","_last",e._sort?"_start":0),Ef(t)||(e._recent=t),r||xE(e,t),e._ts<0&&Af(e,e._tTime),e},ME=function(e,t){return(Vn.ScrollTrigger||Tf("scrollTrigger",t))&&Vn.ScrollTrigger.create(t,e)},EE=function(e,t,i,r,s){if(f_(e,t,s),!e._initted)return 1;if(!i&&e._pt&&!Xt&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&mE!==En.frame)return Gr.push(e),e._lazy=[s,r],1},sP=function n(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||n(t))},Ef=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},oP=function(e,t,i,r){var s=e.ratio,o=t<0||!t&&(!e._start&&sP(e)&&!(!e._initted&&Ef(e))||(e._ts<0||e._dp._ts<0)&&!Ef(e))?0:1,a=e._rDelay,c=0,l,u,d;if(a&&e._repeat&&(c=Gc(0,e._tDur,t),u=ea(c,a),e._yoyo&&u&1&&(o=1-o),u!==ea(e._tTime,a)&&(s=1-o,e.vars.repeatRefresh&&e._initted&&e.invalidate())),o!==s||Xt||r||e._zTime===ut||!t&&e._zTime){if(!e._initted&&EE(e,t,r,i,c))return;for(d=e._zTime,e._zTime=t||(i?ut:0),i||(i=t&&!d),e.ratio=o,e._from&&(o=1-o),e._time=0,e._tTime=c,l=e._pt;l;)l.r(o,l.d),l=l._next;t<0&&qg(e,t,i,!0),e._onUpdate&&!i&&Un(e,"onUpdate"),c&&e._repeat&&!i&&e.parent&&Un(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===o&&(o&&jr(e,1),!i&&!Xt&&(Un(e,o?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},aP=function(e,t,i){var r;if(i>t)for(r=e._first;r&&r._start<=i;){if(r.data==="isPause"&&r._start>t)return r;r=r._next}else for(r=e._last;r&&r._start>=i;){if(r.data==="isPause"&&r._start<t)return r;r=r._prev}},ta=function(e,t,i,r){var s=e._repeat,o=bt(t)||0,a=e._tTime/e._tDur;return a&&!r&&(e._time*=o/e._dur),e._dur=o,e._tDur=s?s<0?1e10:bt(o*(s+1)+e._rDelay*s):o,a>0&&!r&&Af(e,e._tTime=e._tDur*a),e.parent&&If(e),i||Ls(e.parent,e),e},sE=function(e){return e instanceof nn?Ls(e):ta(e,e._dur)},cP={_start:0,endTime:Uc,totalDuration:Uc},ti=function n(e,t,i){var r=e.labels,s=e._recent||cP,o=e.duration()>=ni?s.endTime(!1):e._dur,a,c,l;return Ht(t)&&(isNaN(t)||t in r)?(c=t.charAt(0),l=t.substr(-1)==="%",a=t.indexOf("="),c==="<"||c===">"?(a>=0&&(t=t.replace(/=/,"")),(c==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(l?(a<0?s:i).totalDuration()/100:1)):a<0?(t in r||(r[t]=o),r[t]):(c=parseFloat(t.charAt(a-1)+t.substr(a+1)),l&&i&&(c=c/100*(rn(i)?i[0]:i).totalDuration()),a>1?n(e,t.substr(0,a-1),i)+c:o+c)):t==null?o:+t},Lc=function(e,t,i){var r=hr(t[1]),s=(r?2:1)+(e<2?0:1),o=t[s],a,c;if(r&&(o.duration=t[1]),o.parent=i,e){for(a=o,c=i;c&&!("immediateRender"in a);)a=c.vars.defaults||{},c=bn(c.vars.inherit)&&c.parent;o.immediateRender=bn(a.immediateRender),e<2?o.runBackwards=1:o.startAt=t[s-1]}return new Lt(t[0],o,t[s+1])},$r=function(e,t){return e||e===0?t(e):t},Gc=function(e,t,i){return i<e?e:i>t?t:i},Yt=function(e,t){return!Ht(e)||!(t=JN.exec(e))?"":t[1]},lP=function(e,t,i){return $r(i,function(r){return Gc(e,t,r)})},Xg=[].slice,bE=function(e,t){return e&&Ui(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&Ui(e[0]))&&!e.nodeType&&e!==ki},uP=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(r){var s;return Ht(r)&&!t||bE(r,1)?(s=i).push.apply(s,ii(r)):i.push(r)})||i},ii=function(e,t,i){return xt&&!t&&xt.selector?xt.selector(e):Ht(e)&&!i&&(jg||!na())?Xg.call((t||n_).querySelectorAll(e),0):rn(e)?uP(e,i):bE(e)?Xg.call(e,0):e?[e]:[]},Yg=function(e){return e=ii(e)[0]||Bc("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return ii(t,i.querySelectorAll?i:i===e?Bc("Invalid scope")||n_.createElement("div"):e)}},SE=function(e){return e.sort(function(){return .5-Math.random()})},wE=function(e){if(Rt(e))return e;var t=Ui(e)?e:{each:e},i=Fs(t.ease),r=t.from||0,s=parseFloat(t.base)||0,o={},a=r>0&&r<1,c=isNaN(r)||a,l=t.axis,u=r,d=r;return Ht(r)?u=d={center:.5,edges:.5,end:1}[r]||0:!a&&c&&(u=r[0],d=r[1]),function(f,h,g){var _=(g||t).length,m=o[_],p,E,S,x,w,I,T,A,y;if(!m){if(y=t.grid==="auto"?0:(t.grid||[1,ni])[1],!y){for(T=-ni;T<(T=g[y++].getBoundingClientRect().left)&&y<_;);y<_&&y--}for(m=o[_]=[],p=c?Math.min(y,_)*u-.5:r%y,E=y===ni?0:c?_*d/y-.5:r/y|0,T=0,A=ni,I=0;I<_;I++)S=I%y-p,x=E-(I/y|0),m[I]=w=l?Math.abs(l==="y"?x:S):uE(S*S+x*x),w>T&&(T=w),w<A&&(A=w);r==="random"&&SE(m),m.max=T-A,m.min=A,m.v=_=(parseFloat(t.amount)||parseFloat(t.each)*(y>_?_-1:l?l==="y"?_/y:y:Math.max(y,_/y))||0)*(r==="edges"?-1:1),m.b=_<0?s-_:s,m.u=Yt(t.amount||t.each)||0,i=i&&_<0?bP(i):i}return _=(m[f]-m.min)/m.max||0,bt(m.b+(i?i(_):_)*m.v)+m.u}},Zg=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var r=bt(Math.round(parseFloat(i)/e)*e*t);return(r-r%1)/t+(hr(i)?0:Yt(i))}},TE=function(e,t){var i=rn(e),r,s;return!i&&Ui(e)&&(r=i=e.radius||ni,e.values?(e=ii(e.values),(s=!hr(e[0]))&&(r*=r)):e=Zg(e.increment)),$r(t,i?Rt(e)?function(o){return s=e(o),Math.abs(s-o)<=r?s:o}:function(o){for(var a=parseFloat(s?o.x:o),c=parseFloat(s?o.y:0),l=ni,u=0,d=e.length,f,h;d--;)s?(f=e[d].x-a,h=e[d].y-c,f=f*f+h*h):f=Math.abs(e[d]-a),f<l&&(l=f,u=d);return u=!r||l<=r?e[u]:o,s||u===o||hr(o)?u:u+Yt(o)}:Zg(e))},CE=function(e,t,i,r){return $r(rn(e)?!t:i===!0?!!(i=0):!r,function(){return rn(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(r=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*r)/r})},dP=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(r){return t.reduce(function(s,o){return o(s)},r)}},fP=function(e,t){return function(i){return e(parseFloat(i))+(t||Yt(i))}},hP=function(e,t,i){return AE(e,t,0,1,i)},IE=function(e,t,i){return $r(i,function(r){return e[~~t(r)]})},pP=function n(e,t,i){var r=t-e;return rn(e)?IE(e,n(0,e.length),t):$r(i,function(s){return(r+(s-e)%r)%r+e})},mP=function n(e,t,i){var r=t-e,s=r*2;return rn(e)?IE(e,n(0,e.length-1),t):$r(i,function(o){return o=(s+(o-e)%s)%s||0,e+(o>r?s-o:o)})},ia=function(e){return e.replace(XN,function(t){var i=t.indexOf("[")+1,r=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(YN);return CE(i?r:+r[0],i?0:+r[1],+r[2]||1e-5)})},AE=function(e,t,i,r,s){var o=t-e,a=r-i;return $r(s,function(c){return i+((c-e)/o*a||0)})},gP=function n(e,t,i,r){var s=isNaN(e+t)?0:function(h){return(1-h)*e+h*t};if(!s){var o=Ht(e),a={},c,l,u,d,f;if(i===!0&&(r=1)&&(i=null),o)e={p:e},t={p:t};else if(rn(e)&&!rn(t)){for(u=[],d=e.length,f=d-2,l=1;l<d;l++)u.push(n(e[l-1],e[l]));d--,s=function(g){g*=d;var _=Math.min(f,~~g);return u[_](g-_)},i=t}else r||(e=Qo(rn(e)?[]:{},e));if(!u){for(c in t)u_.call(a,e,c,"get",t[c]);s=function(g){return m_(g,a)||(o?e.p:e)}}}return $r(i,s)},oE=function(e,t,i){var r=e.labels,s=ni,o,a,c;for(o in r)a=r[o]-t,a<0==!!i&&a&&s>(a=Math.abs(a))&&(c=o,s=a);return c},Un=function(e,t,i){var r=e.vars,s=r[t],o=xt,a=e._ctx,c,l,u;if(s)return c=r[t+"Params"],l=r.callbackScope||e,i&&Gr.length&&yf(),a&&(xt=a),u=c?s.apply(l,c):s.call(l),xt=o,u},Nc=function(e){return jr(e),e.scrollTrigger&&e.scrollTrigger.kill(!!Xt),e.progress()<1&&Un(e,"onInterrupt"),e},Ko,DE=[],RE=function(e){if(e)if(e=!e.name&&e.default||e,Qg()||e.headless){var t=e.name,i=Rt(e),r=t&&!i&&e.init?function(){this._props=[]}:e,s={init:Uc,render:m_,add:u_,kill:PP,modifier:NP,rawVars:0},o={targetTest:0,get:0,getSetter:Df,aliases:{},register:0};if(na(),e!==r){if(Mn[t])return;Hn(r,Hn(xf(e,s),o)),Qo(r.prototype,Qo(s,xf(e,o))),Mn[r.prop=t]=r,e.targetTest&&(gf.push(r),i_[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}pE(t,r),e.register&&e.register(sn,r,dn)}else DE.push(e)},ht=255,Pc={aqua:[0,ht,ht],lime:[0,ht,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,ht],navy:[0,0,128],white:[ht,ht,ht],olive:[128,128,0],yellow:[ht,ht,0],orange:[ht,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[ht,0,0],pink:[ht,192,203],cyan:[0,ht,ht],transparent:[ht,ht,ht,0]},Ug=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*ht+.5|0},NE=function(e,t,i){var r=e?hr(e)?[e>>16,e>>8&ht,e&ht]:0:Pc.black,s,o,a,c,l,u,d,f,h,g;if(!r){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),Pc[e])r=Pc[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),o=e.charAt(2),a=e.charAt(3),e="#"+s+s+o+o+a+a+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return r=parseInt(e.substr(1,6),16),[r>>16,r>>8&ht,r&ht,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),r=[e>>16,e>>8&ht,e&ht]}else if(e.substr(0,3)==="hsl"){if(r=g=e.match(tE),!t)c=+r[0]%360/360,l=+r[1]/100,u=+r[2]/100,o=u<=.5?u*(l+1):u+l-u*l,s=u*2-o,r.length>3&&(r[3]*=1),r[0]=Ug(c+1/3,s,o),r[1]=Ug(c,s,o),r[2]=Ug(c-1/3,s,o);else if(~e.indexOf("="))return r=e.match(e_),i&&r.length<4&&(r[3]=1),r}else r=e.match(tE)||Pc.transparent;r=r.map(Number)}return t&&!g&&(s=r[0]/ht,o=r[1]/ht,a=r[2]/ht,d=Math.max(s,o,a),f=Math.min(s,o,a),u=(d+f)/2,d===f?c=l=0:(h=d-f,l=u>.5?h/(2-d-f):h/(d+f),c=d===s?(o-a)/h+(o<a?6:0):d===o?(a-s)/h+2:(s-o)/h+4,c*=60),r[0]=~~(c+.5),r[1]=~~(l*100+.5),r[2]=~~(u*100+.5)),i&&r.length<4&&(r[3]=1),r},PE=function(e){var t=[],i=[],r=-1;return e.split(fr).forEach(function(s){var o=s.match(Bs)||[];t.push.apply(t,o),i.push(r+=o.length+1)}),t.c=i,t},aE=function(e,t,i){var r="",s=(e+r).match(fr),o=t?"hsla(":"rgba(",a=0,c,l,u,d;if(!s)return e;if(s=s.map(function(f){return(f=NE(f,t,1))&&o+(t?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),i&&(u=PE(e),c=i.c,c.join(r)!==u.c.join(r)))for(l=e.replace(fr,"1").split(Bs),d=l.length-1;a<d;a++)r+=l[a]+(~c.indexOf(a)?s.shift()||o+"0,0,0,0)":(u.length?u:s.length?s:i).shift());if(!l)for(l=e.split(fr),d=l.length-1;a<d;a++)r+=l[a]+s[a];return r+l[d]},fr=(function(){var n="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in Pc)n+="|"+e+"\\b";return new RegExp(n+")","gi")})(),_P=/hsl[a]?\(/,c_=function(e){var t=e.join(" "),i;if(fr.lastIndex=0,fr.test(t))return i=_P.test(t),e[1]=aE(e[1],i),e[0]=aE(e[0],i,PE(e[1])),!0},Vc,En=(function(){var n=Date.now,e=500,t=33,i=n(),r=i,s=1e3/240,o=s,a=[],c,l,u,d,f,h,g=function _(m){var p=n()-r,E=m===!0,S,x,w,I;if((p>e||p<0)&&(i+=p-t),r+=p,w=r-i,S=w-o,(S>0||E)&&(I=++d.frame,f=w-d.time*1e3,d.time=w=w/1e3,o+=S+(S>=s?0:s-S),x=1),E||(c=l(_)),x)for(h=0;h<a.length;h++)a[h](w,f,I,m)};return d={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(m){return f/(1e3/(m||60))},wake:function(){fE&&(!jg&&Qg()&&(ki=jg=window,n_=ki.document||{},Vn.gsap=sn,(ki.gsapVersions||(ki.gsapVersions=[])).push(sn.version),hE(vf||ki.GreenSockGlobals||!ki.gsap&&ki||{}),DE.forEach(RE)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,c&&d.sleep(),l=u||function(m){return setTimeout(m,o-d.time*1e3+1|0)},Vc=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(c),Vc=0,l=Uc},lagSmoothing:function(m,p){e=m||1/0,t=Math.min(p||33,e)},fps:function(m){s=1e3/(m||240),o=d.time*1e3+s},add:function(m,p,E){var S=p?function(x,w,I,T){m(x,w,I,T),d.remove(S)}:m;return d.remove(m),a[E?"unshift":"push"](S),na(),S},remove:function(m,p){~(p=a.indexOf(m))&&a.splice(p,1)&&h>=p&&h--},_listeners:a},d})(),na=function(){return!Vc&&En.wake()},Xe={},vP=/^[\d.\-M][\d.\-,\s]/,yP=/["']/g,xP=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),r=i[0],s=1,o=i.length,a,c,l;s<o;s++)c=i[s],a=s!==o-1?c.lastIndexOf(","):c.length,l=c.substr(0,a),t[r]=isNaN(l)?l.replace(yP,"").trim():+l,r=c.substr(a+1).trim();return t},MP=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),r=e.indexOf("(",t);return e.substring(t,~r&&r<i?e.indexOf(")",i+1):i)},EP=function(e){var t=(e+"").split("("),i=Xe[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[xP(t[1])]:MP(e).split(",").map(_E)):Xe._CE&&vP.test(e)?Xe._CE("",e):i},bP=function(e){return function(t){return 1-e(1-t)}},Fs=function(e,t){return e&&(Rt(e)?e:Xe[e]||EP(e))||t},Vs=function(e,t,i,r){i===void 0&&(i=function(c){return 1-t(1-c)}),r===void 0&&(r=function(c){return c<.5?t(c*2)/2:1-t((1-c)*2)/2});var s={easeIn:t,easeOut:i,easeInOut:r},o;return un(e,function(a){Xe[a]=Vn[a]=s,Xe[o=a.toLowerCase()]=i;for(var c in s)Xe[o+(c==="easeIn"?".in":c==="easeOut"?".out":".inOut")]=Xe[a+"."+c]=s[c]}),s},OE=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},Vg=function n(e,t,i){var r=t>=1?t:1,s=(i||(e?.3:.45))/(t<1?t:1),o=s/Wg*(Math.asin(1/r)||0),a=function(u){return u===1?1:r*Math.pow(2,-10*u)*qN((u-o)*s)+1},c=e==="out"?a:e==="in"?function(l){return 1-a(1-l)}:OE(a);return s=Wg/s,c.config=function(l,u){return n(e,l,u)},c},Hg=function n(e,t){t===void 0&&(t=1.70158);var i=function(o){return o?--o*o*((t+1)*o+t)+1:0},r=e==="out"?i:e==="in"?function(s){return 1-i(1-s)}:OE(i);return r.config=function(s){return n(e,s)},r};un("Linear,Quad,Cubic,Quart,Quint,Strong",function(n,e){var t=e<5?e+1:e;Vs(n+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});Xe.Linear.easeNone=Xe.none=Xe.Linear.easeIn;Vs("Elastic",Vg("in"),Vg("out"),Vg());(function(n,e){var t=1/e,i=2*t,r=2.5*t,s=function(a){return a<t?n*a*a:a<i?n*Math.pow(a-1.5/e,2)+.75:a<r?n*(a-=2.25/e)*a+.9375:n*Math.pow(a-2.625/e,2)+.984375};Vs("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);Vs("Expo",function(n){return Math.pow(2,10*(n-1))*n+n*n*n*n*n*n*(1-n)});Vs("Circ",function(n){return-(uE(1-n*n)-1)});Vs("Sine",function(n){return n===1?1:-$N(n*WN)+1});Vs("Back",Hg("in"),Hg("out"),Hg());Xe.SteppedEase=Xe.steps=Vn.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,r=e+(t?0:1),s=t?1:0,o=1-ut;return function(a){return((r*Gc(0,o,a)|0)+s)*i}}};kc.ease=Xe["quad.out"];un("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(n){return r_+=n+","+n+"Params,"});var l_=function(e,t){this.id=jN++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:o_,this.set=t?t.getSetter:Df},Hc=(function(){function n(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,ta(this,+t.duration,1,1),this.data=t.data,xt&&(this._ctx=xt,xt.data.push(this)),Vc||En.wake()}var e=n.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,ta(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,r){if(na(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Af(this,i),!s._dp||s.parent||xE(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&Bi(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!r||this._initted&&Math.abs(this._zTime)===ut||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),gE(this,i,r)),this},e.time=function(i,r){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+rE(this))%(this._dur+this._rDelay)||(i?this._dur:0),r):this._time},e.totalProgress=function(i,r){return arguments.length?this.totalTime(this.totalDuration()*i,r):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,r){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+rE(this),r):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,r){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*s,r):this._repeat?ea(this._tTime,s)+1:1},e.timeScale=function(i,r){if(!arguments.length)return this._rts===-ut?0:this._rts;if(this._rts===i)return this;var s=this.parent&&this._ts?Mf(this.parent._time,this):this._tTime,o=this._rts<0;this._rts=+i||0,this._ts=this._ps||i===-ut?0:this._rts;var a=this.totalDuration();return(o!==this._rts<0||s>0&&s<a)&&this.totalTime(Gc(-Math.abs(this._delay),a,s),r!==!1),If(this),iP(this)},e.paused=function(i){if(!arguments.length)return this._ps;if(this._ps!==i)if(this._ps=i,i)this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0;else{na(),this._ts=this._rts;var r=this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,s=this.progress()===1&&Math.abs(this._zTime)!==ut,o;if(s)for(this._tTime-=ut,o=this._first;o;){if(!o._dur&&o._zTime<0&&o._ts&&o._start<=r+ut){s=!1;break}o=o._next}this.totalTime(r,s)}return this},e.startTime=function(i){if(arguments.length){this._start=bt(i);var r=this.parent||this._dp;return r&&(r._sort||!this.parent)&&Bi(r,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(bn(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var r=this.parent||this._dp;return r?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Mf(r.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=QN);var r=Xt;return Xt=i,a_(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Xt=r,this},e.globalTime=function(i){for(var r=this,s=arguments.length?i:r.rawTime();r;)s=r._start+s/(Math.abs(r._ts)||1),r=r._dp;return!this.parent&&this._sat?this._sat.globalTime(i):s},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,sE(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var r=this._time;return this._rDelay=i,sE(this),r?this.time(r):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,r){return this.totalTime(ti(this,i),bn(r))},e.restart=function(i,r){return this.play().totalTime(i?-this._delay:0,bn(r)),this._dur||(this._zTime=-ut),this},e.play=function(i,r){return i!=null&&this.seek(i,r),this.reversed(!1).paused(!1)},e.reverse=function(i,r){return i!=null&&this.seek(i||this.totalDuration(),r),this.reversed(!0).paused(!1)},e.pause=function(i,r){return i!=null&&this.seek(i,r),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-ut:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-ut,this},e.isActive=function(){var i=this.parent||this._dp,r=this._start,s;return!!(!i||this._ts&&this._initted&&i.isActive()&&(s=i.rawTime(!0))>=r&&s<this.endTime(!0)-ut)},e.eventCallback=function(i,r,s){var o=this.vars;return arguments.length>1?(r?(o[i]=r,s&&(o[i+"Params"]=s),i==="onUpdate"&&(this._onUpdate=r)):delete o[i],this):o[i]},e.then=function(i){var r=this,s=r._prom;return new Promise(function(o){var a=Rt(i)?i:vE,c=function(){var u=r.then;r.then=null,s&&s(),Rt(a)&&(a=a(r))&&(a.then||a===r)&&(r.then=u),o(a),r.then=u};r._initted&&r.totalProgress()===1&&r._ts>=0||!r._tTime&&r._ts<0?c():r._prom=c})},e.kill=function(){Nc(this)},n})();Hn(Hc.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-ut,_prom:0,_ps:!1,_rts:1});var nn=(function(n){lE(e,n);function e(i,r){var s;return i===void 0&&(i={}),s=n.call(this,i)||this,s.labels={},s.smoothChildTiming=!!i.smoothChildTiming,s.autoRemoveChildren=!!i.autoRemoveChildren,s._sort=bn(i.sortChildren),St&&Bi(i.parent||St,dr(s),r),i.reversed&&s.reverse(),i.paused&&s.paused(!0),i.scrollTrigger&&ME(dr(s),i.scrollTrigger),s}var t=e.prototype;return t.to=function(r,s,o){return Lc(0,arguments,this),this},t.from=function(r,s,o){return Lc(1,arguments,this),this},t.fromTo=function(r,s,o,a){return Lc(2,arguments,this),this},t.set=function(r,s,o){return s.duration=0,s.parent=this,Oc(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Lt(r,s,ti(this,o),1),this},t.call=function(r,s,o){return Bi(this,Lt.delayedCall(0,r,s),o)},t.staggerTo=function(r,s,o,a,c,l,u){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=l,o.onCompleteParams=u,o.parent=this,new Lt(r,o,ti(this,c)),this},t.staggerFrom=function(r,s,o,a,c,l,u){return o.runBackwards=1,Oc(o).immediateRender=bn(o.immediateRender),this.staggerTo(r,s,o,a,c,l,u)},t.staggerFromTo=function(r,s,o,a,c,l,u,d){return a.startAt=o,Oc(a).immediateRender=bn(a.immediateRender),this.staggerTo(r,s,a,c,l,u,d)},t.render=function(r,s,o){var a=this._time,c=this._dirty?this.totalDuration():this._tDur,l=this._dur,u=r<=0?0:bt(r),d=this._zTime<0!=r<0&&(this._initted||!l),f,h,g,_,m,p,E,S,x,w,I,T;if(this!==St&&u>c&&r>=0&&(u=c),u!==this._tTime||o||d){if(a!==this._time&&l&&(u+=this._time-a,r+=this._time-a),f=u,x=this._start,S=this._ts,p=!S,d&&(l||(a=this._zTime),(r||!s)&&(this._zTime=r)),this._repeat){if(I=this._yoyo,m=l+this._rDelay,this._repeat<-1&&r<0)return this.totalTime(m*100+r,s,o);if(f=bt(u%m),u===c?(_=this._repeat,f=l):(w=bt(u/m),_=~~w,_&&_===w&&(f=l,_--),f>l&&(f=l)),w=ea(this._tTime,m),!a&&this._tTime&&w!==_&&this._tTime-w*m-this._dur<=0&&(w=_),I&&_&1&&(f=l-f,T=1),_!==w&&!this._lock){var A=I&&w&1,y=A===(I&&_&1);if(_<w&&(A=!A),a=A?0:u%l?l:u,this._lock=1,this.render(a||(T?0:bt(_*m)),s,!l)._lock=0,this._tTime=u,!s&&this.parent&&Un(this,"onRepeat"),this.vars.repeatRefresh&&!T&&(this.invalidate()._lock=1,w=_),a&&a!==this._time||p!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(l=this._dur,c=this._tDur,y&&(this._lock=2,a=A?l:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!T&&this.invalidate()),this._lock=0,!this._ts&&!p)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(E=aP(this,bt(a),bt(f)),E&&(u-=f-(f=E._start))),this._tTime=u,this._time=f,this._act=!!S,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=r,a=0),!a&&u&&l&&!s&&!w&&(Un(this,"onStart"),this._tTime!==u))return this;if(f>=a&&r>=0)for(h=this._first;h;){if(g=h._next,(h._act||f>=h._start)&&h._ts&&E!==h){if(h.parent!==this)return this.render(r,s,o);if(h.render(h._ts>0?(f-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(f-h._start)*h._ts,s,o),f!==this._time||!this._ts&&!p){E=0,g&&(u+=this._zTime=-ut);break}}h=g}else{h=this._last;for(var M=r<0?r:f;h;){if(g=h._prev,(h._act||M<=h._end)&&h._ts&&E!==h){if(h.parent!==this)return this.render(r,s,o);if(h.render(h._ts>0?(M-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(M-h._start)*h._ts,s,o||Xt&&a_(h)),f!==this._time||!this._ts&&!p){E=0,g&&(u+=this._zTime=M?-ut:ut);break}}h=g}}if(E&&!s&&(this.pause(),E.render(f>=a?0:-ut)._zTime=f>=a?1:-1,this._ts))return this._start=x,If(this),this.render(r,s,o);this._onUpdate&&!s&&Un(this,"onUpdate",!0),(u===c&&this._tTime>=this.totalDuration()||!u&&a)&&(x===this._start||Math.abs(S)!==Math.abs(this._ts))&&(this._lock||((r||!l)&&(u===c&&this._ts>0||!u&&this._ts<0)&&jr(this,1),!s&&!(r<0&&!a)&&(u||a||!c)&&(Un(this,u===c&&r>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<c&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(r,s){var o=this;if(hr(s)||(s=ti(this,s,r)),!(r instanceof Hc)){if(rn(r))return r.forEach(function(a){return o.add(a,s)}),this;if(Ht(r))return this.addLabel(r,s);if(Rt(r))r=Lt.delayedCall(0,r);else return this}return this!==r?Bi(this,r,s):this},t.getChildren=function(r,s,o,a){r===void 0&&(r=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-ni);for(var c=[],l=this._first;l;)l._start>=a&&(l instanceof Lt?s&&c.push(l):(o&&c.push(l),r&&c.push.apply(c,l.getChildren(!0,s,o)))),l=l._next;return c},t.getById=function(r){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===r)return s[o]},t.remove=function(r){return Ht(r)?this.removeLabel(r):Rt(r)?this.killTweensOf(r):(r.parent===this&&Cf(this,r),r===this._recent&&(this._recent=this._last),Ls(this))},t.totalTime=function(r,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=bt(En.time-(this._ts>0?r/this._ts:(this.totalDuration()-r)/-this._ts))),n.prototype.totalTime.call(this,r,s),this._forcing=0,this):this._tTime},t.addLabel=function(r,s){return this.labels[r]=ti(this,s),this},t.removeLabel=function(r){return delete this.labels[r],this},t.addPause=function(r,s,o){var a=Lt.delayedCall(0,s||Uc,o);return a.data="isPause",this._hasPause=1,Bi(this,a,ti(this,r))},t.removePause=function(r){var s=this._first;for(r=ti(this,r);s;)s._start===r&&s.data==="isPause"&&jr(s),s=s._next},t.killTweensOf=function(r,s,o){for(var a=this.getTweensOf(r,o),c=a.length;c--;)zr!==a[c]&&a[c].kill(r,s);return this},t.getTweensOf=function(r,s){for(var o=[],a=ii(r),c=this._first,l=hr(s),u;c;)c instanceof Lt?eP(c._targets,a)&&(l?(!zr||c._initted&&c._ts)&&c.globalTime(0)<=s&&c.globalTime(c.totalDuration())>s:!s||c.isActive())&&o.push(c):(u=c.getTweensOf(a,s)).length&&o.push.apply(o,u),c=c._next;return o},t.tweenTo=function(r,s){s=s||{};var o=this,a=ti(o,r),c=s,l=c.startAt,u=c.onStart,d=c.onStartParams,f=c.immediateRender,h,g=Lt.to(o,Hn({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(l&&"time"in l?l.time:o._time))/o.timeScale())||ut,onStart:function(){if(o.pause(),!h){var m=s.duration||Math.abs((a-(l&&"time"in l?l.time:o._time))/o.timeScale());g._dur!==m&&ta(g,m,0,1).render(g._time,!0,!0),h=1}u&&u.apply(g,d||[])}},s));return f?g.render(0):g},t.tweenFromTo=function(r,s,o){return this.tweenTo(s,Hn({startAt:{time:ti(this,r)}},o))},t.recent=function(){return this._recent},t.nextLabel=function(r){return r===void 0&&(r=this._time),oE(this,ti(this,r))},t.previousLabel=function(r){return r===void 0&&(r=this._time),oE(this,ti(this,r),1)},t.currentLabel=function(r){return arguments.length?this.seek(r,!0):this.previousLabel(this._time+ut)},t.shiftChildren=function(r,s,o){o===void 0&&(o=0);var a=this._first,c=this.labels,l;for(r=bt(r);a;)a._start>=o&&(a._start+=r,a._end+=r),a=a._next;if(s)for(l in c)c[l]>=o&&(c[l]+=r);return Ls(this)},t.invalidate=function(r){var s=this._first;for(this._lock=0;s;)s.invalidate(r),s=s._next;return n.prototype.invalidate.call(this,r)},t.clear=function(r){r===void 0&&(r=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),r&&(this.labels={}),Ls(this)},t.totalDuration=function(r){var s=0,o=this,a=o._last,c=ni,l,u,d;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-r:r));if(o._dirty){for(d=o.parent;a;)l=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>c&&o._sort&&a._ts&&!o._lock?(o._lock=1,Bi(o,a,u-a._delay,1)._lock=0):c=u,u<0&&a._ts&&(s-=u,(!d&&!o._dp||d&&d.smoothChildTiming)&&(o._start+=bt(u/o._ts),o._time-=u,o._tTime-=u),o.shiftChildren(-u,!1,-1/0),c=0),a._end>s&&a._ts&&(s=a._end),a=l;ta(o,o===St&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},e.updateRoot=function(r){if(St._ts&&(gE(St,Mf(r,St)),mE=En.frame),En.frame>=nE){nE+=Sn.autoSleep||120;var s=St._first;if((!s||!s._ts)&&Sn.autoSleep&&En._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||En.sleep()}}},e})(Hc);Hn(nn.prototype,{_lock:0,_hasPause:0,_forcing:0});var SP=function(e,t,i,r,s,o,a){var c=new dn(this._pt,e,t,0,1,p_,null,s),l=0,u=0,d,f,h,g,_,m,p,E;for(c.b=i,c.e=r,i+="",r+="",(p=~r.indexOf("random("))&&(r=ia(r)),o&&(E=[i,r],o(E,e,t),i=E[0],r=E[1]),f=i.match(kg)||[];d=kg.exec(r);)g=d[0],_=r.substring(l,d.index),h?h=(h+1)%5:_.substr(-5)==="rgba("&&(h=1),g!==f[u++]&&(m=parseFloat(f[u-1])||0,c._pt={_next:c._pt,p:_||u===1?_:",",s:m,c:g.charAt(1)==="="?Us(m,g)-m:parseFloat(g)-m,m:h&&h<4?Math.round:0},l=kg.lastIndex);return c.c=l<r.length?r.substring(l,r.length):"",c.fp=a,(t_.test(r)||p)&&(c.e=0),this._pt=c,c},u_=function(e,t,i,r,s,o,a,c,l,u){Rt(r)&&(r=r(s||0,e,o));var d=e[t],f=i!=="get"?i:Rt(d)?l?e[t.indexOf("set")||!Rt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](l):e[t]():d,h=Rt(d)?l?AP:FE:h_,g;if(Ht(r)&&(~r.indexOf("random(")&&(r=ia(r)),r.charAt(1)==="="&&(g=Us(f,r)+(Yt(f)||0),(g||g===0)&&(r=g))),!u||f!==r||Jg)return!isNaN(f*r)&&r!==""?(g=new dn(this._pt,e,t,+f||0,r-(f||0),typeof d=="boolean"?RP:kE,0,h),l&&(g.fp=l),a&&g.modifier(a,this,e),this._pt=g):(!d&&!(t in e)&&Tf(t,r),SP.call(this,e,t,f,r,h,c||Sn.stringFilter,l))},wP=function(e,t,i,r,s){if(Rt(e)&&(e=Fc(e,s,t,i,r)),!Ui(e)||e.style&&e.nodeType||rn(e)||dE(e))return Ht(e)?Fc(e,s,t,i,r):e;var o={},a;for(a in e)o[a]=Fc(e[a],s,t,i,r);return o},d_=function(e,t,i,r,s,o){var a,c,l,u;if(Mn[e]&&(a=new Mn[e]).init(s,a.rawVars?t[e]:wP(t[e],r,s,o,i),i,r,o)!==!1&&(i._pt=c=new dn(i._pt,s,e,0,1,a.render,a,0,a.priority),i!==Ko))for(l=i._ptLookup[i._targets.indexOf(s)],u=a._props.length;u--;)l[a._props[u]]=c;return a},zr,Jg,f_=function n(e,t,i){var r=e.vars,s=r.ease,o=r.startAt,a=r.immediateRender,c=r.lazy,l=r.onUpdate,u=r.runBackwards,d=r.yoyoEase,f=r.keyframes,h=r.autoRevert,g=e._dur,_=e._startAt,m=e._targets,p=e.parent,E=p&&p.data==="nested"?p.vars.targets:m,S=e._overwrite==="auto"&&!Kg,x=e.timeline,w=r.easeReverse||d,I,T,A,y,M,R,L,k,W,z,G,j,U;if(x&&(!f||!s)&&(s="none"),e._ease=Fs(s,kc.ease),e._rEase=w&&(Fs(w)||e._ease),e._from=!x&&!!r.runBackwards,e._from&&(e.ratio=1),!x||f&&!r.stagger){if(k=m[0]?Wr(m[0]).harness:0,j=k&&r[k.prop],I=xf(r,i_),_&&(_._zTime<0&&_.progress(1),t<0&&u&&a&&!h?_.render(-1,!0):_.revert(u&&g?mf:KN),_._lazy=0),o){if(jr(e._startAt=Lt.set(m,Hn({data:"isStart",overwrite:!1,parent:p,immediateRender:!0,lazy:!_&&bn(c),startAt:null,delay:0,onUpdate:l&&function(){return Un(e,"onUpdate")},stagger:0},o))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Xt||!a&&!h)&&e._startAt.revert(mf),a&&g&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(u&&g&&!_){if(t&&(a=!1),A=Hn({overwrite:!1,data:"isFromStart",lazy:a&&!_&&bn(c),immediateRender:a,stagger:0,parent:p},I),j&&(A[k.prop]=j),jr(e._startAt=Lt.set(m,A)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Xt?e._startAt.revert(mf):e._startAt.render(-1,!0)),e._zTime=t,!a)n(e._startAt,ut,ut);else if(!t)return}for(e._pt=e._ptCache=0,c=g&&bn(c)||c&&!g,T=0;T<m.length;T++){if(M=m[T],L=M._gsap||s_(m)[T]._gsap,e._ptLookup[T]=z={},$g[L.id]&&Gr.length&&yf(),G=E===m?T:E.indexOf(M),k&&(W=new k).init(M,j||I,e,G,E)!==!1&&(e._pt=y=new dn(e._pt,M,W.name,0,1,W.render,W,0,W.priority),W._props.forEach(function(ne){z[ne]=y}),W.priority&&(R=1)),!k||j)for(A in I)Mn[A]&&(W=d_(A,I,e,G,M,E))?W.priority&&(R=1):z[A]=y=u_.call(e,M,A,"get",I[A],G,E,0,r.stringFilter);e._op&&e._op[T]&&e.kill(M,e._op[T]),S&&e._pt&&(zr=e,St.killTweensOf(M,z,e.globalTime(t)),U=!e.parent,zr=0),e._pt&&c&&($g[L.id]=1)}R&&g_(e),e._onInit&&e._onInit(e)}e._onUpdate=l,e._initted=(!e._op||e._pt)&&!U,f&&t<=0&&x.render(ni,!0,!0)},TP=function(e,t,i,r,s,o,a,c){var l=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,d,f,h;if(!l)for(l=e._ptCache[t]=[],f=e._ptLookup,h=e._targets.length;h--;){if(u=f[h][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return Jg=1,e.vars[t]="+=0",f_(e,a),Jg=0,c?Bc(t+" not eligible for reset. Try splitting into individual properties"):1;l.push(u)}for(h=l.length;h--;)d=l[h],u=d._pt||d,u.s=(r||r===0)&&!s?r:u.s+(r||0)+o*u.c,u.c=i-u.s,d.e&&(d.e=Nt(i)+Yt(d.e)),d.b&&(d.b=u.s+Yt(d.b))},CP=function(e,t){var i=e[0]?Wr(e[0]).harness:0,r=i&&i.aliases,s,o,a,c;if(!r)return t;s=Qo({},t);for(o in r)if(o in s)for(c=r[o].split(","),a=c.length;a--;)s[c[a]]=s[o];return s},IP=function(e,t,i,r){var s=t.ease||r||"power1.inOut",o,a;if(rn(t))a=i[e]||(i[e]=[]),t.forEach(function(c,l){return a.push({t:l/(t.length-1)*100,v:c,e:s})});else for(o in t)a=i[o]||(i[o]=[]),o==="ease"||a.push({t:parseFloat(e),v:t[o],e:s})},Fc=function(e,t,i,r,s){return Rt(e)?e.call(t,i,r,s):Ht(e)&&~e.indexOf("random(")?ia(e):e},bf=r_+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",LE={};un(bf+",id,stagger,delay,duration,paused,scrollTrigger",function(n){return LE[n]=1});bf=bf.split(",");var Lt=(function(n){lE(e,n);function e(i,r,s,o){var a;typeof r=="number"&&(s.duration=r,r=s,s=null),a=n.call(this,o?r:Oc(r))||this;var c=a.vars,l=c.duration,u=c.delay,d=c.immediateRender,f=c.stagger,h=c.overwrite,g=c.keyframes,_=c.defaults,m=c.scrollTrigger,p=r.parent||St,E=(rn(i)||dE(i)?hr(i[0]):"length"in r)?[i]:ii(i),S,x,w,I,T,A,y,M;if(a._targets=E.length?s_(E):Bc("GSAP target "+i+" not found. https://gsap.com",!Sn.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=h,g||f||pf(l)||pf(u)){r=a.vars;var R=r.easeReverse||r.yoyoEase;if(S=a.timeline=new nn({data:"nested",defaults:_||{},targets:p&&p.data==="nested"?p.vars.targets:E}),S.kill(),S.parent=S._dp=dr(a),S._start=0,f||pf(l)||pf(u)){if(I=E.length,y=f&&wE(f),Ui(f))for(T in f)~bf.indexOf(T)&&(M||(M={}),M[T]=f[T]);for(x=0;x<I;x++)w=xf(r,LE),w.stagger=0,R&&(w.easeReverse=R),M&&Qo(w,M),A=E[x],w.duration=+Fc(l,dr(a),x,A,E),w.delay=(+Fc(u,dr(a),x,A,E)||0)-a._delay,!f&&I===1&&w.delay&&(a._delay=u=w.delay,a._start+=u,w.delay=0),S.to(A,w,y?y(x,A,E):0),S._ease=Xe.none;S.duration()?l=u=0:a.timeline=0}else if(g){Oc(Hn(S.vars.defaults,{ease:"none"})),S._ease=Fs(g.ease||r.ease||"none");var L=0,k,W,z;if(rn(g))g.forEach(function(G){return S.to(E,G,">")}),S.duration();else{w={};for(T in g)T==="ease"||T==="easeEach"||IP(T,g[T],w,g.easeEach);for(T in w)for(k=w[T].sort(function(G,j){return G.t-j.t}),L=0,x=0;x<k.length;x++)W=k[x],z={ease:W.e,duration:(W.t-(x?k[x-1].t:0))/100*l},z[T]=W.v,S.to(E,z,L),L+=z.duration;S.duration()<l&&S.to({},{duration:l-S.duration()})}}l||a.duration(l=S.duration())}else a.timeline=0;return h===!0&&!Kg&&(zr=dr(a),St.killTweensOf(E),zr=0),Bi(p,dr(a),s),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(d||!l&&!g&&a._start===bt(p._time)&&bn(d)&&rP(dr(a))&&p.data!=="nested")&&(a._tTime=-ut,a.render(Math.max(0,-u)||0)),m&&ME(dr(a),m),a}var t=e.prototype;return t.render=function(r,s,o){var a=this._time,c=this._tDur,l=this._dur,u=r<0,d=r>c-ut&&!u?c:r<ut?0:r,f,h,g,_,m,p,E,S;if(!l)oP(this,r,s,o);else if(d!==this._tTime||!r||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(f=d,S=this.timeline,this._repeat){if(_=l+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+r,s,o);if(f=bt(d%_),d===c?(g=this._repeat,f=l):(m=bt(d/_),g=~~m,g&&g===m?(f=l,g--):f>l&&(f=l)),p=this._yoyo&&g&1,p&&(f=l-f),m=ea(this._tTime,_),f===a&&!o&&this._initted&&g===m)return this._tTime=d,this;g!==m&&this.vars.repeatRefresh&&!p&&!this._lock&&f!==_&&this._initted&&(this._lock=o=1,this.render(bt(_*g),!0).invalidate()._lock=0)}if(!this._initted){if(EE(this,u?r:f,o,s,d))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&g!==m))return this;if(l!==this._dur)return this.render(r,s,o)}if(this._rEase){var x=f<a;if(x!==this._inv){var w=x?a:l-a;this._inv=x,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=w?(x?-1:1)/w:0,this._invScale=x?-this.ratio:1-this.ratio,this._invEase=x?this._rEase:this._ease}this.ratio=E=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=E=this._ease(f/l);if(this._from&&(this.ratio=E=1-E),this._tTime=d,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&d&&!s&&!m&&(Un(this,"onStart"),this._tTime!==d))return this;for(h=this._pt;h;)h.r(E,h.d),h=h._next;S&&S.render(r<0?r:S._dur*S._ease(f/this._dur),s,o)||this._startAt&&(this._zTime=r),this._onUpdate&&!s&&(u&&qg(this,r,s,o),Un(this,"onUpdate")),this._repeat&&g!==m&&this.vars.onRepeat&&!s&&this.parent&&Un(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(u&&!this._onUpdate&&qg(this,r,!0,!0),(r||!l)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&jr(this,1),!s&&!(u&&!a)&&(d||a||p)&&(Un(this,d===c?"onComplete":"onReverseComplete",!0),this._prom&&!(d<c&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(r){return(!r||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(r),n.prototype.invalidate.call(this,r)},t.resetTo=function(r,s,o,a,c){Vc||En.wake(),this._ts||this.play();var l=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||f_(this,l),u=this._ease(l/this._dur),TP(this,r,s,o,a,u,l,c)?this.resetTo(r,s,o,a,1):(Af(this,0),this.parent||yE(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(r,s){if(s===void 0&&(s="all"),!r&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?Nc(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Xt),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(r,s,zr&&zr.vars.overwrite!==!0)._first||Nc(this),this.parent&&o!==this.timeline.totalDuration()&&ta(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,c=r?ii(r):a,l=this._ptLookup,u=this._pt,d,f,h,g,_,m,p;if((!s||s==="all")&&nP(a,c))return s==="all"&&(this._pt=0),Nc(this);for(d=this._op=this._op||[],s!=="all"&&(Ht(s)&&(_={},un(s,function(E){return _[E]=1}),s=_),s=CP(a,s)),p=a.length;p--;)if(~c.indexOf(a[p])){f=l[p],s==="all"?(d[p]=s,g=f,h={}):(h=d[p]=d[p]||{},g=s);for(_ in g)m=f&&f[_],m&&((!("kill"in m.d)||m.d.kill(_)===!0)&&Cf(this,m,"_pt"),delete f[_]),h!=="all"&&(h[_]=1)}return this._initted&&!this._pt&&u&&Nc(this),this},e.to=function(r,s){return new e(r,s,arguments[2])},e.from=function(r,s){return Lc(1,arguments)},e.delayedCall=function(r,s,o,a){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:r,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},e.fromTo=function(r,s,o){return Lc(2,arguments)},e.set=function(r,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(r,s)},e.killTweensOf=function(r,s,o){return St.killTweensOf(r,s,o)},e})(Hc);Hn(Lt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});un("staggerTo,staggerFrom,staggerFromTo",function(n){Lt[n]=function(){var e=new nn,t=Xg.call(arguments,0);return t.splice(n==="staggerFromTo"?5:4,0,0),e[n].apply(e,t)}});var h_=function(e,t,i){return e[t]=i},FE=function(e,t,i){return e[t](i)},AP=function(e,t,i,r){return e[t](r.fp,i)},DP=function(e,t,i){return e.setAttribute(t,i)},Df=function(e,t){return Rt(e[t])?FE:wf(e[t])&&e.setAttribute?DP:h_},kE=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},RP=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},p_=function(e,t){var i=t._pt,r="";if(!e&&t.b)r=t.b;else if(e===1&&t.e)r=t.e;else{for(;i;)r=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+r,i=i._next;r+=t.c}t.set(t.t,t.p,r,t)},m_=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},NP=function(e,t,i,r){for(var s=this._pt,o;s;)o=s._next,s.p===r&&s.modifier(e,t,i),s=o},PP=function(e){for(var t=this._pt,i,r;t;)r=t._next,t.p===e&&!t.op||t.op===e?Cf(this,t,"_pt"):t.dep||(i=1),t=r;return!i},OP=function(e,t,i,r){r.mSet(e,t,r.m.call(r.tween,i,r.mt),r)},g_=function(e){for(var t=e._pt,i,r,s,o;t;){for(i=t._next,r=s;r&&r.pr>t.pr;)r=r._next;(t._prev=r?r._prev:o)?t._prev._next=t:s=t,(t._next=r)?r._prev=t:o=t,t=i}e._pt=s},dn=(function(){function n(t,i,r,s,o,a,c,l,u){this.t=i,this.s=s,this.c=o,this.p=r,this.r=a||kE,this.d=c||this,this.set=l||h_,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=n.prototype;return e.modifier=function(i,r,s){this.mSet=this.mSet||this.set,this.set=OP,this.m=i,this.mt=s,this.tween=r},n})();un(r_+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(n){return i_[n]=1});Vn.TweenMax=Vn.TweenLite=Lt;Vn.TimelineLite=Vn.TimelineMax=nn;St=new nn({sortChildren:!1,defaults:kc,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Sn.stringFilter=c_;var ks=[],_f={},LP=[],cE=0,FP=0,zg=function(e){return(_f[e]||LP).map(function(t){return t()})},zc=function(){var e=Date.now(),t=[];e-cE>2&&(zg("matchMediaInit"),ks.forEach(function(i){var r=i.queries,s=i.conditions,o,a,c,l;for(a in r)o=ki.matchMedia(r[a]).matches,o&&(c=1),o!==s[a]&&(s[a]=o,l=1);l&&(i.revert(),c&&t.push(i))}),zg("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(r){return i.add(null,r)})}),cE=e,zg("matchMedia"))},BE=(function(){function n(t,i){this.selector=i&&Yg(i),this.data=[],this._r=[],this.isReverted=!1,this.id=FP++,t&&this.add(t)}var e=n.prototype;return e.add=function(i,r,s){Rt(i)&&(s=r,r=i,i=Rt);var o=this,a=function(){var l=xt,u=o.selector,d;return l&&l!==o&&l.data.push(o),s&&(o.selector=Yg(s)),xt=o,d=r.apply(o,arguments),Rt(d)&&o._r.push(d),xt=l,o.selector=u,o.isReverted=!1,d};return o.last=a,i===Rt?a(o,function(c){return o.add(null,c)}):i?o[i]=a:a},e.ignore=function(i){var r=xt;xt=null,i(this),xt=r},e.getTweens=function(){var i=[];return this.data.forEach(function(r){return r instanceof n?i.push.apply(i,r.getTweens()):r instanceof Lt&&!(r.parent&&r.parent.data==="nested")&&i.push(r)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,r){var s=this;if(i?(function(){for(var a=s.getTweens(),c=s.data.length,l;c--;)l=s.data[c],l.data==="isFlip"&&(l.revert(),l.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,d){return d.g-u.g||-1/0}).forEach(function(u){return u.t.revert(i)}),c=s.data.length;c--;)l=s.data[c],l instanceof nn?l.data!=="nested"&&(l.scrollTrigger&&l.scrollTrigger.revert(),l.kill()):!(l instanceof Lt)&&l.revert&&l.revert(i);s._r.forEach(function(u){return u(i,s)}),s.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),r){for(var o=ks.length;o--;)ks[o].id===this.id&&ks.splice(o,1);this._mqs&&this._mqs.forEach(function(a){return a.removeListener?a.removeListener(zc):a.removeEventListener("change",zc)}),this._mqs=null}},e.revert=function(i){this.kill(i||{})},n})(),kP=(function(){function n(t){this.contexts=[],this.scope=t,xt&&xt.data.push(this)}var e=n.prototype;return e.add=function(i,r,s){Ui(i)||(i={matches:i});var o=new BE(0,s||this.scope),a=o.conditions={},c,l,u;xt&&!o.selector&&(o.selector=xt.selector),this.contexts.push(o),r=o.add("onMatch",r),o.queries=i;for(l in i)l==="all"?u=1:(c=ki.matchMedia(i[l]),c&&(ks.indexOf(o)<0&&ks.push(o),(a[l]=c.matches)&&(u=1),c.addListener?c.addListener(zc):c.addEventListener("change",zc),(o._mqs||(o._mqs=[])).push(c)));return u&&r(o,function(d){return o.add(null,d)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(r){return r.kill(i,!0)})},n})(),Sf={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(r){return RE(r)})},timeline:function(e){return new nn(e)},getTweensOf:function(e,t){return St.getTweensOf(e,t)},getProperty:function(e,t,i,r){Ht(e)&&(e=ii(e)[0]);var s=Wr(e||{}).get,o=i?vE:_E;return i==="native"&&(i=""),e&&(t?o((Mn[t]&&Mn[t].get||s)(e,t,i,r)):function(a,c,l){return o((Mn[a]&&Mn[a].get||s)(e,a,c,l))})},quickSetter:function(e,t,i){if(e=ii(e),e.length>1){var r=e.map(function(u){return sn.quickSetter(u,t,i)}),s=r.length;return function(u){for(var d=s;d--;)r[d](u)}}e=e[0]||{};var o=Mn[t],a=Wr(e),c=a.harness&&(a.harness.aliases||{})[t]||t,l=o?function(u){var d=new o;Ko._pt=0,d.init(e,i?u+i:u,Ko,0,[e]),d.render(1,d),Ko._pt&&m_(1,Ko)}:a.set(e,c);return o?l:function(u){return l(e,c,i?u+i:u,a,1)}},quickTo:function(e,t,i){var r,s=sn.to(e,Hn((r={},r[t]="+=0.1",r.paused=!0,r.stagger=0,r),i||{})),o=function(c,l,u){return s.resetTo(t,c,l,u)};return o.tween=s,o},isTweening:function(e){return St.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=Fs(e.ease,kc.ease)),iE(kc,e||{})},config:function(e){return iE(Sn,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,r=e.plugins,s=e.defaults,o=e.extendTimeline;(r||"").split(",").forEach(function(a){return a&&!Mn[a]&&!Vn[a]&&Bc(t+" effect requires "+a+" plugin.")}),Bg[t]=function(a,c,l){return i(ii(a),Hn(c||{},s),l)},o&&(nn.prototype[t]=function(a,c,l){return this.add(Bg[t](a,Ui(c)?c:(l=c)&&{},this),l)})},registerEase:function(e,t){Xe[e]=Fs(t)},parseEase:function(e,t){return arguments.length?Fs(e,t):Xe},getById:function(e){return St.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new nn(e),r,s;for(i.smoothChildTiming=bn(e.smoothChildTiming),St.remove(i),i._dp=0,i._time=i._tTime=St._time,r=St._first;r;)s=r._next,(t||!(!r._dur&&r instanceof Lt&&r.vars.onComplete===r._targets[0]))&&Bi(i,r,r._start-r._delay),r=s;return Bi(St,i,0),i},context:function(e,t){return e?new BE(e,t):xt},matchMedia:function(e){return new kP(e)},matchMediaRefresh:function(){return ks.forEach(function(e){var t=e.conditions,i,r;for(r in t)t[r]&&(t[r]=!1,i=1);i&&e.revert()})||zc()},addEventListener:function(e,t){var i=_f[e]||(_f[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=_f[e],r=i&&i.indexOf(t);r>=0&&i.splice(r,1)},utils:{wrap:pP,wrapYoyo:mP,distribute:wE,random:CE,snap:TE,normalize:hP,getUnit:Yt,clamp:lP,splitColor:NE,toArray:ii,selector:Yg,mapRange:AE,pipe:dP,unitize:fP,interpolate:gP,shuffle:SE},install:hE,effects:Bg,ticker:En,updateRoot:nn.updateRoot,plugins:Mn,globalTimeline:St,core:{PropTween:dn,globals:pE,Tween:Lt,Timeline:nn,Animation:Hc,getCache:Wr,_removeLinkedListItem:Cf,reverting:function(){return Xt},context:function(e){return e&&xt&&(xt.data.push(e),e._ctx=xt),xt},suppressOverwrites:function(e){return Kg=e}}};un("to,from,fromTo,delayedCall,set,killTweensOf",function(n){return Sf[n]=Lt[n]});En.add(nn.updateRoot);Ko=Sf.to({},{duration:0});var BP=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},UP=function(e,t){var i=e._targets,r,s,o;for(r in t)for(s=i.length;s--;)o=e._ptLookup[s][r],o&&(o=o.d)&&(o._pt&&(o=BP(o,r)),o&&o.modifier&&o.modifier(t[r],e,i[s],r))},Gg=function(e,t){return{name:e,headless:1,rawVars:1,init:function(r,s,o){o._onInit=function(a){var c,l;if(Ht(s)&&(c={},un(s,function(u){return c[u]=1}),s=c),t){c={};for(l in s)c[l]=t(s[l]);s=c}UP(a,s)}}}},sn=Sf.registerPlugin({name:"attr",init:function(e,t,i,r,s){var o,a,c;this.tween=i;for(o in t)c=e.getAttribute(o)||"",a=this.add(e,"setAttribute",(c||0)+"",t[o],r,s,0,0,o),a.op=o,a.b=c,this._props.push(o)},render:function(e,t){for(var i=t._pt;i;)Xt?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},Gg("roundProps",Zg),Gg("modifiers"),Gg("snap",TE))||Sf;Lt.version=nn.version=sn.version="3.15.1";fE=1;Qg()&&na();var VP=Xe.Power0,HP=Xe.Power1,zP=Xe.Power2,GP=Xe.Power3,WP=Xe.Power4,jP=Xe.Linear,$P=Xe.Quad,qP=Xe.Cubic,XP=Xe.Quart,YP=Xe.Quint,ZP=Xe.Strong,JP=Xe.Elastic,KP=Xe.Back,QP=Xe.SteppedEase,eO=Xe.Bounce,tO=Xe.Sine,nO=Xe.Expo,iO=Xe.Circ;var UE,qr,sa,E_,Ws,rO,VE,b_,sO=function(){return typeof window<"u"},mr={},Gs=180/Math.PI,oa=Math.PI/180,ra=Math.atan2,HE=1e8,S_=/([A-Z])/g,oO=/(left|right|width|margin|padding|x)/i,aO=/[\s,\(]\S/,Vi={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},v_=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},cO=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},lO=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},uO=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},dO=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},YE=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},ZE=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},fO=function(e,t,i){return e.style[t]=i},hO=function(e,t,i){return e.style.setProperty(t,i)},pO=function(e,t,i){return e._gsap[t]=i},mO=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},gO=function(e,t,i,r,s){var o=e._gsap;o.scaleX=o.scaleY=i,o.renderTransform(s,o)},_O=function(e,t,i,r,s){var o=e._gsap;o[t]=i,o.renderTransform(s,o)},wt="transform",wn=wt+"Origin",vO=function n(e,t){var i=this,r=this.target,s=r.style,o=r._gsap;if(e in mr&&s){if(this.tfm=this.tfm||{},e!=="transform")e=Vi[e]||e,~e.indexOf(",")?e.split(",").forEach(function(a){return i.tfm[a]=pr(r,a)}):this.tfm[e]=o.x?o[e]:pr(r,e),e===wn&&(this.tfm.zOrigin=o.zOrigin);else return Vi.transform.split(",").forEach(function(a){return n.call(i,a,t)});if(this.props.indexOf(wt)>=0)return;o.svg&&(this.svgo=r.getAttribute("data-svg-origin"),this.props.push(wn,t,"")),e=wt}(s||t)&&this.props.push(e,t,s[e])},JE=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},yO=function(){var e=this.props,t=this.target,i=t.style,r=t._gsap,s,o;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?i[e[s]]=e[s+2]:i.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(S_,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)r[o]=this.tfm[o];r.svg&&(r.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=b_(),(!s||!s.isStart)&&!i[wt]&&(JE(i),r.zOrigin&&i[wn]&&(i[wn]+=" "+r.zOrigin+"px",r.zOrigin=0,r.renderTransform()),r.uncache=1)}},KE=function(e,t){var i={target:e,props:[],revert:yO,save:vO};return e._gsap||sn.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(r){return i.save(r)}),i},QE,y_=function(e,t){var i=qr.createElementNS?qr.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):qr.createElement(e);return i&&i.style?i:qr.createElement(e)},zn=function n(e,t,i){var r=getComputedStyle(e);return r[t]||r.getPropertyValue(t.replace(S_,"-$1").toLowerCase())||r.getPropertyValue(t)||!i&&n(e,aa(t)||t,1)||""},zE="O,Moz,ms,Ms,Webkit".split(","),aa=function(e,t,i){var r=t||Ws,s=r.style,o=5;if(e in s&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);o--&&!(zE[o]+e in s););return o<0?null:(o===3?"ms":o>=0?zE[o]:"")+e},x_=function(){sO()&&window.document&&(UE=window,qr=UE.document,sa=qr.documentElement,Ws=y_("div")||{style:{}},rO=y_("div"),wt=aa(wt),wn=wt+"Origin",Ws.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",QE=!!aa("perspective"),b_=sn.core.reverting,E_=1)},GE=function(e){var t=e.ownerSVGElement,i=y_("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),r=e.cloneNode(!0),s;r.style.display="block",i.appendChild(r),sa.appendChild(i);try{s=r.getBBox()}catch{}return i.removeChild(r),sa.removeChild(i),s},WE=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},eb=function(e){var t,i;try{t=e.getBBox()}catch{t=GE(e),i=1}return t&&(t.width||t.height)||i||(t=GE(e)),t&&!t.width&&!t.x&&!t.y?{x:+WE(e,["x","cx","x1"])||0,y:+WE(e,["y","cy","y1"])||0,width:0,height:0}:t},tb=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&eb(e))},Yr=function(e,t){if(t){var i=e.style,r;t in mr&&t!==wn&&(t=wt),i.removeProperty?(r=t.substr(0,2),(r==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(r==="--"?t:t.replace(S_,"-$1").toLowerCase())):i.removeAttribute(t)}},Xr=function(e,t,i,r,s,o){var a=new dn(e._pt,t,i,0,1,o?ZE:YE);return e._pt=a,a.b=r,a.e=s,e._props.push(i),a},jE={deg:1,rad:1,turn:1},xO={grid:1,flex:1},Zr=function n(e,t,i,r){var s=parseFloat(i)||0,o=(i+"").trim().substr((s+"").length)||"px",a=Ws.style,c=oO.test(t),l=e.tagName.toLowerCase()==="svg",u=(l?"client":"offset")+(c?"Width":"Height"),d=100,f=r==="px",h=r==="%",g,_,m,p;if(r===o||!s||jE[r]||jE[o])return s;if(o!=="px"&&!f&&(s=n(e,t,i,"px")),p=e.getCTM&&tb(e),(h||o==="%")&&(mr[t]||~t.indexOf("adius")))return g=p?e.getBBox()[c?"width":"height"]:e[u],Nt(h?s/g*d:s/100*g);if(a[c?"width":"height"]=d+(f?o:r),_=r!=="rem"&&~t.indexOf("adius")||r==="em"&&e.appendChild&&!l?e:e.parentNode,p&&(_=(e.ownerSVGElement||{}).parentNode),(!_||_===qr||!_.appendChild)&&(_=qr.body),m=_._gsap,m&&h&&m.width&&c&&m.time===En.time&&!m.uncache)return Nt(s/m.width*d);if(h&&(t==="height"||t==="width")){var E=e.style[t];e.style[t]=d+r,g=e[u],E?e.style[t]=E:Yr(e,t)}else(h||o==="%")&&!xO[zn(_,"display")]&&(a.position=zn(e,"position")),_===e&&(a.position="static"),_.appendChild(Ws),g=Ws[u],_.removeChild(Ws),a.position="absolute";return c&&h&&(m=Wr(_),m.time=En.time,m.width=_[u]),Nt(f?g*s/d:g&&s?d/g*s:0)},pr=function(e,t,i,r){var s;return E_||x_(),t in Vi&&t!=="transform"&&(t=Vi[t],~t.indexOf(",")&&(t=t.split(",")[0])),mr[t]&&t!=="transform"?(s=$c(e,r),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:Nf(zn(e,wn))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||r||~(s+"").indexOf("calc("))&&(s=Rf[t]&&Rf[t](e,t,i)||zn(e,t)||o_(e,t)||(t==="opacity"?1:0))),i&&!~(s+"").trim().indexOf(" ")?Zr(e,t,s,i)+i:s},MO=function(e,t,i,r){if(!i||i==="none"){var s=aa(t,e,1),o=s&&zn(e,s,1);o&&o!==i?(t=s,i=o):t==="borderColor"&&(i=zn(e,"borderTopColor"))}var a=new dn(this._pt,e.style,t,0,1,p_),c=0,l=0,u,d,f,h,g,_,m,p,E,S,x,w;if(a.b=i,a.e=r,i+="",r+="",r.substring(0,6)==="var(--"&&(r=zn(e,r.substring(4,r.indexOf(")")))),r==="auto"&&(_=e.style[t],e.style[t]=r,r=zn(e,t)||r,_?e.style[t]=_:Yr(e,t)),u=[i,r],c_(u),i=u[0],r=u[1],f=i.match(Bs)||[],w=r.match(Bs)||[],w.length){for(;d=Bs.exec(r);)m=d[0],E=r.substring(c,d.index),g?g=(g+1)%5:(E.substr(-5)==="rgba("||E.substr(-5)==="hsla(")&&(g=1),m!==(_=f[l++]||"")&&(h=parseFloat(_)||0,x=_.substr((h+"").length),m.charAt(1)==="="&&(m=Us(h,m)+x),p=parseFloat(m),S=m.substr((p+"").length),c=Bs.lastIndex-S.length,S||(S=S||Sn.units[t]||x,c===r.length&&(r+=S,a.e+=S)),x!==S&&(h=Zr(e,t,_,S)||0),a._pt={_next:a._pt,p:E||l===1?E:",",s:h,c:p-h,m:g&&g<4||t==="zIndex"?Math.round:0});a.c=c<r.length?r.substring(c,r.length):""}else a.r=t==="display"&&r==="none"?ZE:YE;return t_.test(r)&&(a.e=0),this._pt=a,a},$E={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},EO=function(e){var t=e.split(" "),i=t[0],r=t[1]||"50%";return(i==="top"||i==="bottom"||r==="left"||r==="right")&&(e=i,i=r,r=e),t[0]=$E[i]||i,t[1]=$E[r]||r,t.join(" ")},bO=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,r=i.style,s=t.u,o=i._gsap,a,c,l;if(s==="all"||s===!0)r.cssText="",c=1;else for(s=s.split(","),l=s.length;--l>-1;)a=s[l],mr[a]&&(c=1,a=a==="transformOrigin"?wn:wt),Yr(i,a);c&&(Yr(i,wt),o&&(o.svg&&i.removeAttribute("transform"),r.scale=r.rotate=r.translate="none",$c(i,1),o.uncache=1,JE(r)))}},Rf={clearProps:function(e,t,i,r,s){if(s.data!=="isFromStart"){var o=e._pt=new dn(e._pt,t,i,0,0,bO);return o.u=r,o.pr=-10,o.tween=s,e._props.push(i),1}}},jc=[1,0,0,1,0,0],nb={},ib=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},qE=function(e){var t=zn(e,wt);return ib(t)?jc:t.substr(7).match(e_).map(Nt)},w_=function(e,t){var i=e._gsap||Wr(e),r=e.style,s=qE(e),o,a,c,l;return i.svg&&e.getAttribute("transform")?(c=e.transform.baseVal.consolidate().matrix,s=[c.a,c.b,c.c,c.d,c.e,c.f],s.join(",")==="1,0,0,1,0,0"?jc:s):(s===jc&&!e.offsetParent&&e!==sa&&!i.svg&&(c=r.display,r.display="block",o=e.parentNode,(!o||!e.offsetParent&&!e.getBoundingClientRect().width)&&(l=1,a=e.nextElementSibling,sa.appendChild(e)),s=qE(e),c?r.display=c:Yr(e,"display"),l&&(a?o.insertBefore(e,a):o?o.appendChild(e):sa.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},M_=function(e,t,i,r,s,o){var a=e._gsap,c=s||w_(e,!0),l=a.xOrigin||0,u=a.yOrigin||0,d=a.xOffset||0,f=a.yOffset||0,h=c[0],g=c[1],_=c[2],m=c[3],p=c[4],E=c[5],S=t.split(" "),x=parseFloat(S[0])||0,w=parseFloat(S[1])||0,I,T,A,y;i?c!==jc&&(T=h*m-g*_)&&(A=x*(m/T)+w*(-_/T)+(_*E-m*p)/T,y=x*(-g/T)+w*(h/T)-(h*E-g*p)/T,x=A,w=y):(I=eb(e),x=I.x+(~S[0].indexOf("%")?x/100*I.width:x),w=I.y+(~(S[1]||S[0]).indexOf("%")?w/100*I.height:w)),r||r!==!1&&a.smooth?(p=x-l,E=w-u,a.xOffset=d+(p*h+E*_)-p,a.yOffset=f+(p*g+E*m)-E):a.xOffset=a.yOffset=0,a.xOrigin=x,a.yOrigin=w,a.smooth=!!r,a.origin=t,a.originIsAbsolute=!!i,e.style[wn]="0px 0px",o&&(Xr(o,a,"xOrigin",l,x),Xr(o,a,"yOrigin",u,w),Xr(o,a,"xOffset",d,a.xOffset),Xr(o,a,"yOffset",f,a.yOffset)),e.setAttribute("data-svg-origin",x+" "+w)},$c=function(e,t){var i=e._gsap||new l_(e);if("x"in i&&!t&&!i.uncache)return i;var r=e.style,s=i.scaleX<0,o="px",a="deg",c=getComputedStyle(e),l=zn(e,wn)||"0",u,d,f,h,g,_,m,p,E,S,x,w,I,T,A,y,M,R,L,k,W,z,G,j,U,ne,oe,fe,Ae,et,He,Pe;return u=d=f=_=m=p=E=S=x=0,h=g=1,i.svg=!!(e.getCTM&&tb(e)),c.translate&&((c.translate!=="none"||c.scale!=="none"||c.rotate!=="none")&&(r[wt]=(c.translate!=="none"?"translate3d("+(c.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(c.rotate!=="none"?"rotate("+c.rotate+") ":"")+(c.scale!=="none"?"scale("+c.scale.split(" ").join(",")+") ":"")+(c[wt]!=="none"?c[wt]:"")),r.scale=r.rotate=r.translate="none"),T=w_(e,i.svg),i.svg&&(i.uncache?(U=e.getBBox(),l=i.xOrigin-U.x+"px "+(i.yOrigin-U.y)+"px",j=""):j=!t&&e.getAttribute("data-svg-origin"),M_(e,j||l,!!j||i.originIsAbsolute,i.smooth!==!1,T)),w=i.xOrigin||0,I=i.yOrigin||0,T!==jc&&(R=T[0],L=T[1],k=T[2],W=T[3],u=z=T[4],d=G=T[5],T.length===6?(h=Math.sqrt(R*R+L*L),g=Math.sqrt(W*W+k*k),_=R||L?ra(L,R)*Gs:0,E=k||W?ra(k,W)*Gs+_:0,E&&(g*=Math.abs(Math.cos(E*oa))),i.svg&&(u-=w-(w*R+I*k),d-=I-(w*L+I*W))):(Pe=T[6],et=T[7],oe=T[8],fe=T[9],Ae=T[10],He=T[11],u=T[12],d=T[13],f=T[14],A=ra(Pe,Ae),m=A*Gs,A&&(y=Math.cos(-A),M=Math.sin(-A),j=z*y+oe*M,U=G*y+fe*M,ne=Pe*y+Ae*M,oe=z*-M+oe*y,fe=G*-M+fe*y,Ae=Pe*-M+Ae*y,He=et*-M+He*y,z=j,G=U,Pe=ne),A=ra(-k,Ae),p=A*Gs,A&&(y=Math.cos(-A),M=Math.sin(-A),j=R*y-oe*M,U=L*y-fe*M,ne=k*y-Ae*M,He=W*M+He*y,R=j,L=U,k=ne),A=ra(L,R),_=A*Gs,A&&(y=Math.cos(A),M=Math.sin(A),j=R*y+L*M,U=z*y+G*M,L=L*y-R*M,G=G*y-z*M,R=j,z=U),m&&Math.abs(m)+Math.abs(_)>359.9&&(m=_=0,p=180-p),h=Nt(Math.sqrt(R*R+L*L+k*k)),g=Nt(Math.sqrt(G*G+Pe*Pe)),A=ra(z,G),E=Math.abs(A)>2e-4?A*Gs:0,x=He?1/(He<0?-He:He):0),i.svg&&(j=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!ib(zn(e,wt)),j&&e.setAttribute("transform",j))),Math.abs(E)>90&&Math.abs(E)<270&&(s?(h*=-1,E+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,E+=E<=0?180:-180)),t=t||i.uncache,i.x=u-((i.xPercent=u&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+o,i.y=d-((i.yPercent=d&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-d)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+o,i.z=f+o,i.scaleX=Nt(h),i.scaleY=Nt(g),i.rotation=Nt(_)+a,i.rotationX=Nt(m)+a,i.rotationY=Nt(p)+a,i.skewX=E+a,i.skewY=S+a,i.transformPerspective=x+o,(i.zOrigin=parseFloat(l.split(" ")[2])||!t&&i.zOrigin||0)&&(r[wn]=Nf(l)),i.xOffset=i.yOffset=0,i.force3D=Sn.force3D,i.renderTransform=i.svg?wO:QE?rb:SO,i.uncache=0,i},Nf=function(e){return(e=e.split(" "))[0]+" "+e[1]},__=function(e,t,i){var r=Yt(t);return Nt(parseFloat(t)+parseFloat(Zr(e,"x",i+"px",r)))+r},SO=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,rb(e,t)},Hs="0deg",Wc="0px",zs=") ",rb=function(e,t){var i=t||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,c=i.z,l=i.rotation,u=i.rotationY,d=i.rotationX,f=i.skewX,h=i.skewY,g=i.scaleX,_=i.scaleY,m=i.transformPerspective,p=i.force3D,E=i.target,S=i.zOrigin,x="",w=p==="auto"&&e&&e!==1||p===!0;if(S&&(d!==Hs||u!==Hs)){var I=parseFloat(u)*oa,T=Math.sin(I),A=Math.cos(I),y;I=parseFloat(d)*oa,y=Math.cos(I),o=__(E,o,T*y*-S),a=__(E,a,-Math.sin(I)*-S),c=__(E,c,A*y*-S+S)}m!==Wc&&(x+="perspective("+m+zs),(r||s)&&(x+="translate("+r+"%, "+s+"%) "),(w||o!==Wc||a!==Wc||c!==Wc)&&(x+=c!==Wc||w?"translate3d("+o+", "+a+", "+c+") ":"translate("+o+", "+a+zs),l!==Hs&&(x+="rotate("+l+zs),u!==Hs&&(x+="rotateY("+u+zs),d!==Hs&&(x+="rotateX("+d+zs),(f!==Hs||h!==Hs)&&(x+="skew("+f+", "+h+zs),(g!==1||_!==1)&&(x+="scale("+g+", "+_+zs),E.style[wt]=x||"translate(0, 0)"},wO=function(e,t){var i=t||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,c=i.rotation,l=i.skewX,u=i.skewY,d=i.scaleX,f=i.scaleY,h=i.target,g=i.xOrigin,_=i.yOrigin,m=i.xOffset,p=i.yOffset,E=i.forceCSS,S=parseFloat(o),x=parseFloat(a),w,I,T,A,y;c=parseFloat(c),l=parseFloat(l),u=parseFloat(u),u&&(u=parseFloat(u),l+=u,c+=u),c||l?(c*=oa,l*=oa,w=Math.cos(c)*d,I=Math.sin(c)*d,T=Math.sin(c-l)*-f,A=Math.cos(c-l)*f,l&&(u*=oa,y=Math.tan(l-u),y=Math.sqrt(1+y*y),T*=y,A*=y,u&&(y=Math.tan(u),y=Math.sqrt(1+y*y),w*=y,I*=y)),w=Nt(w),I=Nt(I),T=Nt(T),A=Nt(A)):(w=d,A=f,I=T=0),(S&&!~(o+"").indexOf("px")||x&&!~(a+"").indexOf("px"))&&(S=Zr(h,"x",o,"px"),x=Zr(h,"y",a,"px")),(g||_||m||p)&&(S=Nt(S+g-(g*w+_*T)+m),x=Nt(x+_-(g*I+_*A)+p)),(r||s)&&(y=h.getBBox(),S=Nt(S+r/100*y.width),x=Nt(x+s/100*y.height)),y="matrix("+w+","+I+","+T+","+A+","+S+","+x+")",h.setAttribute("transform",y),E&&(h.style[wt]=y)},TO=function(e,t,i,r,s){var o=360,a=Ht(s),c=parseFloat(s)*(a&&~s.indexOf("rad")?Gs:1),l=c-r,u=r+l+"deg",d,f;return a&&(d=s.split("_")[1],d==="short"&&(l%=o,l!==l%(o/2)&&(l+=l<0?o:-o)),d==="cw"&&l<0?l=(l+o*HE)%o-~~(l/o)*o:d==="ccw"&&l>0&&(l=(l-o*HE)%o-~~(l/o)*o)),e._pt=f=new dn(e._pt,t,i,r,l,cO),f.e=u,f.u="deg",e._props.push(i),f},XE=function(e,t){for(var i in t)e[i]=t[i];return e},CO=function(e,t,i){var r=XE({},i._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=i.style,a,c,l,u,d,f,h,g;r.svg?(l=i.getAttribute("transform"),i.setAttribute("transform",""),o[wt]=t,a=$c(i,1),Yr(i,wt),i.setAttribute("transform",l)):(l=getComputedStyle(i)[wt],o[wt]=t,a=$c(i,1),o[wt]=l);for(c in mr)l=r[c],u=a[c],l!==u&&s.indexOf(c)<0&&(h=Yt(l),g=Yt(u),d=h!==g?Zr(i,c,l,g):parseFloat(l),f=parseFloat(u),e._pt=new dn(e._pt,a,c,d,f-d,v_),e._pt.u=g||0,e._props.push(c));XE(a,r)};un("padding,margin,Width,Radius",function(n,e){var t="Top",i="Right",r="Bottom",s="Left",o=(e<3?[t,i,r,s]:[t+s,t+i,r+i,r+s]).map(function(a){return e<2?n+a:"border"+a+n});Rf[e>1?"border"+n:n]=function(a,c,l,u,d){var f,h;if(arguments.length<4)return f=o.map(function(g){return pr(a,g,l)}),h=f.join(" "),h.split(f[0]).length===5?f[0]:h;f=(u+"").split(" "),h={},o.forEach(function(g,_){return h[g]=f[_]=f[_]||f[(_-1)/2|0]}),a.init(c,h,d)}});var T_={name:"css",register:x_,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,r,s){var o=this._props,a=e.style,c=i.vars.startAt,l,u,d,f,h,g,_,m,p,E,S,x,w,I,T,A,y;E_||x_(),this.styles=this.styles||KE(e),A=this.styles.props,this.tween=i;for(_ in t)if(_!=="autoRound"&&(u=t[_],!(Mn[_]&&d_(_,t,i,r,e,s)))){if(h=typeof u,g=Rf[_],h==="function"&&(u=u.call(i,r,e,s),h=typeof u),h==="string"&&~u.indexOf("random(")&&(u=ia(u)),g)g(this,e,_,u,i)&&(T=1);else if(_.substr(0,2)==="--")l=(getComputedStyle(e).getPropertyValue(_)+"").trim(),u+="",fr.lastIndex=0,fr.test(l)||(m=Yt(l),p=Yt(u),p?m!==p&&(l=Zr(e,_,l,p)+p):m&&(u+=m)),this.add(a,"setProperty",l,u,r,s,0,0,_),o.push(_),A.push(_,0,a[_]);else if(h!=="undefined"){if(c&&_ in c?(l=typeof c[_]=="function"?c[_].call(i,r,e,s):c[_],Ht(l)&&~l.indexOf("random(")&&(l=ia(l)),Yt(l+"")||l==="auto"||(l+=Sn.units[_]||Yt(pr(e,_))||""),(l+"").charAt(1)==="="&&(l=pr(e,_))):l=pr(e,_),f=parseFloat(l),E=h==="string"&&u.charAt(1)==="="&&u.substr(0,2),E&&(u=u.substr(2)),d=parseFloat(u),_ in Vi&&(_==="autoAlpha"&&(f===1&&pr(e,"visibility")==="hidden"&&d&&(f=0),A.push("visibility",0,a.visibility),Xr(this,a,"visibility",f?"inherit":"hidden",d?"inherit":"hidden",!d)),_!=="scale"&&_!=="transform"&&(_=Vi[_],~_.indexOf(",")&&(_=_.split(",")[0]))),S=_ in mr,S){if(this.styles.save(_),y=u,h==="string"&&u.substring(0,6)==="var(--"){if(u=zn(e,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var M=e.style.perspective;e.style.perspective=u,u=zn(e,"perspective"),M?e.style.perspective=M:Yr(e,"perspective")}d=parseFloat(u)}if(x||(w=e._gsap,w.renderTransform&&!t.parseTransform||$c(e,t.parseTransform),I=t.smoothOrigin!==!1&&w.smooth,x=this._pt=new dn(this._pt,a,wt,0,1,w.renderTransform,w,0,-1),x.dep=1),_==="scale")this._pt=new dn(this._pt,w,"scaleY",w.scaleY,(E?Us(w.scaleY,E+d):d)-w.scaleY||0,v_),this._pt.u=0,o.push("scaleY",_),_+="X";else if(_==="transformOrigin"){A.push(wn,0,a[wn]),u=EO(u),w.svg?M_(e,u,0,I,0,this):(p=parseFloat(u.split(" ")[2])||0,p!==w.zOrigin&&Xr(this,w,"zOrigin",w.zOrigin,p),Xr(this,a,_,Nf(l),Nf(u)));continue}else if(_==="svgOrigin"){M_(e,u,1,I,0,this);continue}else if(_ in nb){TO(this,w,_,f,E?Us(f,E+u):u);continue}else if(_==="smoothOrigin"){Xr(this,w,"smooth",w.smooth,u);continue}else if(_==="force3D"){w[_]=u;continue}else if(_==="transform"){CO(this,u,e);continue}}else _ in a||(_=aa(_)||_);if(S||(d||d===0)&&(f||f===0)&&!aO.test(u)&&_ in a)m=(l+"").substr((f+"").length),d||(d=0),p=Yt(u)||(_ in Sn.units?Sn.units[_]:m),m!==p&&(f=Zr(e,_,l,p)),this._pt=new dn(this._pt,S?w:a,_,f,(E?Us(f,E+d):d)-f,!S&&(p==="px"||_==="zIndex")&&t.autoRound!==!1?dO:v_),this._pt.u=p||0,S&&y!==u?(this._pt.b=l,this._pt.e=y,this._pt.r=uO):m!==p&&p!=="%"&&(this._pt.b=l,this._pt.r=lO);else if(_ in a)MO.call(this,e,_,l,E?E+u:u);else if(_ in e)this.add(e,_,l||e[_],E?E+u:u,r,s);else if(_!=="parseTransform"){Tf(_,u);continue}S||(_ in a?A.push(_,0,a[_]):typeof e[_]=="function"?A.push(_,2,e[_]()):A.push(_,1,l||e[_])),o.push(_)}}T&&g_(this)},render:function(e,t){if(t.tween._time||!b_())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:pr,aliases:Vi,getSetter:function(e,t,i){var r=Vi[t];return r&&r.indexOf(",")<0&&(t=r),t in mr&&t!==wn&&(e._gsap.x||pr(e,"x"))?i&&VE===i?t==="scale"?mO:pO:(VE=i||{})&&(t==="scale"?gO:_O):e.style&&!wf(e.style[t])?fO:~t.indexOf("-")?hO:Df(e,t)},core:{_removeProperty:Yr,_getMatrix:w_}};sn.utils.checkPrefix=aa;sn.core.getStyleSaver=KE;(function(n,e,t,i){var r=un(n+","+e+","+t,function(s){mr[s]=1});un(e,function(s){Sn.units[s]="deg",nb[s]=1}),Vi[r[13]]=n+","+e,un(i,function(s){var o=s.split(":");Vi[o[1]]=r[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");un("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(n){Sn.units[n]="px"});sn.registerPlugin(T_);var gr=sn.registerPlugin(T_)||sn,Y8=gr.core.Tween;var IO=["veil"],AO=["surface"],DO=["edge"],sb=(()=>{class n{veilRef;surfaceRef;edgeRef;isPlaying=!1;play(t,i){if(this.isPlaying)return;this.isPlaying=!0;let r=this.veilRef.nativeElement,s=this.surfaceRef.nativeElement,o=this.edgeRef.nativeElement,a=t.getBoundingClientRect(),c=a.left+a.width/2,l=a.top+a.height/2,u=i==="dark"?"#07111f":"#f2f6fc",d=window.matchMedia("(prefers-reduced-motion: reduce)").matches,f={value:0},h=CSS.supports("mask-image","radial-gradient(circle, transparent, #000)")||CSS.supports("-webkit-mask-image","radial-gradient(circle, transparent, #000)");s.style.backgroundColor=u,r.classList.add("is-active"),this.applyMask(s,c,l,0),gr.set(o,{x:c,y:l,xPercent:-50,yPercent:-50,scale:.15,autoAlpha:d?0:.8});let g=()=>{r.classList.remove("is-active"),gr.set([s,o],{clearProps:"all"}),this.isPlaying=!1};if(d||!h){s.style.maskImage="none",s.style.webkitMaskImage="none",gr.set(s,{opacity:.5}),gr.to(s,{opacity:0,duration:d?.22:.55,ease:"power1.out",onComplete:g});return}let _=this.farthestCorner(c,l);gr.to(f,{value:1,duration:gr.utils.clamp(.68,1.05,_/1e3),ease:"power2.inOut",onUpdate:()=>{let m=(this.farthestCorner(c,l)+28)*f.value;this.applyMask(s,c,l,m),gr.set(o,{scale:Math.max(.15,m/54),autoAlpha:Math.max(0,.8*(1-f.value))})},onComplete:g})}farthestCorner(t,i){let r=window.innerWidth,s=window.innerHeight;return Math.max(Math.hypot(t,i),Math.hypot(r-t,i),Math.hypot(t,s-i),Math.hypot(r-t,s-i))}applyMask(t,i,r,s){let a=Math.max(0,s-18),c=s+18,l=`radial-gradient(circle at ${i}px ${r}px, transparent 0, transparent ${a}px, rgba(0,0,0,.48) ${s}px, #000 ${c}px)`;t.style.maskImage=l,t.style.webkitMaskImage=l}static \u0275fac=function(i){return new(i||n)};static \u0275cmp=Ua({type:n,selectors:[["vck-theme-switch-transition"]],viewQuery:function(i,r){if(i&1&&bo(IO,7)(AO,7)(DO,7),i&2){let s;Ji(s=Ki())&&(r.veilRef=s.first),Ji(s=Ki())&&(r.surfaceRef=s.first),Ji(s=Ki())&&(r.edgeRef=s.first)}},decls:6,vars:0,consts:[["veil",""],["surface",""],["edge",""],["aria-hidden","true",1,"theme-reveal"],[1,"theme-reveal-surface"],[1,"theme-reveal-edge"]],template:function(i,r){i&1&&(za(0,"div",3,0),_u(2,"div",4,1)(4,"div",5,2),Ga())},styles:["[_nghost-%COMP%]{position:fixed;z-index:10000;inset:0;display:block;pointer-events:none}.theme-reveal[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:10000;visibility:hidden;opacity:0;overflow:hidden;pointer-events:none}.theme-reveal.is-active[_ngcontent-%COMP%]{visibility:visible;opacity:1}.theme-reveal-surface[_ngcontent-%COMP%]{position:absolute;inset:0;background:#07111f;opacity:.94;will-change:mask-image}.theme-reveal-edge[_ngcontent-%COMP%]{position:absolute;left:0;top:0;width:108px;height:108px;border:1px solid rgba(246,55,74,.92);border-radius:50%;background:radial-gradient(circle,rgba(39,133,223,.2),rgba(215,31,55,.12) 42%,transparent 72%);box-shadow:0 0 22px #2785df57,inset 0 0 20px #ef2a4033;will-change:transform,opacity}@media(prefers-reduced-motion:reduce){.theme-reveal-edge[_ngcontent-%COMP%]{display:none}}"]})}return n})();var RO=["portraitCanvas"],NO=["themeToggleButton"],PO=["themeTransition"],OO=(n,e)=>e.id,LO=(n,e)=>e.en;function FO(n,e){if(n&1&&(je(0,"li"),At(1),ft()),n&2){let t=e.$implicit,i=_n(4);Qe(),On(i.language()==="ta"?t.ta:t.en)}}function kO(n,e){if(n&1&&(je(0,"ul",40),pu(1,FO,2,1,"li",null,LO),ft()),n&2){let t=_n(2).$implicit;gu("id","nav-menu-"+t.id),Qe(),mu(t.items)}}function BO(n,e){if(n&1){let t=Wa();je(0,"button",39),Ci("click",function(){Er(t);let r=_n().$implicit,s=_n();return br(s.activateNavigation(r.id))}),je(1,"span"),At(2),ft()(),Va(3,kO,3,1,"ul",40)}if(n&2){let t=_n().$implicit,i=_n();cn("aria-expanded",i.openNavigation()===t.id)("aria-controls","nav-menu-"+t.id),Qe(2),On(i.language()==="ta"?t.ta:t.en),Qe(),Ha(i.openNavigation()===t.id?3:-1)}}function UO(n,e){if(n&1&&(je(0,"span",38),At(1),ft()),n&2){let t=_n().$implicit,i=_n();Qe(),On(i.language()==="ta"?t.ta:t.en)}}function VO(n,e){if(n&1){let t=Wa();je(0,"div",37),Ci("mouseenter",function(){let r=Er(t).$implicit,s=_n();return br(s.openNavigationMenu(r.id))})("mouseleave",function(){let r=Er(t).$implicit,s=_n();return br(s.closeNavigationMenu(r.id))})("focusin",function(){let r=Er(t).$implicit,s=_n();return br(s.openNavigationMenu(r.id))}),Va(1,BO,4,4)(2,UO,2,1,"span",38),ft()}if(n&2){let t=e.$implicit;Qe(),Ha(t.items.length?1:2)}}function HO(n,e){if(n&1&&(je(0,"div",28)(1,"span"),At(2,"\u0BB5\u0BBF\u0B9F\u0BC1\u0BA4\u0BB2\u0BC8"),ft(),je(3,"strong"),At(4,"\u0BA4\u0BCA\u0BB2\u0BCD."),gn(5,"br"),At(6,"\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BBE\u0BB5\u0BB3\u0BB5\u0BA9\u0BCD"),ft(),je(7,"small"),At(8),ft()()),n&2){let t=_n();cn("aria-label",t.language()==="ta"?"\u0B89\u0BB0\u0BC1\u0BB5\u0BAA\u0BCD\u0BAA\u0B9F\u0BAE\u0BCD \u0B95\u0BBF\u0B9F\u0BC8\u0B95\u0BCD\u0B95\u0BB5\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8. \u0BB5\u0BBF\u0B9A\u0BBF\u0B95 \u0BA4\u0BB2\u0BC8\u0BB5\u0BB0\u0BCD \u0BA4\u0BCB\u0BB4\u0BB0\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BBE\u0BB5\u0BB3\u0BB5\u0BA9\u0BCD.":"Portrait unavailable. Thol. Thirumavalavan, VCK President."),Qe(8),On(t.language()==="ta"?"\u0BA4\u0BCB\u0BB4\u0BB0\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BBE\u0BB5\u0BB3\u0BB5\u0BA9\u0BCD":"THOL. THIRUMAVALAVAN")}}var ob=(()=>{class n{canvasRef;themeToggleButtonRef;themeTransitionRef;slogans=[{ta:"\u0B85\u0B9F\u0B99\u0BCD\u0B95 \u0BAE\u0BB1\u0BC1, \u0B85\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAE\u0BC0\u0BB1\u0BC1, \u0BA4\u0BBF\u0BAE\u0BBF\u0BB1\u0BBF \u0B8E\u0BB4\u0BC1, \u0BA4\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF \u0B85\u0B9F\u0BBF",en:"Refuse to submit, transgress the limits, rise up in defiance, strike back."},{ta:"\u0BB5\u0BBF\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBE\u0BAF\u0BCD \u0B87\u0BB0\u0BC1! \u0BA8\u0BC6\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0BAF\u0BCD \u0B8E\u0BB4\u0BC1!",en:"Stay alert! Rise up like fire!"},{ta:"\u0BA4\u0BB2\u0BC8\u0BA8\u0BBF\u0BAE\u0BBF\u0BB0 \u0B9A\u0BC7\u0BB0\u0BBF \u0BA4\u0BBF\u0BB0\u0BB3\u0BC1\u0BAE\u0BCD\u2026 \u0B85\u0BA9\u0BCD\u0BB1\u0BC1 \u0BA4\u0BB2\u0BC8\u0B95\u0BC0\u0BB4\u0BBE\u0BAF\u0BCD \u0BA8\u0BBE\u0B9F\u0BC1 \u0BAA\u0BC1\u0BB0\u0BB3\u0BC1\u0BAE\u0BCD!",en:"When the marginalized settlements unite to hold their heads high, the country will turn upside down in revolution."},{ta:"\u0B9A\u0BBE\u0BA4\u0BBF\u0BAF\u0BA4\u0BCD\u0BA4\u0BC8 \u0BB5\u0BC7\u0BB0\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 \u0BA4\u0BAE\u0BBF\u0BB4\u0BCD \u0BA4\u0BC7\u0B9A\u0BBF\u0BAF\u0BA4\u0BCD\u0BA4\u0BC8 \u0BB5\u0BC6\u0BA9\u0BCD\u0BB1\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD",en:"Only by uprooting casteism can we win Tamil nationalism."},{ta:"\u0B85\u0BA4\u0BBF\u0B95\u0BBE\u0BB0\u0BAE\u0BCD \u0BB5\u0BC6\u0BB2\u0BCD\u0BB2\u0BC1\u0BB5\u0BCB\u0BAE\u0BCD! \u0B86\u0B9F\u0BCD\u0B9A\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0BAA\u0B99\u0BCD\u0B95\u0BC1 \u0BAA\u0BC6\u0BB1\u0BC1\u0BB5\u0BCB\u0BAE\u0BCD!",en:"We will win power! We will claim our share in governance!"},{ta:"\u0BA4\u0BC7\u0BB5\u0BC8\u0BAF\u0BC8 \u0B89\u0BA3\u0BB0\u0BBE\u0BAE\u0BB2\u0BCD \u0BAA\u0BCB\u0BB0\u0BBE\u0B9F \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BBE\u0BA4\u0BC1; \u0B95\u0BB3\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BAA\u0BCB\u0BB0\u0BBE\u0B9F\u0BA4\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BAE\u0BB2\u0BCD \u0BA8\u0BC0 \u0BB5\u0BBE\u0BB4 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BBE\u0BA4\u0BC1",en:"You cannot fight without realizing the need; you cannot live without knowing how to fight in the field."},{ta:"\u0BAA\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BCA\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B8E\u0BB2\u0BCD\u0BB2\u0BBE \u0B89\u0BAF\u0BBF\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD! \u0B9A\u0BBE\u0BA4\u0BBF\u0BAF\u0BB1\u0BCD\u0BB1 \u0B9A\u0BAE\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5 \u0B9A\u0BAE\u0BC1\u0BA4\u0BBE\u0BAF\u0BAE\u0BCD \u0BAA\u0B9F\u0BC8\u0BAA\u0BCD\u0BAA\u0BCB\u0BAE\u0BCD!",en:"All lives are equal by birth! Let us build a casteless, egalitarian society!"}];activeSlogan=Zn(Math.floor(Math.random()*this.slogans.length));language=Zn("en");formattedSlogan=fm(()=>this.slogans[this.activeSlogan()][this.language()].replace(/([!;])\s*/g,`$1
`));sloganMotion=Zn(!1);theme=Zn(this.readSavedTheme());openNavigation=Zn(null);mobileNavigationOpen=Zn(!1);navigation=[{id:"movement",ta:"\u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAE\u0BCD",en:"Movement",items:[{ta:"\u0B87\u0BAF\u0B95\u0BCD\u0B95 \u0BB5\u0BB0\u0BB2\u0BBE\u0BB1\u0BC1",en:"Movement history"},{ta:"\u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BC8\u0B95\u0BB3\u0BCD",en:"Policies"},{ta:"\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD \u0BAA\u0BBF\u0BB0\u0BA4\u0BBF\u0BA8\u0BBF\u0BA4\u0BBF\u0B95\u0BB3\u0BCD (\u0B8E\u0BAE\u0BCD.\u0BAA\u0BBF / \u0B8E\u0BAE\u0BCD.\u0B8E\u0BB2\u0BCD.\u0B8F)",en:"Elected representatives (MPs / MLAs)"}]},{id:"structure",ta:"\u0B87\u0BAF\u0B95\u0BCD\u0B95 \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1",en:"Organization structure",items:[{ta:"\u0BA4\u0BB2\u0BC8\u0BAE\u0BC8",en:"Leadership"},{ta:"\u0BAE\u0BBE\u0BA8\u0BBF\u0BB2\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BB2\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD",en:"State secretaries"},{ta:"\u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BB2\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD",en:"District secretaries"},{ta:"\u0BA4\u0BC1\u0BA3\u0BC8\u0BA8\u0BBF\u0BB2\u0BC8 \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD (\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0B85\u0BA3\u0BBF\u0B95\u0BB3\u0BC1\u0BAE\u0BCD)",en:"Wing coordinators (all wings)"}]},{id:"field",ta:"\u0B95\u0BB3\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B9A\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BCD",en:"In the field",items:[{ta:"\u0BA4\u0BC7\u0BB0\u0BCD\u0BA4\u0BB2\u0BCD\u0B95\u0BB3\u0BCD",en:"Elections"},{ta:"\u0BAE\u0BBE\u0BA8\u0BBE\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",en:"Conferences"},{ta:"\u0B9A\u0BBE\u0BA4\u0BA9\u0BC8\u0B95\u0BB3\u0BCD",en:"Achievements"}]},{id:"publications",ta:"\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC0\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",en:"Publications",items:[{ta:"\u0BA8\u0BAE\u0BA4\u0BC1 \u0BA4\u0BAE\u0BBF\u0BB4\u0BCD\u0BAE\u0BA3\u0BCD",en:"Our Tamil Land"},{ta:"\u0BAA\u0BC1\u0BA4\u0BCD\u0BA4\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BCD",en:"Books"},{ta:"\u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0B9F\u0BB2\u0BCD\u0B95\u0BB3\u0BCD",en:"Policy songs"},{ta:"\u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD",en:"Photos"}]},{id:"donate",ta:"\u0BA8\u0BA9\u0BCD\u0B95\u0BCA\u0B9F\u0BC8",en:"Donate Us",items:[]},{id:"contact",ta:"\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BC1\u0B95\u0BCD\u0B95\u0BC1",en:"Contact",items:[{ta:"\u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",en:"Address"},{ta:"\u0BA4\u0BCA\u0BB2\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF / \u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD",en:"Phone / email"},{ta:"\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BC1 \u0BAA\u0B9F\u0BBF\u0BB5\u0BAE\u0BCD",en:"Contact form"}]}];portraitReady=Zn(!1);portraitFailed=Zn(!1);portraitFormed=Zn(!1);portrait;sloganTimer;ngOnInit(){this.portrait=new hf(this.canvasRef.nativeElement,{onReady:()=>this.portraitReady.set(!0),onFallback:()=>this.portraitFailed.set(!0),onFormed:()=>this.portraitFormed.set(!0)}),this.sloganTimer=window.setInterval(()=>{this.activeSlogan.update(t=>{let i=Math.floor(Math.random()*(this.slogans.length-1));return i>=t?i+1:i}),this.animateSlogan()},4600)}toggleLanguage(){this.language.update(t=>t==="en"?"ta":"en"),this.animateSlogan()}animateSlogan(){this.sloganMotion.update(t=>!t)}toggleMobileNavigation(){this.mobileNavigationOpen.update(t=>!t),this.openNavigation.set(null)}activateNavigation(t){this.openNavigation.set(t)}openNavigationMenu(t){(window.matchMedia("(hover: hover)").matches||this.mobileNavigationOpen())&&this.openNavigation.set(t)}closeNavigationMenu(t){window.matchMedia("(hover: hover)").matches&&!this.mobileNavigationOpen()&&this.openNavigation()===t&&this.openNavigation.set(null)}closeNavigation(){this.openNavigation.set(null),this.mobileNavigationOpen.set(!1)}closeNavigationOnEscape(){this.openNavigation.set(null),this.mobileNavigationOpen.set(!1)}toggleTheme(){if(this.themeTransitionRef.isPlaying)return;let t=this.theme(),i=t==="dark"?"light":"dark";this.theme.set(i);try{localStorage.setItem("vck-theme",i)}catch{}this.themeTransitionRef.play(this.themeToggleButtonRef.nativeElement,t)}readSavedTheme(){try{return localStorage.getItem("vck-theme")==="light"?"light":"dark"}catch{return"dark"}}ngOnDestroy(){window.clearInterval(this.sloganTimer),this.portrait?.destroy()}static \u0275fac=function(i){return new(i||n)};static \u0275cmp=Ua({type:n,selectors:[["vck-root"]],viewQuery:function(i,r){if(i&1&&bo(RO,7)(NO,7)(PO,7),i&2){let s;Ji(s=Ki())&&(r.canvasRef=s.first),Ji(s=Ki())&&(r.themeToggleButtonRef=s.first),Ji(s=Ki())&&(r.themeTransitionRef=s.first)}},hostBindings:function(i,r){i&1&&Ci("click",function(){return r.closeNavigation()},su)("keydown.escape",function(){return r.closeNavigationOnEscape()},su)},decls:60,vars:46,consts:[["themeToggleButton",""],["portraitCanvas",""],["themeTransition",""],[1,"hero-shell"],[1,"topbar"],["type","button","aria-controls","main-navigation",1,"mobile-menu-toggle",3,"click"],["href","#home",1,"brand"],["src","assets/Logo/vck_logo.jpg","alt","",1,"brand-mark"],[1,"brand-copy"],[1,"top-actions"],["type","button",1,"language",3,"click"],["type","button",1,"theme-toggle",3,"click"],["aria-hidden","true"],["id","main-navigation",1,"site-nav",3,"click"],[1,"nav-group"],["id","home",1,"hero"],["src","portraits/thiruma.png?v=2","alt","","aria-hidden","true",1,"hero-artwork"],["aria-hidden","true",1,"crowd-strip"],["src","portraits/red-blue-rally.png","alt",""],[1,"story-canvas"],[1,"hero-copy"],[1,"eyebrow"],[1,"eyebrow-line"],["aria-live","polite","aria-atomic","true",1,"slogan"],[1,"slogan-text"],[1,"portrait-stage"],["aria-hidden","true",1,"portrait-halo"],["src","portraits/thiruma.png?v=2",1,"mobile-artwork"],["role","img",1,"portrait-alt"],[1,"portrait-caption"],[1,"caption-dot"],[1,"caption-role"],[1,"portrait-hint"],["aria-hidden","true",1,"vertical-note"],["id","story",1,"hero-footer"],[1,"footer-label"],[1,"scroll-cue"],[1,"nav-group",3,"mouseenter","mouseleave","focusin"],[1,"nav-toggle","nav-placeholder"],["type","button","aria-haspopup","true",1,"nav-toggle",3,"click"],[1,"nav-menu",3,"id"]],template:function(i,r){if(i&1){let s=Wa();je(0,"main",3)(1,"header",4)(2,"button",5),Ci("click",function(a){return Er(s),r.toggleMobileNavigation(),br(a.stopPropagation())}),gn(3,"span")(4,"span")(5,"span"),ft(),je(6,"a",6),gn(7,"img",7),je(8,"span",8)(9,"strong"),At(10,"VCK"),ft(),je(11,"small"),At(12,"VIDUTHALAI CHIRUTHAIGAL KATCHI"),ft()()(),je(13,"div",9)(14,"button",10),Ci("click",function(){return r.toggleLanguage()}),At(15),ft(),je(16,"button",11,0),Ci("click",function(){return r.toggleTheme()}),je(18,"span",12),At(19),ft()()()(),je(20,"nav",13),Ci("click",function(a){return a.stopPropagation()}),pu(21,VO,3,1,"div",14,OO),ft(),je(23,"section",15),gn(24,"img",16),je(25,"div",17),gn(26,"img",18),ft(),gn(27,"canvas",19,1),je(29,"div",20)(30,"p",21),gn(31,"span",22),At(32),ft(),je(33,"div",23)(34,"p",24),At(35),ft()()(),je(36,"div",25),gn(37,"div",26)(38,"img",27),Va(39,HO,9,2,"div",28),je(40,"div",29),gn(41,"span",30),je(42,"span"),At(43),ft(),je(44,"span",31),At(45),ft()(),je(46,"p",32),At(47),je(48,"span",12),At(49,"\u2733"),ft()()(),je(50,"div",33),At(51),ft()(),je(52,"footer",34)(53,"span",35),At(54),ft(),je(55,"span",36),gn(56,"span"),At(57),ft()()(),gn(58,"vck-theme-switch-transition",null,2)}i&2&&(ui("light-theme",r.theme()==="light"),cn("lang",r.language()),Qe(2),ui("menu-open",r.mobileNavigationOpen()),cn("aria-expanded",r.mobileNavigationOpen())("aria-label",r.language()==="ta"?r.mobileNavigationOpen()?"\u0BB5\u0BB4\u0BBF\u0B9A\u0BC6\u0BB2\u0BC1\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD \u0BAA\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BC8 \u0BAE\u0BC2\u0B9F\u0BB5\u0BC1\u0BAE\u0BCD":"\u0BB5\u0BB4\u0BBF\u0B9A\u0BC6\u0BB2\u0BC1\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD \u0BAA\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BC8\u0BA4\u0BCD \u0BA4\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD":r.mobileNavigationOpen()?"Close navigation menu":"Open navigation menu"),Qe(4),cn("aria-label",r.language()==="ta"?"\u0BB5\u0BBF\u0B9A\u0BBF\u0B95 \u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0BC1":"VCK home"),Qe(8),cn("aria-label",r.language()==="en"?"\u0BA4\u0BAE\u0BBF\u0BB4\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1":"Switch language to English")("aria-pressed",r.language()==="ta"),Qe(),Tr(" ",r.language()==="en"?"\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD":"EN"," "),Qe(),cn("aria-label",r.language()==="ta"?r.theme()==="dark"?"\u0B92\u0BB3\u0BBF \u0BA4\u0BCB\u0BB1\u0BCD\u0BB1\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1":"\u0B87\u0BB0\u0BC1\u0BB3\u0BCD \u0BA4\u0BCB\u0BB1\u0BCD\u0BB1\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1":r.theme()==="dark"?"Switch to light theme":"Switch to dark theme")("aria-pressed",r.theme()==="light"),Qe(3),On(r.theme()==="dark"?"\u263C":"\u263E"),Qe(),ui("mobile-open",r.mobileNavigationOpen()),cn("aria-label",r.language()==="ta"?"\u0BAE\u0BC1\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8 \u0BB5\u0BB4\u0BBF\u0B9A\u0BC6\u0BB2\u0BC1\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD":"Main navigation"),Qe(),mu(r.navigation),Qe(2),cn("aria-label",r.language()==="ta"?"\u0BB5\u0BBF\u0B9A\u0BBF\u0B95 \u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BA3\u0BBF\u0BAA\u0BCD \u0BAA\u0B95\u0BC1\u0BA4\u0BBF":"VCK hero"),Qe(),ui("artwork-visible",r.portraitFormed()),Qe(3),ui("canvas-formed",r.portraitFormed()),cn("aria-label",r.language()==="ta"?"\u0BA8\u0BC0\u0BB2 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BBF\u0BB5\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BA4\u0BCD \u0BA4\u0BC1\u0B95\u0BB3\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BB4\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1 \u0BA4\u0BCB\u0BB4\u0BB0\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BBE\u0BB5\u0BB3\u0BB5\u0BA9\u0BBF\u0BA9\u0BCD \u0B89\u0BB0\u0BC1\u0BB5\u0BAA\u0BCD\u0BAA\u0B9F\u0BA4\u0BCD\u0BA4\u0BC8 \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9.":"Blue and red crowd particles rise and form a portrait of Thol. Thirumavalavan."),Qe(5),Tr(" ",r.language()==="ta"?"\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BBF\u0BB2\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1 \u0B8E\u0BB4\u0BC1\u0BAE\u0BCD \u0BA4\u0BB2\u0BC8\u0BB5\u0BB0\u0BCD":"A LEADER RISES FROM THE PEOPLE"),Qe(2),ui("slogan-motion-a",r.sloganMotion())("slogan-motion-b",!r.sloganMotion()),cn("lang",r.language()),Qe(),On(r.formattedSlogan()),Qe(),ui("portrait-ready",r.portraitReady())("portrait-fallback",r.portraitFailed())("portrait-formed",r.portraitFormed()),Qe(2),ui("artwork-visible",r.portraitFormed()),cn("alt",r.language()==="ta"?"\u0BA4\u0BA8\u0BCD\u0BA4\u0BC8 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9F\u0BBE\u0B95\u0BCD\u0B9F\u0BB0\u0BCD \u0BAA\u0BBF. \u0B86\u0BB0\u0BCD. \u0B85\u0BAE\u0BCD\u0BAA\u0BC7\u0BA4\u0BCD\u0B95\u0BB0\u0BC1\u0B9F\u0BA9\u0BCD \u0BA4\u0BCB\u0BB4\u0BB0\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BBE\u0BB5\u0BB3\u0BB5\u0BA9\u0BCD":"Thol. Thirumavalavan with Periyar and Dr. B. R. Ambedkar"),Qe(),Ha(r.portraitFailed()?39:-1),Qe(4),On(r.language()==="ta"?"\u0BA4\u0BCA\u0BB2\u0BCD. \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BBE\u0BB5\u0BB3\u0BB5\u0BA9\u0BCD":"THOL. THIRUMAVALAVAN"),Qe(2),On(r.language()==="ta"?"\u0BA4\u0BB2\u0BC8\u0BB5\u0BB0\u0BCD, \u0BB5\u0BBF\u0B9A\u0BBF\u0B95":"PRESIDENT, VCK"),Qe(2),Tr("",r.language()==="ta"?"\u0BA4\u0BCA\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA8\u0B95\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD":"TOUCH TO MOVE"," "),Qe(4),On(r.language()==="ta"?"\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD \xB7 \u0BA8\u0BC0\u0BA4\u0BBF \xB7 \u0BB5\u0BBF\u0B9F\u0BC1\u0BA4\u0BB2\u0BC8":"PEOPLE \xB7 JUSTICE \xB7 LIBERATION"),Qe(3),On(r.language()==="ta"?"\u0BA8\u0BAE\u0BA4\u0BC1 \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAE\u0BCD, \u0BA8\u0BAE\u0BA4\u0BC1 \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0B95\u0BBE\u0BB2\u0BAE\u0BCD":"OUR MOVEMENT, OUR FUTURE"),Qe(3),Tr(" ",r.language()==="ta"?"\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u0B95\u0BC0\u0BB4\u0BC7 \u0BA8\u0B95\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD":"SCROLL TO EXPLORE"))},dependencies:[sb],styles:[`[_nghost-%COMP%]{display:block;min-height:100svh}.hero-shell[_ngcontent-%COMP%]{--%NS%page-surface:#101413;--%NS%page-foreground:#f4f2e9;--%NS%theme-accent:#d1a56c;color-scheme:dark;min-height:100svh;overflow:hidden;position:relative;isolation:isolate;display:flex;flex-direction:column;padding:0 clamp(24px,6.2vw,96px) max(22px,env(safe-area-inset-bottom));background:var(--%NS%page-surface);color:var(--%NS%page-foreground)}.hero-shell[_ngcontent-%COMP%]:before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(ellipse at 77% 49%,rgba(76,145,128,.14),transparent 39%),radial-gradient(ellipse at 83% 98%,rgba(169,88,51,.12),transparent 35%),var(--%NS%page-surface)}.hero-shell[_ngcontent-%COMP%]:after{content:"";position:absolute;inset:0;z-index:-1;opacity:.14;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.17'/%3E%3C/svg%3E")}.topbar[_ngcontent-%COMP%]{height:92px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(242,239,223,.12);flex-shrink:0}.brand[_ngcontent-%COMP%]{color:inherit;text-decoration:none;display:flex;gap:12px;align-items:center}.brand-mark[_ngcontent-%COMP%]{width:42px;height:42px;flex:0 0 42px;display:block;object-fit:cover;border:1px solid rgba(39,133,223,.75);border-radius:50%;background:#fff;position:relative}.brand-copy[_ngcontent-%COMP%]{display:grid;gap:3px}.brand-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font:600 17px/1 Montserrat,Noto Sans Tamil,sans-serif;letter-spacing:.12em}.brand-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font-size:8px;letter-spacing:.13em;color:#a5a79d}.top-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.language[_ngcontent-%COMP%], .theme-toggle[_ngcontent-%COMP%]{min-height:44px;border:1px solid rgba(242,239,223,.2);border-radius:2px;color:#dbd8ca;background:#ffffff06;font:500 11px/1 Montserrat,Noto Sans Tamil,sans-serif;letter-spacing:.08em;padding:0 14px;cursor:pointer;transition:background .2s,border-color .2s,color .2s}.language[_ngcontent-%COMP%]:hover, .theme-toggle[_ngcontent-%COMP%]:hover{background:#ffffff14;border-color:#d1a56ca6}.theme-toggle[_ngcontent-%COMP%]{width:44px;padding:0;font-size:20px;color:#d1a56c;overflow:hidden}.theme-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:grid;width:100%;height:100%;place-items:center;transform:rotate(0) scale(1);transition:transform .48s cubic-bezier(.2,.8,.2,1),color .25s ease}.theme-toggle[aria-pressed=true][_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{transform:rotate(180deg) scale(1.08)}.theme-toggle[_ngcontent-%COMP%]:active   span[_ngcontent-%COMP%]{transform:scale(.78)}.theme-toggle[_ngcontent-%COMP%]:focus-visible{outline:2px solid #d1a56c;outline-offset:3px}.hero[_ngcontent-%COMP%]{position:relative;flex:1;display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:0}.hero-copy[_ngcontent-%COMP%]{position:relative;top:clamp(-34px,-3vh,-20px);padding:2vh 0 2vh 5.5%;z-index:4;animation:_ngcontent-%COMP%_copy-in 1.1s cubic-bezier(.2,.7,.2,1) both}.eyebrow[_ngcontent-%COMP%]{margin:0 0 clamp(24px,4.5vh,54px);display:flex;align-items:center;gap:12px;font-size:clamp(14.56px,calc(14.56px + .15vw),18px);font-weight:700;line-height:1.35;letter-spacing:.14em;color:#c9a16d}.eyebrow-line[_ngcontent-%COMP%]{height:1px;width:35px;background:#c9a16d}h1[_ngcontent-%COMP%]{margin:0;font:700 clamp(48px,7.2vw,100px)/.99 "Montserrat","Noto Sans Tamil",sans-serif;letter-spacing:-.055em}h1[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#d1a56c;font-style:italic}.slogan[_ngcontent-%COMP%]{margin-top:clamp(20px,3.5vh,34px);min-height:clamp(128px,16vh,176px);display:flex;align-items:flex-start;gap:0;max-width:min(620px,100%)}.slogan[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;color:#f4f2e9;font:700 clamp(21px,2.35vw,32px)/1.42 "Montserrat","Noto Sans Tamil",sans-serif;letter-spacing:-.018em;text-wrap:pretty;white-space:pre-line;text-transform:uppercase}.slogan-motion-a[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slogan-enter-a .68s cubic-bezier(.16,1,.3,1) both}.slogan-motion-b[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slogan-enter-b .68s cubic-bezier(.16,1,.3,1) both}.slogan[_ngcontent-%COMP%]   p[lang=ta][_ngcontent-%COMP%]{font-family:Montserrat,Noto Sans Tamil,sans-serif;font-size:clamp(18px,2vw,27px);font-weight:600;line-height:1.72;letter-spacing:0}.hero-actions[_ngcontent-%COMP%]{margin-top:clamp(28px,5vh,55px);display:flex;flex-direction:column;align-items:flex-start;gap:19px}.primary-link[_ngcontent-%COMP%]{min-height:48px;display:inline-flex;align-items:center;gap:24px;color:#151712;background:#d1a56c;padding:0 20px;text-decoration:none;font:600 12px/1.5 Montserrat,Noto Sans Tamil,sans-serif;letter-spacing:.02em;transition:background .2s,transform .2s}.primary-link[_ngcontent-%COMP%]:hover{background:#e0be8e;transform:translateY(-2px)}.primary-link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:17px}.since[_ngcontent-%COMP%]{color:#92948b;font:500 10px/1.3 Montserrat,sans-serif;letter-spacing:.06em}.hero-artwork[_ngcontent-%COMP%]{position:absolute;z-index:0;top:0;right:-16%;width:100%;height:100%;object-fit:contain;object-position:right center;opacity:0;filter:brightness(.78);mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.12) 24%,rgba(0,0,0,.88) 48%,#000 62%);-webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.12) 24%,rgba(0,0,0,.88) 48%,#000 62%);transition:opacity 1.4s ease;pointer-events:none}.hero-artwork.artwork-visible[_ngcontent-%COMP%]{opacity:1}.mobile-artwork[_ngcontent-%COMP%]{display:none}.crowd-strip[_ngcontent-%COMP%]{position:absolute;z-index:1;left:calc(-1*clamp(24px,6.2vw,96px));right:calc(-1*clamp(24px,6.2vw,96px));bottom:0;height:clamp(180px,30vh,310px);opacity:.92;pointer-events:none;overflow:hidden;mask-image:linear-gradient(to bottom,transparent 0%,#000 24%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 24%)}.crowd-strip[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:center 78%;mix-blend-mode:screen}.story-canvas[_ngcontent-%COMP%]{position:absolute;z-index:2;inset:0;width:100%;height:100%;opacity:1;transition:opacity 1.4s ease;touch-action:pan-y}.story-canvas.canvas-formed[_ngcontent-%COMP%]{opacity:0}.portrait-stage[_ngcontent-%COMP%]{height:min(80vh,850px);min-height:430px;max-height:850px;position:relative;z-index:3;align-self:center;opacity:0;animation:_ngcontent-%COMP%_portrait-in 1.5s .18s ease forwards}.portrait-halo[_ngcontent-%COMP%]{position:absolute;width:74%;aspect-ratio:1;top:49%;left:51%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(137,167,142,.19),rgba(57,105,91,.08) 46%,transparent 70%);filter:blur(8px)}.portrait-stage[_ngcontent-%COMP%]:before{content:"";position:absolute;left:50%;top:49%;transform:translate(-50%,-50%);width:min(74%,430px);aspect-ratio:1;border:1px solid rgba(220,203,164,.12);border-radius:50%}.portrait-stage[_ngcontent-%COMP%]:after{content:"";position:absolute;left:50%;top:49%;transform:translate(-50%,-50%);width:min(64%,370px);aspect-ratio:1;border:1px solid rgba(220,203,164,.08);border-radius:50%}.portrait-caption[_ngcontent-%COMP%]{position:absolute;z-index:2;bottom:5%;left:50%;transform:translate(-50%);display:flex;align-items:center;gap:9px;width:max-content;color:#e4dfd2;font:500 9px/1 Montserrat,sans-serif;letter-spacing:.16em;white-space:nowrap}.caption-dot[_ngcontent-%COMP%]{width:5px;height:5px;border-radius:50%;background:#d1a56c;box-shadow:0 0 8px #d1a56c}.caption-role[_ngcontent-%COMP%]{margin-left:10px;padding-left:14px;border-left:1px solid rgba(228,223,210,.3);color:#a6a69a;font-size:8px}.portrait-hint[_ngcontent-%COMP%]{position:absolute;z-index:2;top:52%;right:2%;writing-mode:vertical-rl;color:#e2ddcc80;font:500 8px/1 Montserrat,sans-serif;letter-spacing:.16em}.portrait-hint[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin-top:8px;color:#d1a56c;font-size:12px}.portrait-formed[_ngcontent-%COMP%]:before, .portrait-formed[_ngcontent-%COMP%]:after, .portrait-formed[_ngcontent-%COMP%]   .portrait-halo[_ngcontent-%COMP%], .portrait-formed[_ngcontent-%COMP%]   .portrait-caption[_ngcontent-%COMP%], .portrait-formed[_ngcontent-%COMP%]   .portrait-hint[_ngcontent-%COMP%]{opacity:0;transition:opacity 1s ease}.portrait-alt[_ngcontent-%COMP%]{position:absolute;inset:8% 15% 15%;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;border-radius:50%;color:#e5dbc3;background:radial-gradient(ellipse,rgba(87,121,103,.38),transparent 68%);font-family:Montserrat,Noto Sans Tamil,sans-serif}.portrait-alt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#d1a56c;font-size:15px}.portrait-alt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:clamp(28px,4vw,48px);line-height:1.2;font-weight:600}.portrait-alt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font:500 8px Montserrat,Noto Sans Tamil,sans-serif;letter-spacing:.15em;color:#adad9e}.vertical-note[_ngcontent-%COMP%]{position:absolute;right:-3.6vw;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;color:#e6e1d057;font:500 8px/1 Montserrat,sans-serif;letter-spacing:.22em}.hero-footer[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;height:62px;border-top:1px solid rgba(242,239,223,.12);flex-shrink:0;color:#9a9b90;font:500 8px/1 Montserrat,Noto Sans Tamil,sans-serif;letter-spacing:.16em}.footer-label[_ngcontent-%COMP%]{justify-self:start}.scroll-cue[_ngcontent-%COMP%]{justify-self:center;display:flex;align-items:center;gap:10px}.scroll-cue[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:1px;height:23px;display:inline-block;background:linear-gradient(#d1a56c,transparent);animation:_ngcontent-%COMP%_scroll-pulse 1.6s ease-in-out infinite}@keyframes _ngcontent-%COMP%_copy-in{0%{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes _ngcontent-%COMP%_portrait-in{to{opacity:1}}@keyframes _ngcontent-%COMP%_slogan-enter-a{0%{opacity:0;transform:translateY(18px) scale(.985);filter:blur(6px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}@keyframes _ngcontent-%COMP%_slogan-enter-b{0%{opacity:0;transform:translateY(18px);filter:blur(6px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}@keyframes _ngcontent-%COMP%_scroll-pulse{50%{opacity:.4;transform:scaleY(.75);transform-origin:top}}@media(min-width:1500px){.hero-copy[_ngcontent-%COMP%]{padding-left:10%}.portrait-stage[_ngcontent-%COMP%]{height:min(76vh,790px)}}.hero-shell.light-theme[_ngcontent-%COMP%]{--%NS%page-surface:#f0eee5;--%NS%page-foreground:#24312d;--%NS%theme-accent:#916b32;color-scheme:light;color:var(--%NS%page-foreground);background:var(--%NS%page-surface)}.hero-shell.light-theme[_ngcontent-%COMP%]:before{background:radial-gradient(ellipse at 77% 49%,rgba(84,156,139,.16),transparent 39%),radial-gradient(ellipse at 83% 98%,rgba(183,94,65,.11),transparent 35%),var(--%NS%page-surface)}.hero-shell.light-theme[_ngcontent-%COMP%]:after{opacity:.055}.light-theme[_ngcontent-%COMP%]   .topbar[_ngcontent-%COMP%]{border-bottom-color:#23312c2e}.light-theme[_ngcontent-%COMP%]   .brand-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:#64736d}.light-theme[_ngcontent-%COMP%]   .language[_ngcontent-%COMP%], .light-theme[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]{color:#34443e;border-color:#23312c38;background:#ffffff47}.light-theme[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%], .light-theme[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%]{color:#916b32}.light-theme[_ngcontent-%COMP%]   .eyebrow-line[_ngcontent-%COMP%]{background:#916b32}.light-theme[_ngcontent-%COMP%]   .slogan[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#34443e}.light-theme[_ngcontent-%COMP%]   .since[_ngcontent-%COMP%]{color:#65726c}.light-theme[_ngcontent-%COMP%]   .hero-footer[_ngcontent-%COMP%]{color:#596760;border-top-color:#23312c2e}.light-theme[_ngcontent-%COMP%]   .caption-role[_ngcontent-%COMP%], .light-theme[_ngcontent-%COMP%]   .portrait-hint[_ngcontent-%COMP%]{color:#23312c9e}.light-theme[_ngcontent-%COMP%]   .hero-artwork[_ngcontent-%COMP%]{filter:brightness(.9)}@media(max-width:760px){.hero-shell[_ngcontent-%COMP%]{padding-inline:24px;min-height:100svh}.topbar[_ngcontent-%COMP%]{height:72px}.brand-mark[_ngcontent-%COMP%]{width:31px;height:31px}.brand-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:15px}.brand-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font-size:7px}.hero[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:stretch;justify-content:center;padding:2vh 0 0}.hero-copy[_ngcontent-%COMP%]{order:1;top:-18px;padding:0 0 0 2px;margin-top:3vh}.eyebrow[_ngcontent-%COMP%]{margin-bottom:16px;font-size:clamp(12.94px,calc(12.94px + .15vw),15px)}h1[_ngcontent-%COMP%]{font-size:clamp(42px,11.5vw,66px)}.slogan[_ngcontent-%COMP%]{margin-top:17px;min-height:128px;max-width:100%;gap:11px}.slogan[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:clamp(19px,5.1vw,24px);line-height:1.42}.slogan[_ngcontent-%COMP%]   p[lang=ta][_ngcontent-%COMP%]{font-size:clamp(17px,4.5vw,21px);line-height:1.7}.crowd-strip[_ngcontent-%COMP%]{z-index:4;left:-24px;right:-24px;height:clamp(190px,32svh,280px)}.hero-artwork[_ngcontent-%COMP%]{display:none}.story-canvas[_ngcontent-%COMP%]{left:-24px;right:-24px;width:calc(100% + 48px)}.mobile-artwork[_ngcontent-%COMP%]{display:block;position:absolute;z-index:1;left:50%;top:auto;bottom:0;width:100%;height:auto;transform:translate(-50%);object-fit:contain;object-position:center bottom;opacity:0;mask-image:linear-gradient(to bottom,#000 76%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,#000 76%,transparent 100%);transition:opacity 1.4s ease}.mobile-artwork.artwork-visible[_ngcontent-%COMP%]{opacity:1}.portrait-stage[_ngcontent-%COMP%]{order:2;width:calc(100% + 48px);height:clamp(350px,58svh,540px);min-height:350px;margin:1vh -24px 0}.portrait-stage[_ngcontent-%COMP%]:before{width:min(76%,340px)}.portrait-stage[_ngcontent-%COMP%]:after{width:min(65%,290px)}.portrait-caption[_ngcontent-%COMP%]{bottom:3%;font-size:8px}.portrait-hint[_ngcontent-%COMP%]{right:0;top:47%;font-size:7px}.vertical-note[_ngcontent-%COMP%]{display:none}.hero-footer[_ngcontent-%COMP%]{height:49px;font-size:7px;letter-spacing:.1em}.scroll-cue[_ngcontent-%COMP%]{gap:6px}.scroll-cue[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{height:18px}}@media(max-width:370px){.hero-shell[_ngcontent-%COMP%]{padding-inline:18px}.topbar[_ngcontent-%COMP%]{height:64px}.brand-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{letter-spacing:.08em}.hero-copy[_ngcontent-%COMP%]{margin-top:2vh}.eyebrow[_ngcontent-%COMP%]{margin-bottom:12px}.slogan[_ngcontent-%COMP%]{margin-top:13px}.story-canvas[_ngcontent-%COMP%]{left:-18px;right:-18px;width:calc(100% + 36px)}.portrait-stage[_ngcontent-%COMP%]{width:calc(100% + 36px);height:clamp(330px,56svh,500px);min-height:330px;margin-left:-18px;margin-right:-18px}.caption-role[_ngcontent-%COMP%]{display:none}.footer-label[_ngcontent-%COMP%]{max-width:80px;line-height:1.5}}@media(orientation:landscape)and (max-height:520px)and (max-width:900px){.hero-shell[_ngcontent-%COMP%]{min-height:520px}.topbar[_ngcontent-%COMP%]{height:60px}.hero[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;padding:0}.hero-copy[_ngcontent-%COMP%]{order:0;margin:0;padding-left:3%}.portrait-stage[_ngcontent-%COMP%]{order:0;height:400px;min-height:0;margin:0}.hero-footer[_ngcontent-%COMP%]{height:42px}}@media(prefers-reduced-motion:reduce){*[_ngcontent-%COMP%], *[_ngcontent-%COMP%]:before, *[_ngcontent-%COMP%]:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}.hero-shell[_ngcontent-%COMP%]{--%NS%page-surface:#07111f;--%NS%page-foreground:#f4f7fc;--%NS%theme-accent:#f02b3d;--%NS%theme-blue:#2785df}.hero-shell[_ngcontent-%COMP%]:before{background:radial-gradient(ellipse at 77% 43%,rgba(33,112,212,.24),transparent 42%),radial-gradient(ellipse at 20% 100%,rgba(215,31,55,.2),transparent 38%),var(--%NS%page-surface)}.hero-shell.light-theme[_ngcontent-%COMP%]{--%NS%page-surface:#f2f6fc;--%NS%page-foreground:#14243c;--%NS%theme-accent:#ce2038;--%NS%theme-blue:#176bb8;color-scheme:light}.hero-shell.light-theme[_ngcontent-%COMP%]:before{background:radial-gradient(ellipse at 77% 43%,rgba(54,133,207,.17),transparent 42%),radial-gradient(ellipse at 20% 100%,rgba(217,48,67,.12),transparent 38%),var(--%NS%page-surface)}.theme-toggle[_ngcontent-%COMP%]{color:#2785df}.language[_ngcontent-%COMP%]:hover, .theme-toggle[_ngcontent-%COMP%]:hover{border-color:#2785dfbf}.theme-toggle[_ngcontent-%COMP%]:focus-visible, .hero-shell[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus-visible{outline-color:#ed2a40}.hero-shell[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%]{color:var(--%NS%theme-accent)}.hero-shell[_ngcontent-%COMP%]   .eyebrow-line[_ngcontent-%COMP%]{background:linear-gradient(90deg,var(--%NS%theme-accent),var(--%NS%theme-blue))}.hero-shell[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%theme-accent)}.hero-shell[_ngcontent-%COMP%]   .primary-link[_ngcontent-%COMP%]{color:#fff;background:#176bb8}.hero-shell[_ngcontent-%COMP%]   .primary-link[_ngcontent-%COMP%]:hover{background:#d12640}.portrait-halo[_ngcontent-%COMP%]{background:radial-gradient(circle,rgba(39,133,223,.28),rgba(211,31,58,.12) 48%,transparent 72%)}.portrait-stage[_ngcontent-%COMP%]:before{border-color:#ec2f434d}.portrait-stage[_ngcontent-%COMP%]:after{border-color:#2785df45}.caption-dot[_ngcontent-%COMP%]{background:#f02b3d;box-shadow:0 0 9px #f02b3dcc}.portrait-hint[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#2785df}.portrait-alt[_ngcontent-%COMP%]{background:radial-gradient(ellipse,rgba(34,112,200,.3),rgba(207,32,56,.13) 46%,transparent 70%)}.hero-shell[_ngcontent-%COMP%]   .portrait-alt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%theme-accent)}.scroll-cue[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{background:linear-gradient(#ed2a40,#2785df,transparent)}.hero-shell.light-theme[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]{color:#176bb8}.hero-shell.light-theme[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%]{color:#c51c35}.hero-shell.light-theme[_ngcontent-%COMP%]   .eyebrow-line[_ngcontent-%COMP%]{background:linear-gradient(90deg,#ce2038,#176bb8)}.hero-shell.light-theme[_ngcontent-%COMP%]   .primary-link[_ngcontent-%COMP%]{background:#176bb8}.hero-shell.light-theme[_ngcontent-%COMP%]   .primary-link[_ngcontent-%COMP%]:hover{background:#c51c35}.hero-shell.light-theme[_ngcontent-%COMP%]   .portrait-caption[_ngcontent-%COMP%]{color:#172b47}.hero-shell.light-theme[_ngcontent-%COMP%]   .caption-role[_ngcontent-%COMP%]{color:#53657c}.site-nav[_ngcontent-%COMP%]{position:relative;z-index:8;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:clamp(8px,1.35vw,14px);padding:16px 0 10px;flex:0 0 auto}.nav-group[_ngcontent-%COMP%]{position:relative;min-width:0}.nav-toggle[_ngcontent-%COMP%]{width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(74,158,235,.6);border-radius:7px;color:#fff;background:linear-gradient(135deg,#15569a,#247fc6);box-shadow:0 3px 9px #0003;padding:8px 10px;text-align:center;font:600 clamp(10px,1.05vw,13px)/1.35 "Montserrat","Noto Sans Tamil",sans-serif;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,filter .2s ease}.nav-group[_ngcontent-%COMP%]:nth-child(2n)   .nav-toggle[_ngcontent-%COMP%]:not(.nav-placeholder){border-color:#f35e69b3;background:linear-gradient(135deg,#b71e36,#e33548)}.nav-toggle[_ngcontent-%COMP%]:hover:not(.nav-placeholder), .nav-toggle[aria-expanded=true][_ngcontent-%COMP%]{transform:translateY(-2px);filter:brightness(1.1);box-shadow:0 7px 17px #00000040}.nav-toggle[aria-expanded=true][_ngcontent-%COMP%]{outline:2px solid rgba(255,255,255,.72);outline-offset:2px}.nav-placeholder[_ngcontent-%COMP%]{cursor:default}.nav-chevron[_ngcontent-%COMP%]{font-size:15px;line-height:1;transition:transform .2s ease}.nav-toggle[aria-expanded=true][_ngcontent-%COMP%]   .nav-chevron[_ngcontent-%COMP%]{transform:rotate(180deg)}.nav-menu[_ngcontent-%COMP%]{position:absolute;z-index:20;top:calc(100% + 8px);left:0;display:grid;gap:7px;width:max(100%,210px);margin:0;padding:9px;list-style:none;border:1px solid rgba(39,133,223,.42);border-radius:8px;background:#09192b;box-shadow:0 14px 34px #00000061;animation:_ngcontent-%COMP%_nav-menu-in .18s ease-out both}.nav-group[_ngcontent-%COMP%]:nth-child(n+4)   .nav-menu[_ngcontent-%COMP%]{right:0;left:auto}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{min-height:36px;display:flex;align-items:center;padding:8px 11px;border:1px solid rgba(64,129,192,.24);border-radius:5px;color:#edf3fc;background:linear-gradient(100deg,#1d66a933,#bf23381a);font-size:11px;line-height:1.45}.hero-shell.light-theme[_ngcontent-%COMP%]   .nav-menu[_ngcontent-%COMP%]{border-color:#176bb84d;background:#fff;box-shadow:0 14px 34px #192f4c2e}.hero-shell.light-theme[_ngcontent-%COMP%]   .nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{color:#172b47;border-color:#176bb829;background:linear-gradient(100deg,#2785df1a,#cf203812)}@keyframes _ngcontent-%COMP%_nav-menu-in{0%{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}@media(max-width:1050px){.site-nav[_ngcontent-%COMP%]{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.nav-group[_ngcontent-%COMP%]:nth-child(n)   .nav-menu[_ngcontent-%COMP%]{right:auto;left:0}.nav-group[_ngcontent-%COMP%]:nth-child(3n)   .nav-menu[_ngcontent-%COMP%]{right:0;left:auto}}@media(max-width:760px){.site-nav[_ngcontent-%COMP%]{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:12px 0 8px}.nav-toggle[_ngcontent-%COMP%]{min-height:44px;font-size:11px}.nav-group[_ngcontent-%COMP%]:nth-child(n)   .nav-menu[_ngcontent-%COMP%]{right:auto;left:0;width:min(300px,calc(100vw - 48px))}.nav-group[_ngcontent-%COMP%]:nth-child(2n)   .nav-menu[_ngcontent-%COMP%]{right:0;left:auto}}@media(max-width:370px){.nav-menu[_ngcontent-%COMP%]{width:min(280px,calc(100vw - 36px))!important}.nav-toggle[_ngcontent-%COMP%]{gap:5px;padding-inline:6px;font-size:10px}}.site-nav[_ngcontent-%COMP%]{position:absolute;top:23px;right:calc(clamp(24px,6.2vw,96px) + 104px);z-index:10;display:flex;align-items:center;justify-content:flex-end;gap:clamp(4px,.55vw,8px);width:min(820px,calc(100% - 460px));padding:0}.nav-group[_ngcontent-%COMP%]{flex:1 1 0}.nav-toggle[_ngcontent-%COMP%]{min-height:44px;padding:7px 8px;font-size:clamp(9px,.9vw,12px)}.nav-toggle[_ngcontent-%COMP%]{height:54px;min-height:54px;padding:6px 9px}.nav-toggle[_ngcontent-%COMP%] > span[_ngcontent-%COMP%]:first-child{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-align:center;line-height:1.2}.nav-menu[_ngcontent-%COMP%]{width:max(100%,205px)}.mobile-menu-toggle[_ngcontent-%COMP%]{display:none}@media(max-width:1050px){.mobile-menu-toggle[_ngcontent-%COMP%]{width:40px;height:40px;flex:0 0 40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:1px solid rgba(39,133,223,.6);border-radius:6px;color:#fff;background:#17518b61;cursor:pointer}.mobile-menu-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:17px;height:2px;border-radius:2px;background:linear-gradient(90deg,#ed2a40,#2785df);transition:transform .2s ease,opacity .2s ease}.mobile-menu-toggle.menu-open[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{transform:translateY(7px) rotate(45deg)}.mobile-menu-toggle.menu-open[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2){opacity:0}.mobile-menu-toggle.menu-open[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child{transform:translateY(-7px) rotate(-45deg)}.topbar[_ngcontent-%COMP%]{gap:12px}.brand[_ngcontent-%COMP%]{margin-right:auto}.site-nav[_ngcontent-%COMP%]{top:80px;right:clamp(18px,4vw,40px);left:clamp(18px,4vw,40px);display:none;width:auto;max-height:calc(100svh - 100px);overflow-y:auto;padding:12px;border:1px solid rgba(39,133,223,.38);border-radius:10px;background:#09192bf5;box-shadow:0 18px 40px #0000006b}.hero-shell.light-theme[_ngcontent-%COMP%]   .site-nav[_ngcontent-%COMP%]{background:#f7f9fd;box-shadow:0 18px 40px #192f4c33}.site-nav.mobile-open[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr;gap:8px}.nav-group[_ngcontent-%COMP%]{width:100%}.nav-toggle[_ngcontent-%COMP%]{justify-content:space-between;min-height:44px;padding:9px 12px;font-size:12px;text-align:left}.nav-group[_ngcontent-%COMP%]:nth-child(n)   .nav-menu[_ngcontent-%COMP%]{position:static;width:100%;margin-top:7px;padding:7px;box-shadow:none}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{min-height:38px}}@media(max-width:760px){.topbar[_ngcontent-%COMP%]{height:72px;gap:9px}.mobile-menu-toggle[_ngcontent-%COMP%]{width:38px;height:40px;flex-basis:38px}.brand[_ngcontent-%COMP%]{gap:8px}.brand-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{display:none}.brand-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:15px}.top-actions[_ngcontent-%COMP%]{gap:6px}.site-nav[_ngcontent-%COMP%]{top:80px;left:18px;right:18px}}@media(max-width:370px){.topbar[_ngcontent-%COMP%]{gap:7px}.language[_ngcontent-%COMP%]{padding:0 9px}.site-nav[_ngcontent-%COMP%]{left:14px;right:14px}}.hero-shell[_ngcontent-%COMP%]:before{background:radial-gradient(ellipse at 77% 43%,rgba(33,112,212,.24),transparent 42%),radial-gradient(ellipse at 20% 100%,rgba(215,31,55,.07),transparent 38%),var(--%NS%page-surface)}.hero-shell.light-theme[_ngcontent-%COMP%]:before{background:radial-gradient(ellipse at 77% 43%,rgba(54,133,207,.17),transparent 42%),radial-gradient(ellipse at 20% 100%,rgba(217,48,67,.045),transparent 38%),var(--%NS%page-surface)}.brand-mark[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{background:#2785df}.portrait-halo[_ngcontent-%COMP%]{background:radial-gradient(circle,rgba(39,133,223,.28),rgba(211,31,58,.045) 48%,transparent 72%)}.portrait-stage[_ngcontent-%COMP%]:before{border-color:#ec2f4329}.caption-dot[_ngcontent-%COMP%]{background:#2785df;box-shadow:0 0 8px #2785dfb3}.portrait-alt[_ngcontent-%COMP%]{background:radial-gradient(ellipse,rgba(34,112,200,.3),rgba(207,32,56,.045) 46%,transparent 70%)}.scroll-cue[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{background:linear-gradient(#2785df 65%,rgba(237,42,64,.48),transparent)}.site-nav[_ngcontent-%COMP%]{right:calc(clamp(24px,6.2vw,96px) + 132px);width:min(760px,calc(100% - 500px))}.top-actions[_ngcontent-%COMP%]{position:relative;z-index:11;flex:0 0 auto;margin-left:12px}.nav-group[_ngcontent-%COMP%]:nth-child(2n)   .nav-toggle[_ngcontent-%COMP%]:not(.nav-placeholder){border-color:#4a9eeb99;background:linear-gradient(135deg,#15569a,#247fc6)}.nav-toggle[aria-expanded=true][_ngcontent-%COMP%]{outline:1px solid rgba(237,42,64,.55);outline-offset:2px;box-shadow:inset 0 -2px #ed2a40cc,0 7px 17px #00000040}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{background:linear-gradient(100deg,#1d66a933,#bf233809)}.hero-shell.light-theme[_ngcontent-%COMP%]   .nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{background:linear-gradient(100deg,#2785df1a,#cf203806)}@media(max-width:1050px){.site-nav[_ngcontent-%COMP%]{right:clamp(18px,4vw,40px);width:auto}.top-actions[_ngcontent-%COMP%]{margin-left:auto}}@media(max-width:760px){.top-actions[_ngcontent-%COMP%]{margin-left:auto}}@media(max-width:760px){.brand-mark[_ngcontent-%COMP%]{width:38px;height:38px;flex-basis:38px}}`]})}return n})();bm(ob).catch(n=>console.error(n));
