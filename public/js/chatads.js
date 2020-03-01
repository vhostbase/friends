class chatads extends BaseClass
{
	postShow(){
		var userName = localStorage.getItem("userName");
		if(!userName){
			app.navigateTo('register', {});
		}else{
			app.navigateTo('contactPanel', {'userName': userName});
		}
	}
}