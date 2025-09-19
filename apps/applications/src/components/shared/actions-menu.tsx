import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";

const ITEM_HEIGHT = 48;

interface ActionsMenuProps<T> {
  item: T;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export const ActionsMenu = <T,>({
  item,
  onView,
  onEdit,
  onDelete,
}: ActionsMenuProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    if (onView) {
      onView(item);
    }
    handleClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item);
    }
    handleClose();
  };

  return (
    <IconButton
      aria-label="more"
      id="long-button"
      aria-controls={open ? "long-menu" : undefined}
      aria-expanded={open ? "true" : undefined}
      aria-haspopup="true"
      onClick={handleClick}
    >
      <MoreVert />
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "12ch",
            },
          },
        }}
      >
        {onView && <MenuItem onClick={handleView}>Visualizar</MenuItem>}
        {onEdit && <MenuItem onClick={handleEdit}>Editar</MenuItem>}
        {onDelete && <MenuItem onClick={handleDelete}>Deletar</MenuItem>}
      </Menu>
    </IconButton>
  );
};
