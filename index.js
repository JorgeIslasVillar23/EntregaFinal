let productos
let catProductos

let boton = document.getElementById('btnPrincipal')
boton.addEventListener('click',inicio)

const guardaLocal= (clave, valor) => {localStorage.setItem(clave, valor)}
const pedirDatos = async () => {
    let data = await fetch('https://fakestoreapi.com/products')
    let dataParser = await data.json()
    guardaLocal('ListaProductosStorage',JSON.stringify(dataParser))
    pintar();
}


if(localStorage.getItem('ListaProductosStorage') == null){
    pedirDatos()
}else{
    pintar();
}







function pintar(){
    productosPin = JSON.parse(localStorage.getItem('ListaProductosStorage'))
    catProductos = productosPin
    let listaProductos = document.getElementById('listaProductos')
    for (const producto of productosPin){
        let li = document.createElement('tr')
        li.classList.add('table','table-striped','table-hover')
        li.innerHTML = ` 

        <td class="table-striped table-hover">${producto.id}</td>   
        <td class="table-striped table-hover">${producto.title}</td>  
        <td class="table-striped table-hover">${producto.price}</td>  
        <td class="table-striped table-hover"><img  src="${producto.image}" width="100" height="100"></td>
        `
        listaProductos.appendChild(li)
    }
}


function inicio(){
    Swal.fire({
             title: '¿Desea Realizar una compra?',

             confirmButtonText: 'Si',
             showCancelButton: true,
             cancelButtonText: 'No'
         })
         .then(resultado=>{
            confirmarCompra(resultado.isConfirmed)
         })
    
}

function confirmarCompra(accion){
    if(accion){
        procesoDeCompra()
    }else if(accion === false){
        Swal.fire({
            title: '¡Gracias por visitarnos, vuelva pronto!'
        })
    }
}

async function procesoDeCompra(){
    let producto
    let cantidad 
   const { value: idProd } = await  Swal.fire({
       title: 'Elija el producto(ID)',
       input: 'text',
       inputValue: producto,
       inputAttributes: {
         autocapitalize: 'off'
       },
       confirmButtonText: 'Aceptar',
       inputValidator: (value) => {
           if (!value) {
             return 'You need to write something!'
           }
         }
   })
   if (idProd) {
     producto = idProd
   }



   const { value: cantSwal } = await Swal.fire({
       title: 'Cantidad del producto escogido',
       input: 'text',
       inputValue: cantidad,
       inputAttributes: {
         autocapitalize: 'off'
       },
       confirmButtonText: 'Aceptar',
       inputValidator: (value) => {
           if (!value) {
             return 'You need to write something!'
           }
         }
   })
   if (cantSwal) {
    cantidad = cantSwal
  }

  
    let cumplido = true;
    let subtotal= 0;
    producto=Number(producto)
    cantidad=Number(cantidad)
   
    subtotal = calcularSubTotal(catProductos[producto-1].price,cantidad)
    if(cumplido){
        if(productos === undefined){
            productos = [{
                id:producto,
                cantidad:cantidad,
                costo:catProductos[producto - 1].price,
                subTotal:subtotal
            }]
        }else{
            productos[productos.length]={
                id:producto,
                cantidad:cantidad,
                costo:catProductos[producto - 1].price,
                subTotal:subtotal
            }
        }
        pintarTablaCarrito()

        Swal.fire({
            title: '¿Desea comprar otro Producto?',
            confirmButtonText: 'Si',
            showCancelButton: true,
            cancelButtonText: 'No'
        })
        .then(resultado=>{
            if(resultado.isConfirmed){
                procesoDeCompra()
            }else{
                calcularTotal()
            }
        })

    }else{
        alert('No accedio un comando valido')
    }
}

function pintarTablaCarrito(){
    let listaCarrito = document.getElementById('listaCarrito')
    listaCarrito.innerHTML = "<tbody><tr>   \n        <th> Cantidad </th> \n        <th> Precio </th>\n        <th> subtotal </th>\n        <th> Foto </th>\n        </tr> </tbody>"
    for (const producto of productos){
        let li = document.createElement('tr')
        li.classList.add('table','table-striped','table-hover')
        li.innerHTML = ` 

        <td class="table-striped table-hover">${producto.cantidad}</td>   
        <td class="table-striped table-hover">${producto.costo}</td>  
        <td class="table-striped table-hover">${producto.subTotal}</td>  
        <td class="table-striped table-hover"><img  src="${catProductos[producto.id-1].image}" width="100" height="100"></td>
        `
        listaCarrito.appendChild(li)
    }
}

function calcularSubTotal(costo,cantidad){
    return costo * cantidad
}

function calcularTotal(){
    let total =0;
    let mensaje = ''
    for(let a = 0; a < productos.length; a++){
        mensaje += 'Producto: ' + catProductos[productos[a].id -1].title + ' Cantidad: ' + productos[a].cantidad + ' Costo individual: $' + productos[a].costo + ' SubTotal: $' + productos[a].subTotal + ' \n'
        total = total + productos[a].subTotal
    }
    mensaje += '\n TOTAL: $' + total
    Swal.fire(mensaje)
    productos = undefined
}

function suma(num1, num2){
    return num1 + num2;
}

function resta(num1, num2){
    return num1 - num2;
}

function multiplicar(num1, num2){
    return num1 * num2;
}

function dividir(num1, num2){
    return num1 / num2;
}