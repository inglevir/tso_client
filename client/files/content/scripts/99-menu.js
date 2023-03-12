var Menu = function(type){
	this.groupedMenu = function() {
		return [
			{ label: loca.GetText("ACL", "BuffAdventuresGeneral"), mnemonicIndex: 0, items: [
				{ label: loca.GetText("LAB", "ToggleOptionsPanel"), mnemonicIndex: 0, onSelect: mainSettingsHandler },
				{ label: loca.GetText("LAB", "Filter"), mnemonicIndex: 0, items: [
						{ label: "none", onSelect: menuFilterHandler }, { label: "snownowater", onSelect: menuFilterHandler },
						{ label: "snowlight", onSelect: menuFilterHandler }, { label: "snow", onSelect: menuFilterHandler },
						{ label: "oven", onSelect: menuFilterHandler }, { label: "doomsday", onSelect: menuFilterHandler },
						{ label: "night", onSelect: menuFilterHandler }, { label: "desert", onSelect: menuFilterHandler },
						{ label: "tropical", onSelect: menuFilterHandler },	{ label: "blackandwhite", onSelect: menuFilterHandler },
						{ label: "spooky", onSelect: menuFilterHandler }, { label: "snow_medium", onSelect: menuFilterHandler },
						{ label: "tundra", onSelect: menuFilterHandler }, { label: "darkershadow", onSelect: menuFilterHandler },
						{ label: "magicsepia", onSelect: menuFilterHandler }
				]},
				{ label: loca.GetText("LAB", "Update") + ' (F2)', mnemonicIndex: 0, keyCode: 113, onSelect: menuZoneRefreshHandler},
				{ label: 'Debug window', onSelect: menuDebugHandler}
			]},
			{ label: loca.GetText("LAB", "Specialists"), mnemonicIndex: 0, items: [
				{ label: loca.GetText("SPE", "Explorer") + ' (F3)', mnemonicIndex: 0, keyCode: 114, onSelect: specExplorerMenuHandler },
				{ label: loca.GetText("SPE", "Geologist") + ' (F4)', mnemonicIndex: 0, keyCode: 115, onSelect: specGeologistMenuHandler },
				{ label: loca.GetText("LAB", "Army") + ' (F9)', mnemonicIndex: 0, keyCode: 120, onSelect: armyMenuHandler },
				{ label: loca.GetText("ACL", "ExcelsiorLostCityBeforeRitual") + ' (F10)', mnemonicIndex: 0, keyCode: 121, onSelect: battleMenuHandler },
				{ label: loca.GetText("LAB", 'ProductionDetails'), mnemonicIndex: 0, onSelect: specDutyMenuHandler },
				{ label: getText('specHideTitle'), mnemonicIndex: 0, onSelect: hideSpecMenuHandler }
			]},
			{ label: loca.GetText("LAB", "Buildings"), mnemonicIndex: 0, items: [
				{ label: loca.GetText("LAB", "Buffs") + ' (F5)', mnemonicIndex: 0, keyCode: 116, onSelect: menuBuffsHandler },
				{ label: loca.GetText("LAB", "Production") + ' (F7)', mnemonicIndex: 0, keyCode: 118, onSelect: menuBuildingHandler },
				{ label: getText('prod_timed') + ' (F8)', mnemonicIndex: 0, keyCode: 119, onSelect: TimedMenuHandler }
			]},
			{ label: loca.GetText("LAB", "BlackMarketAuction") + ' (F6)', mnemonicIndex: 0, keyCode: 117, onSelect: menuAuctionHandler },
			{ label: getText('shortcutsTitle'), name: 'Shortcuts', mnemonicIndex: 0 },
			{ label: loca.GetText("RES", "Tool"), name: 'Tools', mnemonicIndex: 0, items: [
				{label: loca.GetText("LAB", "Update"), onSelect: reloadScripts },
				{label: loca.GetText("LAB", "ToggleOptionsPanel"), onSelect: scriptsManager },
				{type: 'separator' }
			]}
		];
	};
	this.linearMenu = function(){
		var e=[],r=this.groupedMenu();for(var i in r)if(r[i].items&&"Tools"!=r[i].name&&"Shortcuts"!=r[i].name)for(var n in r[i].items)e.push(r[i].items[n]);else e.push(r[i]);return e;
	};
	this.type = type;
	this.nativeMenu = null;
	this.keybindings = {};
};
Menu.prototype = {
	show:function(){
		this.keybindings = {};
		var menu = this.type == 'grouped' ? this.groupedMenu() : this.linearMenu();
		if(isDebug) {
			menu.push({ label: "SaveHTML", onSelect: menuSaveHandler });
		}
		menu.push({type: 'separator' });
		menu.push({ label: loca.GetText("LAB", "ChatHelp"), name: 'Help', mnemonicIndex: 0, items: [
			{ label: "Wiki", onSelect: openWikiHandler }, { label: "Discord (RU)", onSelect: openDiscordHandler },
			{ label: "Discord (EN)", onSelect: openDiscordENHandler }, { label: "Discord (DE)", onSelect: openDiscordDEHandler },
			{ type: 'separator' }, { label: "Donate (Ko-fi)", onSelect: openDonateHandler },
			{ label: "Donate (Tinkoff RU)", onSelect: openDonateTfHandler }, { type: 'separator' },
			{ label: getText('feedbacktitle'), onSelect: feedbackMenuHandler }
		]});
		menu.push({ label: 'v' + version, enabled: false });
		menu.push({ label: '', name: 'memusage', enabled: false });
		air.ui.Menu.setAsMenu(air.ui.Menu.createFromJSON(menu), true);
		this.nativeMenu = window.nativeWindow.menu;
		this.buildKeybinds(menu);
	},
	buildKeybinds: function(menu){
		for(var i in menu) {
			if(menu[i].items) {
				this.buildKeybinds(menu[i].items);
				continue;
			}
			if(menu[i].keyCode)
				this.addKeybBind(menu[i].onSelect, menu[i].keyCode, false, false);
		}
	},
	addKeybBind: function(fn, key, ctrlKey, isUser, shiftKey, altKey) {
		var keyComb = '{0}.{1}.{2}.{3}'.format(key.toString(), (ctrlKey ? ctrlKey : false).toString(), (shiftKey ? shiftKey : false).toString(), (altKey ? altKey : false).toString());
		if (this.keybindings[keyComb]) {
			  game.showAlert("Key combination {0} for {1} already binded on {2}".format(keyComb, fn.name, this.keybindings[keyComb].fn.name));
			  return;
		}
		this.keybindings[keyComb] = { 'isUser': isUser, 'fn': fn };
	},
	checkKeybind: function(event) {
		var keyComb = '{0}.{1}.{2}.{3}'.format(event.keyCode.toString(), event.ctrlKey.toString(), event.shiftKey.toString(), event.altKey.toString());
		if(this.keybindings[keyComb])
			this.keybindings[keyComb].fn(null);
	},
	createItem: function(name, fn) {
		var item = new air.NativeMenuItem(name);
		item.mnemonicIndex = 0;
		item.addEventListener(air.Event.SELECT, fn);
		return item;
	},
	addToolsItem: function(name, fn, key, ctrl, shiftKey, altKey) {
		this.nativeMenu.getItemByName("Tools").submenu.addItem(this.createItem(name, fn));
		if(key) { this.addKeybBind(fn, key, ctrl, true, shiftKey, altKey); }
	},
	clearTools: function() {
		$('script[id="user"]').remove();
		var toolsMenu = this.nativeMenu.getItemByName("Tools").submenu;
		while(toolsMenu.numItems > 3) { toolsMenu.removeItemAt(3); }
		for(var i in this.keybindings) {
			this.keybindings[i].isUser&&delete this.keybindings[i];
		}
	}
};
menu = new Menu(mainSettings.menuStyle);
menu.show();
menu.addKeybBind(shortcutsPickupAll, 115, true, false);
setInterval(function() { menu.nativeMenu.getItemByName("memusage").label = 'Mem: ' + humanMemorySize(air.System.privateMemory, 1); }, 5000);
reloadScripts(null);
shortcutsMakeMenu();