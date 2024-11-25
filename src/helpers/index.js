 export const formatearDinero = function(cantidad =0){
 
    return cantidad.toLocaleString('en-US',{
        style:'currency',
        currency: 'USD'
    });



}

export default formatearDinero