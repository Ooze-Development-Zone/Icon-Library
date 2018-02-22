{
	/** VERSION **/
	let 	version;
	const 	versions={
			light:`0.2.63`,
			regular:`2.1.19`
		},
	/** METHODS **/
		$=i=>d.getElementById(i),
		Q=s=>d.querySelector(s),
		C=e=>d.createElement(e),
		N=e=>d.createElementNS(`http://www.w3.org/2000/svg`,e),
		T=t=>d.createTextNode(t),
	/** CONSTANTS **/
		d=document,
		h=d.documentElement,
		b=d.body,

	/** PAGE **/
		page={
			offline:navigator.onLine===false,
			url:new URL(location),
			size:(b.offsetWidth>1199)+(b.offsetWidth>1499),
			anchor:C`a`,
			header:$`header`,
			main:$`content`,
			message:$`message`,
			section:$`icons`,
			textarea:C`textarea`,
			init(){
				this.address=`${this.url.protocol}\/\/${this.url.host+this.url.pathname}`;
				this.params=this.url.searchParams;
				this.light=this.params.get`font`===`light`;
				this.font=this.light?`light`:`regular`;
				b.classList.add(this.light?`mdil`:`mdi`);
				version=versions[this.font];
				this.message.append(T``);
				try{
					this.storage=localStorage;
				}catch(e){
					page.alert`Favourites not available.`;
					for(let key in favourites)
						delete favourites[key];
					info.actions.favourite.remove();
					delete info.actions.favourite;
				}
				this.textarea.classList.add(`ln`,`pf`);
				categories.init();
				version=+version.replace(/\./g,``);
				contributors.init();
				this.storage&&favourites.init();
				icons.init();
				menu.init();
				setTimeout(_=>
					filter.init()
				,600);
				info.init();
				editor.init();
				this.options=this.section.querySelector`ul`,
				this.actions={
					link:this.options.firstElementChild,
					html:this.options.lastElementChild
				};
				this.actions.svg=this.actions.link.nextElementSibling;
				this.header.addEventListener(`click`,event=>{
					if(event.target.nodeName.toLowerCase()===`a`&&this.offline){
						page.alert`Could not connect.`;
						event.preventDefault();
					}
				},0);
				this.main.addEventListener(`click`,event=>{
					let 	target=event.target,
						parent=target.parentNode,
						current=this.main.querySelector`article.active`;
					switch(target){
						case this.actions.link:
							page.copy(filter.filtered&&filter.url?filter.url:`${page.address}?${page.light?`font=light&`:``}section=icons`,`Link`);
							this.options.blur();
							break;
						case this.actions.svg:
						case this.actions.html:
							let svg=target===this.actions.svg;
							page.download(`data:${svg?`text/svg+xml;utf8,`:`text/html;utf8,<link rel="import" href="../bower_components/iron-iconset-svg/iron-iconset-svg.html"><iron-iconset-svg name="mdi" size="24">`}<svg><defs>${filter.filtered?this.build():this.package||(this.package=this.build())}</defs></svg>${svg?``:`</iron-iconset-svg>`}`,`${filter.filtered?`mdi-custom`:`mdi`}.${svg?`svg`:`html`}`);
							this.options.blur();
							break;
						default:
							switch(target.nodeName.toLowerCase()){
								case`svg`:
									parent.nodeName.toLowerCase()===`header`&&!target.classList.contains`trigger`&&page.copy(`${page.address}?${page.light?`font=light&`:``}section=${parent.parentNode.id}`,`Link`);
									break;
								case`article`:
									if(current!==target){
										current&&current.classList.remove`active`;
										info.open(target.lastChild.nodeValue);
										target.classList.add`active`;
									}
									break;
							}
							break;
					}
				},0);
				setTimeout(_=>{
					let loader=$`load`;
					loader.classList.add(`oz`,`pen`);
					svgs.init();
					setTimeout(_=>
						loader.remove()
					,375);
				},600);
			},
			alert(message){
				clearTimeout(this.timer);
				this.message.firstChild.nodeValue=message;
				this.message.classList.remove`oz`;
				this.timer=setTimeout(_=>
					this.message.classList.add`oz`
				,5e3);
			},
			build:_=>Object.entries(icons.list).map(([key,icon],data)=>
				icon.articles.main&&!icon.articles.main.classList.contains`dn`&&(data=icon.data[page.font])?`<g id="${key}"><path d="${data}"/></g>`:``
			).join``,
			copy(string,message){
				editor.dialog.append(this.textarea);
				this.textarea.value=string;
				this.textarea.select();
				d.execCommand`cut`;
				this.textarea.remove();
				message&&this.alert(`${message} copied to clipboard.`);
			},
			download(data,name){
				this.anchor.href=data;
				this.anchor.download=name;
				this.anchor.click();
				URL.revokeObjectURL(this.anchor.href);
			}
		},
	/** SVGS **/
		svgs={
			path:N`path`,
			init(){
				this.nodes=d.querySelectorAll`svg[data-icons]`;
				this.nodes.forEach(svg=>{
					svg.setAttribute(`height`,24);
					svg.setAttribute(`viewBox`,`0 0 24 24`);
					svg.setAttribute(`width`,24);
					svg.dataset.icons.split`,`.forEach(path=>{
						svg.append(this.path=this.path.cloneNode(1));
						this.path.setAttribute(`d`,icons.list[path].data.regular);
					});
					svg.removeAttribute`data-icons`;
				});
			}
		},
	/** MENU **/
		menu={
			functions:{},
			show:0,
			categories:$`categories`,
			contributors:$`contributors`,
			highlight:$`highlight`,
			menu:$`menu`,
			nav:$`nav`,
			navicon:$`navicon`,
			sections:$`sections`,
			switch:C`p`,
			init(){
				this.switch.classList.add`cp`;
				this.switch.dataset.icon=page.light?`\uf335`:`\uf6e8`;
				this.switch.tabIndex=-1;
				this.switch.append(T(`View ${page.light?`Regular`:`Light`} Icons`));
				/*this.menu.prepend(this.switch);*/
				let section=page.params.get`section`;
				section&&(section=$(section))&&setTimeout(_=>
					this.goto(section)
				,600);
				this.nav.addEventListener(`click`,event=>{
					let target=event.target;
					target.blur();
					switch(target){
						case this.nav:
							page.size<2&&this.toggle();
							break;
						case this.navicon:
							this.toggle();
							break;
						case this.switch:
							location.href=page.light?`./`:`?font=light`;
							break;
						case this.highlight:
							b.classList.toggle`highlight`;
							page.size<2&&this.toggle();
							break;
						case filter.clearall:
							filter.clear();
							page.size<2&&this.toggle();
							break;
						case this.categories.previousElementSibling:
						case this.contributors.previousElementSibling:
							target.classList.toggle`open`;
							break;
						default:
							if(target.nodeName.toLowerCase()===`li`){
								let 	category=target.dataset.category,
									contributor=target.dataset.contributor;
								switch(target.parentNode){
									case this.sections:
										if(category=categories.list[category].section){
											this.goto(category);
											page.size<2&&this.toggle();
										}
										break;
									case this.categories:
										if(categories.list[category]){
											target.classList.toggle`active`;
											filter.categories[filter.categories.has(category)?`delete`:`add`](category);
											filter.apply();
										}
										break;
									case this.contributors:
										if(contributors.list[contributor]){
											target.classList.toggle`active`;
											filter.contributors[filter.contributors.has(contributor)?`delete`:`add`](contributor);
											filter.apply();
										}
										break;
								}
							}
							break;
					}
				},0);
				if(page.size===2)
					this.toggle();
				else 
					d.addEventListener(`touchstart`,event=>{
						this.width=this.menu.offsetWidth;
						this.clientx=event.touches[0].clientX;
						if(([page.main,b].includes(event.target)&&!this.show&&this.clientx<=50)||(this.show&&this.clientx>this.width)){
							this.touchstart();
							d.addEventListener(`touchmove`,this.functions.move=event=>{
								let clientx=event.touches[0].clientX-this.clientx;
								this.nav.style.background=`rgba(0,0,0,${Math.min((clientx+(this.show?285.185:0))/285.185*.54,.54)})`;
								this.menu.style.left=`${this.show?Math.min(Math.max(clientx,-this.width),0):Math.min(Math.max(clientx,0)-this.width,0)}px`;
								this.menu.style.boxShadow=`0 14px 28px rgba(0,0,0,${Math.min((clientx+(this.show?500:0))/500*.25,.25)}),0 10px 10px rgba(0,0,0,${Math.min((clientx+(this.show?545.545:0))/545.545*.22,.22)})`;
								event.stopPropagation();
							},0);
							d.addEventListener(`touchend`,this.functions.end=event=>
								this.touchend(this.show?this.clientx-event.changedTouches[0].clientX:event.changedTouches[0].clientX-this.clientx),0
							);
							event.stopPropagation();
						}
					},0);
			},
			goto(section){
				clearInterval(this.timer);
				let 	to=section.offsetTop-8-page.header.offsetHeight,
					top=h.scrollTop,
					step=(to-top)/10;
				this.timer=setInterval(_=>
					Math.round(top)===Math.round(to)?clearInterval(this.timer):h.scrollTop=(top+=step)
				,10);
			},
			toggle(){
				b.classList.toggle(`menu`,this.show=!this.show);
				page.size<2&&this.show?b.addEventListener(`keydown`,this.functions.close=event=>
					event.keyCode===27&&this.toggle()
				,0):b.removeEventListener(`keydown`,this.functions.close);
			},
			touchend(clientx){
				d.removeEventListener(`touchmove`,this.functions.move);
				d.removeEventListener(`touchend`,this.functions.end);
				this.nav.removeAttribute`style`;
				this.menu.removeAttribute`style`;
				clientx>=this.width/2&&this.toggle();
				b.classList.remove`dragging`;
			},
			touchstart(){
				b.classList.add`dragging`;
				this.nav.style.transition=this.menu.style.transition=`none`;
			}
		},
	/** FILTERS **/
		filter={
			clearall:menu.sections.lastElementChild,
			error:page.section.querySelector`p`,
			input:$`filter`,
			heading:page.section.querySelector`h2`,
			counter:C`span`,
			init(){
				this.button=this.input.nextElementSibling;
				this.heading.append(this.counter);
				this.counter.append(this.counter=T``);
				this.heading=this.heading.firstChild;
				if(this.categories=page.params.get`categories`){
					menu.categories.previousElementSibling.classList.add`open`;
					for(let key of this.categories=new Set(this.categories.split`,`))
						categories.list[key].item.classList.add`active`;
				}else this.categories=new Set();
				if(this.contributors=page.params.get`contributors`){
					menu.contributors.previousElementSibling.classList.add`open`;
					for(let key of this.contributors=new Set(this.contributors.split`,`))
						contributors.list[key].item.classList.add`active`;
				}else this.contributors=new Set();
				if(this.text=page.params.get`filter`)
					this.text=(this.input.value=this.text.toLowerCase()).replace(/\+/g,`%2b`);
				if(this.categories.size||this.contributors.size||this.text)
					filter.apply();
				else this.counter.nodeValue=` (${icons.total}/${icons.total})`;
				this.input.addEventListener(`input`,_=>{
					clearTimeout(this.timer);
					this.timer=setTimeout(_=>{
						this.text=this.input.value.toLowerCase().replace(/\+/g,`%2b`);
						this.apply();
					},50);
				},0);
				this.button.addEventListener(`click`,_=>{
					this.input.focus();
					if(this.text){
						this.text=this.input.value=``;
						this.apply();
					}
				},0);
			},
			apply(){
				h.scrollTop<page.section.offsetTop-page.header.offsetHeight&&menu.goto(page.section);
				page.section.classList.toggle(`filtered`,this.filtered=!!this.text||!!this.categories.size||!!this.contributors.size);
				this.heading.nodeValue=this.filtered?`Search Results`:`All Icons`;
				let 	words=this.text&&this.text.split(/[\s\-]/),
					matches=this.filtered?0:icons.total,
					article,check,icon,key;
				for(key in icons.list)
					if(icons.list.hasOwnProperty(key)){
						icon=icons.list[key];
						if(icon.articles.main){
							check=1;
							if(this.filtered){
								if(this.categories.size)
									check=icon.categories&&icon.categories.some(category=>
										this.categories.has(category)
									);
								if(this.contributors.size)
									check=check&&icon.contributor&&this.contributors.has(icon.contributor[page.font]);
								if(words)
									check=check&&words.every(word=>
										icon.keywords.some(item=>
											item.startsWith(word)
										)
									);
								matches+=check;
							}
							icon.articles.main.classList.toggle(`dn`,!check);
						}
					}
				this.counter.nodeValue=` (${matches}/${icons.total})`;
				this.error.classList.toggle(`dn`,!this.filtered||matches);
				this.clearall.classList.toggle(`clear`,this.filtered);
				if(this.filtered){
					this.url=`${page.address}?`;
					if(page.light)
						this.url+=`font=light&`;
					if(this.categories.size){
						this.url+=`categories=${[...this.categories].sort().join`,`}`;
						if(this.contributors.size||this.text)
							this.url+=`&`;
					}
					if(this.contributors.size){
						this.url+=`contributors=${[...this.contributors].sort().join`,`}`;
						if(this.text)
							this.url+=`&`;
					}
					if(this.text)
						this.url+=`filter=${encodeURIComponent(this.text)}`;
					if(h.scrollTop<page.section.offsetTop-page.header.offsetHeight)
						h.scrollTop=page.section.offsetTop-8-page.header.offsetHeight
				}
			},
			clear(){
				if(this.filtered){
					for(let key of this.categories)
						categories.list[key].item.classList.remove`active`;
					this.categories.clear();
					for(let key of this.contributors)
						contributors.list[key].item.classList.remove`active`;
					this.contributors.clear();
					this.text=this.input.value=``;
					this.apply();
				}
				menu.goto(page.section);
			}
		},
	/** FAVOURITES **/
		favourites={
			actions:{},
			reader:new FileReader(),
			menu:C`ul`,
			input:C`input`,
			item:C`li`,
			svg:N`svg`,
			title:N`title`,
			init(){
				this.menu.classList.add(`options`,`oh`,`pa`);
				this.svg.tabIndex=this.menu.tabIndex=-1;
				this.svg.classList.add(`trigger`,`cp`,`pa`);
				this.svg.dataset.icons=`dots-vertical`;
				this.title.append(T`Options`);
				this.svg.append(this.title);
				this.section=categories.list.favourites.section;
				this.section.firstElementChild.append(this.svg,this.menu);
				this.item.classList.add(`cp`,`fwm`,`pr`,`wsnw`);
				this.item.append(this.svg=this.svg.cloneNode(0),T``);
				this.svg.classList.remove(`trigger`,`cp`,`pa`);
				this.svg.classList.add(`dib`,`pen`,`vam`);
				this.svg.removeAttribute`tabindex`;
				this.additem(`svg`,`angular`,`SVG for Angular`);
				this.additem(`html`,`polymer`,`HTML for Polymer`);
				this.additem(`import`,`import`,`Import Favourites`);
				this.additem(`export`,`export`,`Export Favourites`);
				this.additem(`clear`,`delete`,`Clear Favourites`);
				this.input.accept=`.txt,text/plain`;
				this.input.classList.add(`ln`,`pa`);
				this.input.type=`file`;
				this.input.addEventListener(`change`,_=>{
					this.input.files[0].type===`text/plain`&&this.reader.readAsText(this.input.files[0]);
					this.input.remove();
				},0);
				this.reader.addEventListener(`load`,event=>
					this.load(event)
				,0);
				this.articles=this.section.getElementsByTagName`article`;
				this.menu.addEventListener(`click`,event=>{
					switch(event.target){
						case this.actions.svg:
						case this.actions.html:
							let svg=target===this.actions.svg;
							page.download(`data:${svg?`text/svg+xml;utf8,`:`text/html;utf8,<link rel="import" href="../bower_components/iron-iconset-svg/iron-iconset-svg.html"><iron-iconset-svg name="mdi" size="24">`}<svg><defs>${this.build()}</defs></svg>${svg?``:`</iron-iconset-svg>`}`,`mdi-favourites.${svg?`svg`:`html`}`);
							this.menu.blur();
							break;
						case this.actions.import:
							b.append(this.input);
							this.menu.blur();
							this.input.click();
							break;
						case this.actions.export:
							this.menu.blur();
							page.download(`data:text/plain;base64,${btoa(btoa(Object.keys(page.storage).filter(key=>key.startsWith`mdi-`).join`,`))}`,`mdi-favourites.txt`);
							break;
						case this.actions.clear:
							let icon;
							for(let key in page.storage)
								if(page.storage.hasOwnProperty(key))
									if(key.startsWith`mdi-`){
										page.storage.removeItem(key);
										if((icon=icons.list[key.substr(4)])&&icon.articles.favourite){
											icon.articles.favourite.remove();
											delete icon.articles.favourite;
										}
									}
							this.menu.blur();
							page.alert`Favourites cleared.`;
							break;
					}
				},0);
			},
			additem(key,icons,text){
				this.menu.append(this.actions[key]=this.item.cloneNode(1));
				this.actions[key].firstElementChild.dataset.icons=icons;
				this.actions[key].lastChild.nodeValue=text;
			},
			build:_=>Object.keys(page.storage).map((key,data)=>
				key.startsWith`mdi-`&&icons.list[key=key.substr(4)]&&(data=icons.list[key].data[page.font])?`<g id="${key}"><path d="${data}"/></g>`:``
			).join``,
			load(event){
				let msg=`complete`;
				try{
					atob(event.target.result).split`,`.forEach(item=>{
						let name=item.substr(4);
						this.icon=icons.list[name];
						if(this.icon){
							if(!this.icon.articles.favourite){
								page.storage.setItem(item,1);
								this.section.append(this.icon.articles.favourite=(this.icon.articles.main||this.icon.articles.retired).cloneNode(1));
								if(info.name===name){
									info.actions.favourite.classList.add`remove`;
									info.actions.favourite.firstChild.nodeValue=`Remove from Favourites`;
								}
							}
						}
					});
					this.articles.length>1&&this.sort();
				}catch(error){
					console.log(error);
					msg=`failed`;
				}
				page.alert(`Import ${msg}.`);
				this.input.value=``;
			},
			sort(){
				[...this.articles].sort((first,second)=>
					first.lastChild.nodeValue>second.lastChild.nodeValue?1:-1
				).forEach(article=>
					this.section.append(this.section.removeChild(article))
				);
			},
			toggle(name){
				this.icon=icons.list[name];
				info.actions.favourite.classList.toggle(`remove`,!this.icon.articles.favourite);
				info.actions.favourite.firstChild.nodeValue=`${this.icon.articles.favourite?`Add to`:`Remove from`} Favourites`;
				let msg=`added to`;
				if(this.icon.articles.favourite){
					page.storage.removeItem(`mdi-${name}`);
					this.icon.articles.favourite.remove();
					delete this.icon.articles.favourite;
					msg=`removed from`;
				}else{
					page.storage.setItem(`mdi-${name}`,1);
					this.section.append(this.icon.articles.favourite=(this.icon.articles.main||this.icon.articles.retired).cloneNode(1));
					this.icon.articles.favourite.classList.remove`active`;
					this.articles.length>1&&this.sort();
				}
				page.alert(`${name} ${msg} favourites.`);
			}
		},
	/** SIDEBAR **/
		info={
			actions:{
				favourite:Q`#actions>:first-child`,
				export:Q`#actions>:nth-child(2)`,
				data:Q`#actions>[data-confirm="Path data"]`,
				icon:Q`#actions>[data-confirm=Icon]`,
				codepoint:Q`#actions>[data-confirm="Code point"]`,
				entity:Q`#actions>[data-confirm=Entity]`,
				css:Q`#actions>[data-confirm=CSS]`,
				js:Q`#actions>[data-confirm=JavaScript]`,
				html:Q`#actions>[data-confirm=HTML]`,
				url:Q`#actions>[data-confirm=Link]`,
				link:Q`#actions>:last-child`
			},
			downloads:{},
			show:0,
			xml:new XMLSerializer(),
			aside:$`info`,
			figure:$`preview`,
			heading:$`name`,
			init(){
				page.size&&this.aside.classList.remove`oz`;
				page.size&&this.heading.firstElementChild.remove();
				this.heading.append(T``);
				this.figure.append(this.svg=N`svg`);
				this.svg.classList.add`pa`;
				this.svg.setAttribute(`height`,112);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,112);
				this.svg.append(this.path=N`path`);
				let icon=page.params.get`icon`;
				if(icon){
					if(icons.list[icon]){
						this.open(icon);
						Object.values(icons.list[icon].articles)[0].classList.add`active`;
					}
				}else if(page.size){
					this.open(icon=(page.params.get`edit`||Object.keys(icons.list)[0]));
					Object.values(icons.list[icon].articles)[0].classList.add`active`;
				}
				this.aside.addEventListener(`click`,event=>{
					let target=event.target;
					switch(target){
						case this.aside:
						case this.heading.firstElementChild:
							!page.size&&this.toggle();
							break;
						case this.actions.favourite:
							favourites.toggle(this.name);
							break;
						case this.actions.export:
							this.data?editor.open(this.name):page.alert`Not yet available.`;
							break;
						case this.actions.data:
							this.data?page.copy(target.dataset.copy,target.dataset.confirm):page.alert`Not yet available.`;
							break;
						case this.actions.link:
							this.retired?page.alert`No longer available.`:!page.offline?location.href=`https://materialdesignicons.com/icon/${this.name}${page.light?`/light`:``}`:page.alert`Could not connect.`;
							break;
						default:
							if(this.type=target.dataset.type)
								this.download();
							else if(target.parentNode===this.actions.link.parentNode)
								this.copy||target===this.actions.url?page.copy(target.dataset.copy,target.dataset.confirm):page.alert(`No${this.retired?` longer`:`t yet`} available.`);
							break;
					}
				},0);
			},
			download(){
				this.icon?
					this.data?
						this.downloads[this.type]?
							page.download(this.downloads[this.type],`${this.name}.${this.type}`)
						:page.alert`Unknown file type.`
					:page.alert`Download not available.`
				:page.alert`Unknown icon.`;
			},
			open(name){
				this.icon=icons.list[this.name=name];
				this.data=this.actions.data.dataset.copy=this.icon.data[page.font];
				let codepoint=this.actions.codepoint.dataset.copy=this.icon.codepoint;
				this.aside.classList.toggle(`nocopy`,!(this.copy=!!codepoint));
				this.aside.classList.toggle(`retired`,this.retired=!!this.icon.retired&&this.icon.retired!==`{soon}`);
				this.downloads={
					svg:`data:text/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="${this.data}"/></svg>`,
					xaml:`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="24" Height="24"><Path Data="${this.data}"/></Canvas>`,
					xml:`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="24dp" android:width="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#000" android:pathData="${this.data}"/></vector>`
				};
				if(page.storage){
					this.actions.favourite.classList.toggle(`remove`,!!this.icon.articles.favourite);
					this.actions.favourite.firstChild.nodeValue=`${this.icon.articles.favourite?`Add to`:`Remove from`} Favourites`;
				}
				if(codepoint){
					this.actions.icon.dataset.copy=String.fromCharCode(`0x${codepoint}`);
					this.actions.entity.dataset.copy=`&#x${codepoint};`;
					this.actions.css.dataset.copy=`\\${codepoint}`;
					this.actions.js.dataset.copy=`\\u${codepoint}`;
				}
				this.actions.html.dataset.copy=`<span class="${page.light?`mdil`:`mdi`}-${name}"></span>`;
				this.actions.url.dataset.copy=`${page.address}?`;
				if(page.light)
					this.actions.url.dataset.copy+=`font=light&`;
				this.actions.url.dataset.copy+=`icon=${name}`;
				if(page.size){
					this.heading.classList.add`oz`;
					this.svg.classList.add`oz`;
				}else this.toggle();
				setTimeout(_=>{
					this.heading.lastChild.nodeValue=this.name;
					this.path.setAttribute(`d`,this.data);
					if(page.size){
						this.heading.classList.remove`oz`;
						this.svg.classList.remove`oz`;
					}
				},page.size&&195);
			},
			toggle(){
				this.aside.classList.toggle(`oz`,!(this.show=!this.show));
				if(this.show)
					b.addEventListener(`keydown`,this.close=event=>{
						if(event.keyCode===27&&!editor.dialog.open){
							this.toggle();
							event.stopPropagation();
						}
					},0);
				else{
					let current=page.main.querySelector`article.active`;
					current&&current.classList.remove`active`;
					b.removeEventListener(`keydown`,this.close);
				}
			}
		},
	/** CATEGORIES **/
		categories={
			header:C`header`,
			heading:C`h2`,
			error:C`p`,
			item:C`li`,
			link:N`svg`,
			section:C`section`,
			svg:N`svg`,
			title:N`title`,
			init(){
				this.section.classList.add(`dg`,`pr`);
				this.header.classList.add`ps`;
				this.heading.classList.add(`oh`,`toe`,`wsnw`);
				this.heading.append(T``);
				this.link.classList.add(`cp`,`pa`);
				this.link.dataset.icons=`link`;
				this.title.append(T`Copy Link`);
				this.link.append(this.title);
				this.error.classList.add`fwm`;
				this.error.append(T`No icons available in this section.`);
				this.item.classList.add(`cp`,`oh`);
				this.item.tabIndex=-1;
				this.svg.classList.add(`dib`,`pen`,`vam`);
				this.item.append(this.svg,T``);
				!page.storage&&delete this.list.favourites;
				if(page.light){
					delete this.list.new;
					delete this.list.updated;
					delete this.list.soon;
					delete this.list.retired;
				}
				for(let key in this.list)
					this.list.hasOwnProperty(key)&&this.add(key);
			},
			add(key){
				let 	category=this.list[key],
					section=this.section.cloneNode(0),
					header=this.header.cloneNode(1),
					heading=this.heading.cloneNode(1),
					item=this.item.cloneNode(1),
					name=category.name.replace(`{v}`,version);
				if(category.section){
					section.id=key;
					heading.firstChild.nodeValue=name;
					header.append(heading);
					key!==`favourites`&&header.append(this.link.cloneNode(1));
					section.append(header);
					section.append(this.error.cloneNode(1));
					page.section.before(category.section=section);
				}else category.count=icons.array.filter(icon=>
					icon.categories&&icon.data[page.font]&&(!icon.retired||icon.retired==="{soon}")&&icon.categories.includes(key)
				).length;
				if(category.section||category.count){
					item.lastChild.nodeValue=name;
					if(category.count)
						item.lastChild.nodeValue+=` (${category.count})`;
					item.dataset.category=key;
					item.firstElementChild.dataset.icons=category.icon;
					category.section?filter.clearall.before(category.item=item):menu.categories.append(category.item=item);
				}else delete this.list[key];
			}
		},
	/** CONTRIBUTORS **/
		contributors={
			img:C`img`,
			item:C`li`,
			svg:N`svg`,
			init(){
				this.item.classList.add(`cp`,`oh`);
				this.item.tabIndex=-1;
				this.item.append(T``);
				this.img.classList.add(`pen`,`vam`);
				this.img.height=this.img.width=24;
				this.svg.classList.add(`dib`,`pen`,`vam`);
				this.svg.dataset.icons=`account`;
				for(let key in this.list)
					this.list.hasOwnProperty(key)&&this.add(key);
			},
			add(key){
				let 	contributor=this.list[key],
					image=contributor.image,
					img=this.img.cloneNode(1),
					item=this.item.cloneNode(1);
				contributor.count=icons.array.filter(icon=>
					icon.contributor&&icon.data[page.font]&&(!icon.retired||icon.retired==="{soon}")&&icon.contributor[page.font]===key
				).length;
				if(contributor.count){
					item.dataset.contributor=key;
					if(image){
						img.src=`data:image/png;base64,${image}`;
						item.prepend(img);
					}else item.prepend(this.svg.cloneNode(1));
					item.lastChild.nodeValue=`${contributor.name} (${contributor.count})`;
					menu.contributors.append(contributor.item=item);
				}else delete this.list[key];
			}
		},
	/** ICONS **/
		icons={
			article:C`article`,
			svg:N`svg`,
			total:0,
			init(){
				delete this.array;
				this.article.classList.add(`cp`,`oh`,`pr`,`tac`,`toe`,`wsnw`);
				this.article.append(T``);
				this.svg.classList.add(`db`,`pen`);
				this.svg.setAttribute(`height`,24);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,24);
				this.svg.append(N`path`);
				for(let key in this.list)
					this.list.hasOwnProperty(key)&&this.add(key);
			},
			add(key){
				let 	icon=this.list[key],
					article=this.article.cloneNode(1),
					svg=this.svg.cloneNode(1),
					keywords=new Set(key.split`-`),
					data,category;
				if(data=icon.data[page.font]){
					icon.aliases&&icon.aliases.forEach(alias=>
						alias.split`-`.forEach(word=>
							keywords.add(word)
						)
					);
					icon.keywords&&icon.keywords.forEach(word=>
						keywords.add(word)
					);
					icon.keywords=[...keywords].sort();
					svg.firstElementChild.setAttribute(`d`,data);
					article.prepend(svg);
					article.classList.toggle(`community`,icon.contributor.regular!=="google");
					article.lastChild.nodeValue=key;
					icon.articles={};
					(category=categories.list.favourites)&&page.storage[`mdi-${key}`]&&category.section.append(icon.articles.favourite=article.cloneNode(1));
					(category=categories.list.new)&&icon.added&&icon.added[page.font]===version&&category.section.append(icon.articles.new=article.cloneNode(1));
					(category=categories.list.updated)&&icon.updated&&icon.updated[page.font]===version&&category.section.append(icon.articles.updated=article.cloneNode(1));
					(category=categories.list.renamed)&&icon.renamed&&icon.renamed[page.font]===version&&category.section.append(icon.articles.renamed=article.cloneNode(1));
					(category=categories.list.removed)&&icon.retired===version&&category.section.append(icon.articles.removed=article.cloneNode(1));
					(category=categories.list.soon)&&icon.added&&icon.added[page.font]===`{next}`&&category.section.append(icon.articles.soon=article.cloneNode(1));
					(category=categories.list.retired)&&icon.retired&&category.section.append(icon.articles.retired=article.cloneNode(1));
					(!icon.retired||icon.retired==="{soon}")&&++this.total&&page.section.append(icon.articles.main=article);
				}else delete this.list[key];
			}
		},
	/** EDITOR **/
		editor={
			inputs:{
				fill:$`png-fill`,
				opacity:$`png-opacity`,
				padding:$`png-padding`,
				colour:$`png-colour`,
				alpha:$`png-alpha`,
				radius:$`png-radius`,
				format:$`png-format`,
				name:$`png-name`,
				size:$`png-size`
			},
			settings:{},
			xml:new XMLSerializer(),
			background:C`span`,
			canvas:C`canvas`,
			dialog:Q`dialog`,
			init(){
				this.menu=this.dialog.querySelector`ul`;
				if(page.storage){
					this.input=C`input`;
					this.reader=new FileReader();
					this.link=this.menu.firstElementChild;
					this.import=this.link.nextElementSibling;
					this.export=this.import.nextElementSibling;
					this.clear=this.export.nextElementSibling;
					this.input.accept=`.txt,text/plain`;
					this.input.classList.add(`ln`,`pa`);
					this.input.type=`file`;
					this.input.addEventListener(`change`,_=>{
						this.input.files[0].type===`text/plain`&&this.reader.readAsText(this.input.files[0]);
						this.input.remove();
					},0);
					this.reader.addEventListener(`load`,event=>{
						let msg=`complete`;
						try{
							atob(event.target.result).split`,`.forEach(entry=>{
								entry=entry.split`:`;
								let key=entry[0];
								this.inputs[key.substr(4)]&&page.storage.setItem(key,entry[1]);
							});
						}catch(error){
							console.log(error);
							msg=`failed`;
						}
						page.alert(`Import ${msg}.`);
						this.input.value=``;
						this.load();
					},0);
				}else this.menu.remove();
				this.context=this.canvas.getContext`2d`;
				this.save=this.dialog.lastElementChild;
				this.cancel=this.save.previousElementSibling;
				this.figure=this.dialog.querySelector`figure`;
				this.background.classList.add(`pa`,`pen`);
				this.figure.append(this.background,this.horizontal=this.background.cloneNode(1),this.vertical=this.background.cloneNode(1),this.svg=N`svg`);
				this.svg.classList.add`pa`;
				this.svg.setAttribute(`height`,24);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,24);
				this.svg.append(this.path=N`path`);
				this.dialog.addEventListener(`click`,event=>{
					let target=event.target;
					switch(target){
						case this.dialog:
							this.close(0);
							break;
						case this.link:
							let url=`${page.address}?`;
							if(page.light)
								url+=`font=light&`;
							url+=`edit=${this.name}`;
							for(let key in this.settings)
								if(this.settings.hasOwnProperty(key))
									url+=`&${key}=${this.settings[key]}`;
							page.copy(url,`Link`);
							break;
						case this.import:
							b.append(this.input);
							this.menu.blur();
							this.input.click();
							break;
						case this.export:
							this.menu.blur();
							page.download(`data:text/plain;base64,${btoa(btoa(Object.entries(page.storage).filter(entry=>entry[0].startsWith`png-`).map(item=>item.join`:`).join`,`))}`,`mdi-settings.txt`);
							break;
						case this.clear:
							for(let key in page.storage)
								page.storage.hasOwnProperty(key)&&key.startsWith`png-`&&page.storage.removeItem(key);
							this.menu.blur();
							this.load();
							this.inputs.name.value=this.name;
							page.alert`Settings cleared.`;
							break;
						case this.cancel:
							this.close(0);
							break;
						case this.save:
							(this.settings.format=this.inputs.format.value)!==`png`?this.downloadxml():this.downloadpng();
							break;
					}
				},0);
				this.dialog.addEventListener(`keydown`,event=>{
					if(this.dialog.open){
						if(event.keyCode===13)
							(this.settings.format=this.inputs.format.value)!==`png`?this.downloadxml():this.downloadpng();
						else if(event.keyCode===27){
							this.close(0);
							event.preventDefault();
							event.stopPropagation();
						}
					}
				},0);
				this.dialog.addEventListener(`input`,event=>{
					let 	target=event.target,
						value=target.value;
					if(target.validity.valid){
						switch(target){
							case this.inputs.size:
								this.svg.setAttribute(`height`,this.settings.size=parseInt(value));
								this.svg.setAttribute(`width`,this.settings.size);
								if(this.settings.padding>(this.inputs.padding.max=(256-this.settings.size)/2))
									this.settings.padding=this.inputs.padding.value=parseInt(this.inputs.padding.max);
								this.background.style.height=this.background.style.width=this.horizontal.style.height=this.vertical.style.width=`${this.dimensions=this.settings.size+2*this.settings.padding}px`;
								if(this.settings.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.settings.radius=this.inputs.radius.value=parseInt(this.inputs.radius.max)}px`;
								break;
							case this.inputs.fill:
								this.path.setAttribute(`fill`,`#${this.settings.fill=value.toLowerCase()}`);
								this.figure.classList.toggle(`light`,(this.luminance=this.test(this.convert(value)))>=128&&this.settings.alpha<31);
								break;
							case this.inputs.opacity:
								this.path.setAttribute(`fill-opacity`,(this.settings.opacity=parseInt(value))/100);
								break;
							case this.inputs.padding:
								this.background.style.height=this.background.style.width=this.horizontal.style.height=this.vertical.style.width=`${this.dimensions=this.settings.size+2*(this.settings.padding=parseInt(value))}px`;
								if(this.settings.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.settings.radius=this.inputs.radius.value=this.inputs.radius.max}px`;
								break;
							case this.inputs.colour:
								this.background.style.backgroundColor=`#${this.settings.colour=value}`;
								break;
							case this.inputs.alpha:
								this.background.style.opacity=(this.settings.alpha=parseInt(value))/100;
								this.figure.classList.toggle(`light`,this.luminance>=128&&value<31);
								break;
							case this.inputs.radius:
								this.background.style.borderRadius=`${this.settings.radius=parseInt(value)}px`;
								break;
						}
						page.storage&&target!==this.inputs.name&&page.storage.setItem(target.id,value);
					}
				},1);
				this.load();
				let name=page.params.get`edit`;
				name&&icons.list[name]&&this.open(name);
			},
			close(value){
				b.removeEventListener(`keydown`,this.fn);
				this.dialog.classList.add(`oz`,`pen`);
				this.timer=setTimeout(_=>this.dialog.close(value),225);
			},
			convert:hex=>[((hex=parseInt(hex.length===3?hex.replace(/./g,c=>c+c):hex,16))>>16)&255,(hex>>8)&255,hex&255],
			downloadpng(){
				this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
				this.canvas.height=this.canvas.width=this.dimensions;
				if(this.settings.alpha){
					this.context.fillStyle=`rgba(${this.convert(this.settings.colour)},${this.settings.alpha/100})`;
					this.context.beginPath();
					this.context.moveTo(this.settings.radius,0);
					this.context.arcTo(this.dimensions,0,this.dimensions,this.dimensions,this.settings.radius);
					this.context.arcTo(this.dimensions,this.dimensions,0,this.dimensions,this.settings.radius);
					this.context.arcTo(0,this.dimensions,0,0,this.settings.radius);
					this.context.arcTo(0,0,this.dimensions,0,this.settings.radius);
					this.context.closePath();
					this.context.fill();
				}
				let image=new Image();
				image.src=URL.createObjectURL(new Blob([this.xml.serializeToString(this.svg)],{type:`image/svg+xml;charset=utf-8`}));
				image.addEventListener(`load`,_=>{
					this.context.drawImage(image,this.settings.padding,this.settings.padding);
					URL.revokeObjectURL(image.src);
					this.canvas.toBlob(blob=>
						page.download(URL.createObjectURL(blob),`${this.inputs.name.value}.png`)
					);
				},0);
			},
			downloadxml(){
				let 	padding=this.settings.padding/this.settings.size*24,
					dimensions=24+2*padding,
					opacity=this.settings.opacity/100,
					alpha=this.settings.alpha/100,
					xml,data,arc,radius,iscircle;
				if(alpha){
					radius=this.settings.radius/this.dimensions*dimensions;
					iscircle=radius===dimensions/2;
					data=`M${radius},0`;
					!iscircle&&(data+=`H${dimensions-radius}`);
					radius&&(data+=`${arc=`A${radius},${radius} 0 0 1 `}${dimensions},${radius}`);
					!iscircle&&(data+=`V${dimensions-radius}`);
					radius&&(data+=`${arc}${dimensions-radius},${dimensions}`);
					!iscircle&&(data+=`H${radius}`);
					radius&&(data+=`${arc}0,${dimensions-radius}`);
					!iscircle&&(data+=`V${radius}`);
					radius&&(data+=`${arc+radius},0`);
					data+=`Z`;
				}
				switch(this.inputs.format.value){
					case`svg`:
						xml=`data:text/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="${this.dimensions}" viewBox="0 0 ${dimensions} ${dimensions}" width="${this.dimensions}" xmlns="http://www.w3.org/2000/svg">`;
						if(alpha){
							xml+=`<path fill="#${this.settings.colour}" `;
							if(alpha<1)
								xml+=`fill-opacity="${alpha}" `;
							xml+=`d="${data}"/>`;
						}
						xml+=`<path fill="#${this.settings.fill}" `;
						if(opacity<1)
							xml+=`fill-opacity="${opacity}" `;
						if(padding)
							xml+=`transform="translate(${padding},${padding})" `;
						xml+=`d="${this.data}"/></svg>`;
						break;
					case`xaml`:
						xml=`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="${this.dimensions}" Height="${this.dimensions}">`;
						if(alpha){
							xml+=`<Path Fill="#${this.settings.fill}" `;
							if(opacity<1)
								xml+=`Opacity="${opacity}" `;
							if(this.dimensions>dimensions)
								xml+=`ScaleX="${this.dimensions/dimensions}" ScaleY="${this.dimensions/dimensions}" `;
							xml+=`Data="${data}"/>`;
						}
						xml+=`<Path `;
						if(this.settings.size>24)
							xml+=`ScaleX="${this.settings.size/24}" ScaleY="${this.settings.size/24}" `;
						if(this.settings.padding)
							xml+=`TranslateX="${this.settings.padding}" TranslateY="${this.settings.padding}" `;
						xml+=`Data="${this.data}"/></Canvas>`;
						break;
					case`xml`:
						xml=`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="${this.dimensions}dp" android:width="${this.dimensions}dp" android:viewportWidth="24" android:viewportHeight="24">`;
						if(alpha){
							xml+=`<path android:fillColor="#${this.settings.colour}" `;
							if(alpha<1)
								xml+=`android:fillOpacity="${alpha}" `;
							xml+=`android:pathData="${data}"/>`;
						}
						xml+=`<path android:fillColor="#${this.settings.fill}" `;
						if(opacity<1)
							xml+=`android:fillOpacity="${opacity}" `;
						if(padding)
							xml+=`android:translateX="${padding}" android:translateY="${padding}" `;
						xml+=`android:pathData="${this.data}"/></vector>`;
						break;
				}
				page.download(xml,`${this.inputs.name.value}.${this.inputs.format.value}`);
			},
			load(){
				let event=new Event(`input`);
				for(let key in this.inputs)
					if(this.inputs.hasOwnProperty(key)&&key!=="name"){
						this.inputs[key].value=page.params.get(key)||page.storage&&page.storage[`png-${key}`]||this.inputs[key].getAttribute`value`||this.inputs[key].firstElementChild.getAttribute`value`;
						this.inputs[key].dispatchEvent(event);
					}
			},
			open(name){
				clearTimeout(this.timer);
				this.name=this.inputs.name.value=name;
				this.path.setAttribute(`d`,this.data=icons.list[name].data[page.font]);
				this.dialog.showModal();
				this.dialog.classList.remove(`oz`,`pen`);
				b.addEventListener(`keydown`,this.fn=event=>{
					if(event.keyCode===27){
						this.close(0);
						event.preventDefault();
						event.stopPropagation();
					}
				},0);
			},
			test:([r,g,b])=>(r*299+g*587+b*114)/1000
		};
	/** INITIATE **/
	(async _=>{
		categories.list=await(await fetch`json/categories.json`).json();
		contributors.list=await(await fetch`json/contributors.json`).json();
		icons.array=Object.values(icons.list=await(await fetch`json/icons.json`).json());
		page.init();
		await new Promise(resolve=>{
			let script=C`script`;
			script.async=1;
			script.src=`https://www.googletagmanager.com/gtag/js?id=UA-109147935-1`;
			b.append(script);
			script.addEventListener(`load`,resolve,0);
		});
		let 	date=new Date(),
			month=date.getMonth(),
			day=date.getDate();
		if(month===11&&day>12||month===0&&day<6)
			this.header.classList.add("snow");
		window.dataLayer=window.dataLayer||[];
		let gtag=function(){window.dataLayer.push(arguments);};
		gtag(`js`,new Date());
		gtag(`config`,`UA-109147935-1`);
	})();
}