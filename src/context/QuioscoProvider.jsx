import { createContext,  useState, useEffect} from "react";
//import { categorias as categoriasDB} from "../data/categorias" ya no es necesario ya tenemos la bd
import { toast } from "react-toastify";
import axios from "axios";
import clienteAxios from "../config/axios";


const QuioscoContext= createContext();

const QuioscoProvider = ({children})=>{

    const [categorias, setCategorias] = useState([]);
    //generando un segundo state
    const [categoriaActual, setCategoriaActual]= useState({});

        //función para filtrar categorías
    const handleClickCategoria= id=>{
        
            const categoria=categorias.filter(categoria => categoria.id === id)[0]
            
            setCategoriaActual(categoria)

           
            
            
        }

    //generar un nuevo state para el modal con la info del producto
    const [modal, setModal] = useState(false);
    



    const [producto, setProducto]=useState({})


    const[pedido, setPedido]=useState([]);

    const [total, setTotal] = useState(0);

    useEffect(()=>{
        const nuevoTotal= pedido.reduce( (total, producto) => (producto.precio * producto.cantidad) + total, 0)
        setTotal(nuevoTotal)
    }, [pedido])


    //obteniendo las categorías
    
    async function obtenerCategorias(){
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            const {data} = await clienteAxios('/api/categorias',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setCategorias(data.data);
            setCategoriaActual(data.data[0]);
            
        } catch (error) {
            console.log(error);
            
        }

    }
    //obtenemos las categorías tan pronto como cargue este componente
    useEffect( ()=> {
        obtenerCategorias();
    }, []) 


    const handleClickModal = ()=> {
        setModal(!modal);
    }



    const handleSetProducto= producto =>{
        setProducto(producto)
    }



    const handleAgregarPedido=({categoria_id, ...producto}) =>{ //lo que esta antes del spreead queda afuera
        //revisa que exista un pedido en el arreglo y despues lo actualiza
        if(pedido.some(pedidoState => pedidoState.id===producto.id)){
            //si esta el producto en el pedido
            const pedidoActualizado = pedido.map(pedidoState => pedidoState.id === 
                producto.id ? producto : pedidoState) //retorna un arreglo
                setPedido(pedidoActualizado)
                toast.success('Guardado Correctamente ')
        }else{
            setPedido([...pedido, producto ]);
            toast.success('Agregado al pedido')

            
        }
        
    }   


        //habilitando el botón editar
        const handleEditarCantidad= id =>{
            const productoActualizar = pedido.filter (producto => producto.id === id)[0]
            setProducto(productoActualizar)
            setModal(!modal)
            
        }


        const handleEliminarproducto=id =>{
            const pedidoActualizado = pedido.filter(producto => producto.id !== id)
            setPedido(pedidoActualizado)
            toast.success('Pedido eliminado')
        }



        const handleSubmitNuevaOrden = async (logout)=>{

            const token = localStorage.getItem('AUTH_TOKEN');
            try {
                const {data}= await clienteAxios.post('/api/pedidos',
                {
                    total,
                    productos: pedido.map(producto =>{
                        return {
                            id:producto.id,
                            cantidad: producto.cantidad
                        }
                    })
                },
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })

                toast.success(data.message)
                setTimeout(() => {
                    setpedido([]) 
                }, 1000);


                //cerrar session del usuario
                setTimeout(() => {
                    localStorage.removeItem('AUTH_TOKEN');
                    logout();
                }, 3000);
                } catch (error) {
                
            }
        }


        const handlePedidoCompleto= async (id)=>{
            const token = localStorage.getItem('AUTH_TOKEN');
            try {
                await clienteAxios.put(`/api/pedidos/${id}`, null ,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.log(error);
                
            }
            
        }







        const handleProductoAgotado= async (id)=>{
            const token = localStorage.getItem('AUTH_TOKEN');
            try {
                await clienteAxios.put(`/api/productos/${id}`, null ,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.log(error);
                
            }
            
        }
        
    
    return (
        <QuioscoContext.Provider
        value={{
            categorias,
            categoriaActual,
            modal,
            handleClickModal,
            handleClickCategoria, //tambien puedes hacer disponibles tus funciones
            producto, 
            handleSetProducto,
            pedido,
            handleAgregarPedido,
            handleEditarCantidad,
            handleEliminarproducto,
            total,
            handleSubmitNuevaOrden,
            handlePedidoCompleto,
            handleProductoAgotado
        }}
        >{children}</QuioscoContext.Provider>
    )
}


export {
    QuioscoProvider
}

export default QuioscoContext;