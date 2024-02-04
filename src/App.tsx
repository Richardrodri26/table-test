import { ColumnDef, ColumnOrderState, Header, Table, Updater, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import './App.css'
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';

interface IDefaultData {
  id: number;
  name: string;
  lastName: string;
  date: string;
}

const defaultData: IDefaultData[] = [
  {
    id: 1,
    name: "Nombre 1",
    lastName: "Apellido 1",
    date: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Nombre 2",
    lastName: "Apellido 2",
    date: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Nombre 3",
    lastName: "Apellido 3",
    date: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Nombre 3",
    lastName: "Apellido 3",
    date: new Date().toISOString(),
  },
]

const columnHelper = createColumnHelper<IDefaultData>()


const columns = [
  columnHelper.display({
    id: 'actions',
    cell: () => <>Action</>,
    enablePinning: true,
    meta: {
      left: "left-0"
    }

  }),
  columnHelper.accessor('id', {
    id: 'id',
    cell: info => info.getValue(),
    enablePinning: true,
    // meta: {
    //   left: "left-100"
    // }
  }),
  columnHelper.accessor(row => `${row.name} ${row.lastName}`, {
    id: 'FullName'
  }),
  columnHelper.accessor('date', {
    id: 'date',
    cell: info => dayjs(info.getValue()).format('DD/MM/YY')
  }),
  columnHelper.display({
    id: 'cummy column 1',
    cell: () => <>Dummy column</>
  }),
  columnHelper.display({
    id: 'cummy column 2',
    cell: () => <>Dummy column</>
  }),
  columnHelper.display({
    id: 'cummy column 3',
    cell: () => <>Dummy column</>
  }),
  columnHelper.display({
    id: 'cummy column 4',
    cell: () => <>Dummy column</>
  }),
];

interface IDynamicTableProps {
  // data: T[],
  // columns: ColumnDef<T, any>[]
  data: any[],
  columns: ColumnDef<any, any>[]

}

const DraggableColumnHeader: FC<{
  header: Header<IDefaultData, unknown>
  table: Table<IDefaultData>,
  id: string
}> = ({ header, table, id }) => {
  // Dnd
  const { isOver, setNodeRef, active, over, } = useDroppable({
    id: id,
  });

  const { attributes, listeners, setNodeRef: setNodeRefDraggable, transform } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // console.log('active', active)
  // console.log('isOver', isOver)
  // console.log('over', over)
  // console.log('node', node)



  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  // console.log('isOver', isOver)  

  // if (isOver) {
  //   // console.log('columnOrder', columnOrder)
  //   columnOrder.splice(
  //     columnOrder.indexOf((column?.id as string) || ''),
  //     0,
  //     columnOrder.splice(columnOrder.indexOf(active?.id as string), 1)[0] as string
  //   )
  //   // console.log('columnOrder end', columnOrder)
  //   setColumnOrder(columnOrder)
  // }

  const left = (header.column.columnDef?.meta as any)?.left as string | undefined

  return (
    <th
      scope="col"
      ref={setNodeRef}
      colSpan={header.colSpan}
      className={clsx('px-4 py-3 border border-gray-500 sticky z-20 top-0 bg-green-100', { 'sticky z-[10000] bg-purple-100': Boolean(left) }, left)}
    // style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* <div ref={previewRef}> */}
      <>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {/* <button ref={dragRef}>🟰</button> */}
        <button style={style} {...listeners} {...attributes} ref={setNodeRefDraggable}>🟰</button>
      </>
    </th>
  )

}



const DynamicTable = ({ data, columns: defaultColumns }: IDynamicTableProps) => {
  const [tableData, setTableData] = useState(data)
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columns] = useState(() => [...defaultColumns])
  // const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(defaultColumns.map(column => column.id as string))
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(columns.map(column => column.id as string))

  const table = useReactTable({
    data: tableData,
    // columns: defaultColumns,
    columns,
    state: {
      columnVisibility,
      columnOrder,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(), //row model
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const onChangeFirstOrder = () => {
    table.setColumnOrder((old) => {
      // console.log('old', old)
      return (old || []).reverse()
    })
  }

  const resetOrder = () => {
    console.log('reset')
    table.resetColumnOrder()
    // table.
    //  setColumnOrder(defaultColumns.map(column => column.id as string))
  }


  function handleDragEnd(event: DragEndEvent) {

    // console.log('event', event)
    // console.log('columnOrder', columnOrder)
    const targetColumnId = event.active.id as string
    const draggedColumnId = event?.over?.id as string

    // const currentOrder = [...table.getState().columnOrder]
    const currentOrder = table.getState().columnOrder

    // console.log('currentOrder', currentOrder)

    currentOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
    )

    // console.log('newOrder', currentOrder)



    table.setColumnOrder([...new Set(currentOrder)])
    // setColumnOrder(currentOrder)

  }

  // console.log('columnOrder', columnOrder)
  // console.log('table.getHeaderGroups()', table.getHeaderGroups())
  return (

    <div className='mx-auto'>
      <div>
        reverse order
      </div>
      <div onClick={onChangeFirstOrder}>
        change first order
      </div>

      <div onClick={resetOrder}>
        reset order
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
      >
        <table className='  max-w-[150px] overflow-auto border-separate table-cell'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              // <tr key={headerGroup.id}>
              //   {headerGroup.headers.map(header => (
              //     <th key={header.id} className='min-w-[100px] text-start'>
              //       {header.isPlaceholder
              //         ? null
              //         : flexRender(
              //             header.column.columnDef.header,
              //             header.getContext()
              //           )}
              //     </th>
              //   ))}
              // </tr>

              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <DraggableColumnHeader key={header.id} id={header.id} header={header} table={table} />
                ))}
              </tr>

            ))}
          </thead>

          <tbody className='bg-white'>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, index) => (
                  <td className={clsx("px-4 py-1 whitespace-nowrap border border-gray-500 bg-white", { "sticky left-0 z-10 bg-red-100": index === 0 })} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </DndContext>

      <pre>{JSON.stringify(table.getState().columnOrder, null, 2)}</pre>


    </div>
  )
}

function App() {

  return (
    <main className='flex justify-center items-center min-h-screen w-full'>
      <DynamicTable data={defaultData} columns={columns} />
    </main>
  )
}

export default App
