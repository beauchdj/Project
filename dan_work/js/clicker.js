var totalCount = 0;
function changeMessage() {
	document.getElementById("message").innerHTML = `🎉 You clicked the button! ${totalCount}`;
}
function increaseCount() {
	totalCount++;
}
