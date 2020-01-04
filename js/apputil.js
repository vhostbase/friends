let tharak = window;
$( document ).ready(function() {
	initAuth();
});
block_screen = () =>{
   $('.modal').modal('show');
};

unblock_screen = () =>{
	$('.modal').modal('hide');
};
tharak.navigateUrl = (url) =>{
	tharak.location.href = url;
};
tharak.getCurrentPath = () =>{
	return tharak.location.pathname;
};