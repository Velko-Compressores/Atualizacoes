/*===  Abrir Modal Aviso Software Bitzer  === */
document.getElementById('abrirModalSoftware').onclick=function(e){
    e.preventDefault();document.getElementById('modalBitzer').style.display='block'
};
document.getElementById('fecharModal').onclick=function(){
    document.getElementById('modalBitzer').style.display='none'
};
window.onclick=function(e){
    let m=document.getElementById('modalBitzer');if(e.target===m){m.style.display='none'}
}