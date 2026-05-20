import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { WishlistItem } from '../store/WishlistContext';
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const ItemTypes = {
  ROW: 'row',
};

interface DraggableRowProps {
  item: WishlistItem;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggableRow: React.FC<DraggableRowProps> = ({ item, index, moveRow, onEdit, onDelete }) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | null }>({
    accept: ItemTypes.ROW,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(dragItem, monitor) {
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveRow(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.ROW,
    item: () => {
      return { id: item.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  const priority = PRIORITIES.find(p => p.id === item.priority);
  const status = STATUSES.find(s => s.id === item.status);
  const category = CATEGORIES.find(c => c.id === item.category);

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      data-handler-id={handlerId}
      className="group border-b border-border hover:bg-muted/50 transition-colors bg-card text-sm"
    >
      <td className="p-3 w-10 text-center">
        <div ref={drag} className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-foreground">
          <GripVertical className="w-4 h-4" />
        </div>
      </td>
      <td className="p-3 font-medium text-foreground">{item.name}</td>
      <td className="p-3 text-muted-foreground max-w-[200px] truncate">{item.description}</td>
      <td className="p-3">
        {priority && (
          <div className="flex items-center gap-1.5" style={{ color: priority.color }}>
            <span className="font-bold text-base leading-none">{priority.icon}</span>
            <span className="text-xs font-medium">{priority.label}</span>
          </div>
        )}
      </td>
      <td className="p-3 font-medium text-foreground">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
      </td>
      <td className="p-3">
        {category && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="text-foreground text-sm">{category.label}</span>
          </div>
        )}
      </td>
      <td className="p-3">
        {status && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border">
             {status.label}
          </span>
        )}
      </td>
      <td className="p-3 text-right">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors focus:outline-none">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[120px] bg-popover rounded-md shadow-md border border-border p-1 z-50 text-sm text-popover-foreground">
              <DropdownMenu.Item 
                className="flex items-center px-2 py-1.5 outline-none hover:bg-muted cursor-pointer rounded-sm"
                onClick={() => onEdit(item)}
              >
                <Pencil className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                Sửa
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                className="flex items-center px-2 py-1.5 outline-none hover:bg-destructive/10 cursor-pointer rounded-sm text-destructive"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this item?")) {
                    onDelete(item.id);
                  }
                }}
              >
                <Trash className="w-3.5 h-3.5 mr-2 text-destructive" />
                Xóa
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </td>
    </tr>
  );
};
