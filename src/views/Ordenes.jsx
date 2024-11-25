import useSWR from 'swr'
import clienteAxios from '../config/axios'
import formatearDinero from '../helpers'

import useQuiosco from '../hooks/useQuiosco'
export default function Ordenes() {

  const token = localStorage.getItem('AUTH_TOKEN')
  const fetcher = () => clienteAxios('/api/pedidos',{
    headers:{
      Authorization: `Bearer ${token}`
      }
  })

  const {data, error, isLoading}= useSWR('/api/pedidos', fetcher,
   {refreshInterval:1000}
  )

  const {handlePedidoCompleto}=useQuiosco();

  if(isLoading)return 'cargando...'

  console.log(data?.data);
  console.log(error);
  console.log(isLoading);
  

  return (
    <div>
          <h1 className="text-4xl font-black">Ordenes</h1>
          <p className="text-2xl my-10">Administra las ordenes de tus clientes desde aquí.</p>

          <div className='grid grid-cols-2 gap-5' >
              {data.data.data.map(pedido => (
                <div 
                key={pedido.id} className="p-5 bg-white shadow space-y-2 border-b">
                  <p className="text-xl font-bold text-slate-600">Contenido del pedido</p>
                  {pedido.productos.map(producto =>(
                    <div
                        key={producto.id}
                        className="border-b border-b-slate-200 last-of-type:border-none py-4"
                        >
                          <p className="text-sm">ID: {producto.id}</p>
                          <p>{producto.nombre}</p>

                          <p>
                            Cantidad: {''}
                            <span className='font-bold'>{producto.pivot.cantidad}</span>
                          </p>
                    </div>
                  ))}

                  <p className='text-lg font-bold text-slate-600'>
                    Cliente:{' '}
                    <span className='font-bold'>{pedido.user.name}</span>
                  </p>

                  <p className='text-lg font-bold text-amber-500'>
                    Total a pagar:{' '}
                    <span className='font-bold text-slate-600'>{formatearDinero(pedido.total)}</span>
                  </p>

                  <button 
                      type="button"
                      className="text-center bg-indigo-600  p-3 font-bold text-white truncate hover:bg-indigo-800"
                      onClick={ ()=> handlePedidoCompleto(pedido.id)}
                    >
                      completar pedido
                </button>


                </div>
                 ))}
          </div>
           
      </div>
  )
}