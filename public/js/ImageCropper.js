class ImageCropper extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.fa-check').click(this.saveCroppedImage.bind(this));
		this.getWidgetByPath('#file-input').change(this.changePhoto.bind(this));
		this.img_w = document.querySelector('.img-w');
		this.image = this.getWidgetByPath('.result #origImg');
	}
	changePhoto(event){		
		var image = this.image;
		image.attr('src', '');
		image.attr('alt', event.target.files[0].name);
		var reader = new FileReader();
		reader.onloadend = function(event) {
			 image.attr('src',reader.result);
			 var imgOptions = {minContainerWidth: 350,
  minContainerHeight: 550};
			this.cropper = new Cropper(image[0], imgOptions);
		}.bind(this);
		reader.readAsDataURL(event.target.files[0]);
	}
	onNavigate(data){
	}
	postShow(){
		this.image.attr('src', '');
		this.getWidgetByPath('#file-input').val(null);
		this.getWidgetByPath('#file-input').click();
	}
	saveCroppedImage(event){
		event.preventDefault();
	  // get result to data uri
	  let imgSrc = this.cropper.getCroppedCanvas({
		width: this.img_w.value // input value
	  }).toDataURL();
	  this.cropper.destroy();
	  this.image.attr('src', '');
	  this.getWidgetByPath('#file-input').val(null);
	  var fileName = this.image.attr('alt');
	  app.navigateTo('chgProfile', {'item': 'cropped', 'imageSrc': imgSrc, 'fileName' : fileName});
	}
	onBack(){
		if(this.cropper)
			this.cropper.destroy();
		this.image.attr('src', '');
		this.getWidgetByPath('#file-input').val(null);
	}
}