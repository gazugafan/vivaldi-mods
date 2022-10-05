/*
 * Force Vivaldi color theme into email messages--overriding the email message's color theme.
 * (a Vivaldi Email Client mod)
 */
(function overrideMailMessageTheme() {
	
	let moddedWebviews = []; //an array of modded email message webviews. Used to go back and update them if the theme ever changes.
	
	
	/**
	 * Listens to loadcommit events to detect new email message webviews.
	 * Mods them when found.
	 */
	function detectEmailWebviews() {
		addEventListener('loadcommit', function(e){
			Object.values(e.path).forEach(el => {
				if (el instanceof HTMLElement && el.classList.contains('mail_body'))
				{
					modEmailWebview(e.target);
				}
			});
		});
	}
	
	
	/**
	 * Mods the specified webview and adds it to the moddedWebviews array.
	 */
	function modEmailWebview(webview) {
		
		//the first time this webview is modded, add the toggle button, mark it as modded, and add it to the moddedWebviews array...
		if (!webview.dataset.themeModded)
		{
			webview.dataset.themeModded = true;
			moddedWebviews.push(webview);
		
			var button = document.createElement("BUTTON");
			button.onclick = function() {
				webview.executeScript(
					{code: `
						if (document.documentElement.classList.contains('vivaldi-email-thememod-off')) {
							document.documentElement.classList.remove('vivaldi-email-thememod-off');
						} else {
							document.documentElement.classList.add('vivaldi-email-thememod-off');
						}`
					}
				);
			};
			button.className = 'FormButton';
			button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M8 256c0 136.966 111.033 248 248 248s248-111.034 248-248S392.966 8 256 8 8 119.033 8 256zm248 184V72c101.705 0 184 82.311 184 184 0 101.705-82.311 184-184 184z"></path></svg>';
			button.style.position = 'absolute';
			button.style.top = '5px';
			button.style.right = '20px';
			button.style.width = '35px';
			button.style.height = '35px';
			button.style.padding = '5px';
			button.style.lineHeight = '0';
			button.style.zIndex = 999;
			button.title = 'Toggle Theme Override';
			webview.parentElement.style.position = 'relative';
			webview.parentElement.appendChild(button);
		}
		
		//get current Vivaldi theme variables...
		let colorFg = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorFg');
		let colorFgIntense = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorFgIntense');
		let colorBg = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorBg');
		let colorBgDark = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorBgDark');
		let colorBgIntense = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorBgIntense');
		let colorBorder = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorBorder');
		let colorHighlightBg = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorHighlightBg');
		let colorHighlightBgDark = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorHighlightBgDark');
		let colorBorderIntense = getComputedStyle(document.querySelector("#browser")).getPropertyValue('--colorBorderIntense');
		let colorFgRGB = hexToRGB(colorFg);
		let colorBgRGB = hexToRGB(colorBg);
		let colorBgIntenseRGB = hexToRGB(colorBgIntense);
		
		//inject/update CSS overrides into the webview...
		webview.insertCSS({
			code: `
html:not(.vivaldi-email-thememod-off) img {
	filter: opacity(0.5);
}
html:not(.vivaldi-email-thememod-off) * {
	color: ${colorFg} !important;
	background-color: ${colorBgIntense} !important;
	border-color: ${colorBorder} !important;
}

html:not(.vivaldi-email-thememod-off) a, html:not(.vivaldi-email-thememod-off) a * {
	color: ${colorHighlightBg} !important;
}

html:not(.vivaldi-email-thememod-off) a:hover, html:not(.vivaldi-email-thememod-off) a:hover * {
	color: ${colorHighlightBgDark} !important;
}

/* The rest is a stupid amount of work to style the scrollbars, with arrows for buttons. Might not be appropriate on mac? */
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar { width:16px; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-track { background:${colorBgIntense}; background-clip:border-box; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-thumb { background:${colorBorder}; background-clip:padding-box; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-thumb:hover { background:${colorBorderIntense}; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-thumb:active { background:${colorFg}; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-corner { background:${colorBgIntense}; }

html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button {
	background-color:${colorBgIntense};
	display:flex;
	width:16px;
	height:16px;
	background-size:9px 9px;
	background-repeat:no-repeat;
	background-position:center 5.5px;
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:hover { background-color:${colorBgDark}; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:active { background-color:${colorFg}; }
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:vertical:increment {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorFgRGB.r}, ${colorFgRGB.g}, ${colorFgRGB.b})'><polygon points='0,0 100,0 50,50'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:vertical:decrement {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorFgRGB.r}, ${colorFgRGB.g}, ${colorFgRGB.b})'><polygon points='50,00 0,50 100,50'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:vertical:increment:active {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorBgIntenseRGB.r}, ${colorBgIntenseRGB.g}, ${colorBgIntenseRGB.b})'><polygon points='0,0 100,0 50,50'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:vertical:decrement:active {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorBgIntenseRGB.r}, ${colorBgIntenseRGB.g}, ${colorBgIntenseRGB.b})'><polygon points='50,00 0,50 100,50'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:horizontal {
	background-position:5.5px center;
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:horizontal:increment {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorFgRGB.r}, ${colorFgRGB.g}, ${colorFgRGB.b})'><polygon points='50,50 0,100 0,0'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:horizontal:decrement {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorFgRGB.r}, ${colorFgRGB.g}, ${colorFgRGB.b})'><polygon points='0,50 50,0 50,100'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:horizontal:increment:active {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorBgIntenseRGB.r}, ${colorBgIntenseRGB.g}, ${colorBgIntenseRGB.b})'><polygon points='50,50 0,100 0,0'/></svg>");
}
html:not(.vivaldi-email-thememod-off) ::-webkit-scrollbar-button:horizontal:decrement:active {
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(${colorBgIntenseRGB.r}, ${colorBgIntenseRGB.g}, ${colorBgIntenseRGB.b})'><polygon points='0,50 50,0 50,100'/></svg>");
}
			`,
			runAt: 'document_start'
		});
	}
	
	
    /**
     * When the theme changes, reload all modded webviews
     */
	function observeThemeChanges() {
		chrome.storage.onChanged.addListener(function(changes, area){
			if (area == 'local') {
				if (changes.hasOwnProperty('BROWSER_COLOR_FG') || changes.hasOwnProperty('BROWSER_COLOR_BG'))
				{
					moddedWebviews.forEach(function(webview) {
						webview.reload();
						modEmailWebview(webview);
					});
				}
			}
		});
	}
	
	/**
	 * Converts a hex color to rgb. Returns an object with r, g, and b properties
	 */
	function hexToRGB(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
	

    /**
     * Initialise the mod.
     */
    function initMod(){
        if(document.querySelector("#main")){
            observeThemeChanges();
            detectEmailWebviews();
        } else {
            setTimeout(initMod, 500);
        }
    }

    initMod();
})();
