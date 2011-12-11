/**************************************************
** NET GRAPH
**************************************************/

r.namespace("NetGraph");
rawkets.NetGraph = function(width, height) {
	// Shortcuts
	var e = r.Event;

	// Properties
	var width = width,
		height = height,
		maxPing = 200,
		maxData = 3000,
		pings = [],
		tmpData = [],
		data = [],
		packetsPerUpdate = 0,
		charsPerUpdate = 0; // This is actually characters per second, not bytes

	var init = function() {
		e.listen("SOCKET_MESSAGE", onSocketMessage);
		//e.listen("PING", onPing);
	};

	var onSocketMessage = function(msg) {
		addData(JSON.stringify(msg).length);
	};

	var onPing = function(msg) {
		//addPing(msg.p);
		//addData();
	};
	
	var addPing = function(ping) {
		if (pings.length == width) {
			pings.shift(); // Remove first ping
		};
		
		pings.push(ping);
	};
	
	var addData = function(value) {
		tmpData.push(value);
	};
	
	var updateData = function() {
		if (data.length == width) {
			data.shift(); // Remove first data
		};
		
		var d, tmpDataCount = tmpData.length, value = 0;
		for (d = 0; d < tmpDataCount; d++) {
			value += tmpData[d];
		};
		
		packetsPerUpdate = tmpData.length;
		charsPerUpdate = value;
		tmpData = [];
		
		data.push(value);
	};
	
	var draw = function(viewport) {
		var ctx = viewport.ctx;
	
		ctx.save();
		ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
		ctx.fillRect(0, 0, width, height);
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		ctx.font = "Bold 8px Verdana";

		// ctx.fillText("0ms", width+4, height-2);
		// ctx.fillText(maxPing+"ms", width+4, 10);
		
		// var ms = (pings.length > 0) ? pings[pings.length-1] : 0;
		// ctx.fillStyle = "rgb(255, 255, 255)";
		// ctx.fillText(ms+"ms", 4, 10);
		
		ctx.fillText(packetsPerUpdate+" p/u", 4, 25);
		ctx.fillText(charsPerUpdate+" c/u", 4, 40);
		
		var d, dx, dy, dat, dataCount = data.length;
		if (dataCount > 0) {
			ctx.strokeStyle = "rgb(0, 255, 0)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(width-(dataCount*2), height-(data[0]/(maxData/height)));
			for (d = 0; d < dataCount; d++) {
				dat = data[d];
				dx = (width-(dataCount*2))+(d*2);
				dy = height-(dat/(maxData/height));

				ctx.lineTo(dx, dy);
			};
			ctx.stroke();
		};
		
		// var p, px, py, ping, pingCount = pings.length;
		// if (pingCount > 0) {
		// 	ctx.strokeStyle = "rgb(255, 255, 255)";
		// 	ctx.lineWidth = 1;
		// 	ctx.beginPath();
		// 	ctx.moveTo(width-(pingCount*2), height-(pings[0]/(maxPing/height)));
		// 	for (p = 0; p < pingCount; p++) {
		// 		ping = pings[p];
		// 		px = (width-(pingCount*2))+(p*2);
		// 		py = height-(ping/(maxPing/height));

		// 		ctx.lineTo(px, py);
		// 	};
		// 	ctx.stroke();
		// };
		
		ctx.restore();
	};
	
	return {
		init: init,
		updateData: updateData,
		draw: draw
	}
};