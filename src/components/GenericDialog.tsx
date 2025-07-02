
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface GenericDialogProps{   
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

const GenericDialog:React.FC<GenericDialogProps>=({open, title, onClose, children })=>{
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent dividers>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                Close
                </Button>
            </DialogActions>
        </Dialog>
    );

}
export default GenericDialog;