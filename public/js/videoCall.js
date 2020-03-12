class videoCall extends BaseClass
{
	constructor(){
		super();
		this.video = this.getWidgetByPath('#user-capture')[0];
	}
	postShow(){
		let retry = 4;
		
		if (navigator.mediaDevices != null && navigator.mediaDevices.getUserMedia != null) {
		  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(function (stream) {
			  this.video.srcObject = stream;
			  
			 // returns a frame encoded in base64
			const getFrame = () => {
				const canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				canvas.getContext('2d').drawImage(video, 0, 0);
				const data = canvas.toDataURL('image/png');
				return data;
			}
			/*SocketClient.sendVideo(window, function(){
				return getFrame();
			});*/
			}.bind(this))
			.catch(function (err0r) {
			  console.log("Something went wrong! "+JSON.stringify(err0r));
			  if(retry-- == 0)
				  return;
			  //startCapturing(caller);
			});
		}else if(navigator.webkitGetUserMedia){
			navigator.webkitGetUserMedia({ video: true }, function(stream){
				this.video.src = window.webkitURL.createObjectURL(stream);
				//video.play();
			}.bind(this), errBack);
		} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
			navigator.mozGetUserMedia({ video: true }, function(stream){
				this.video.srcObject = stream;
				//video.play();
			}.bind(this), errBack);
		}
	}
	onBack(){
		if (navigator.mediaDevices.getUserMedia) {
			var stream = this.video.srcObject;
			if(!stream)
				return;
			var tracks = stream.getTracks();
			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];
				track.stop();
			}
			this.video.srcObject = null;
		}
	}
}