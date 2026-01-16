
/*===  inicio section resposiva  === */
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}
/*===  Final Section Resposiva  === */


/*===  Inicio section para arrastar livremente  === */
document.addEventListener('DOMContentLoaded', function () {
    const image = document.getElementById('tabela-img');
    const panzoom = Panzoom(image, {
    minScale: 0.1,
    maxScale: 1000,
    contain: 'false',
    canvas: true
    });
    image.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
});

