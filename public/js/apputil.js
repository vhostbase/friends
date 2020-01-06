let tharak = window;
$( document ).ready(function() {
	initAuth();
});
block_screen = () =>{
	if(!isDebug)
		$('.modal').modal('show');
};

unblock_screen = () =>{
	if(!isDebug)
	$('.modal').modal('hide');
};
tharak.navigateUrl = (url) =>{
	tharak.location.href = url;
};
tharak.getCurrentPath = () =>{
	return tharak.location.pathname;
};